/******************************************************************************\
|                                                                              |
|                          connection-manager-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and managing connections.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Connection from '../../../models/connections/connection.js';
import Group from '../../../models/connections/group.js';
import Member from '../../../models/connections/member.js';
import Gesture from '../../../models/gestures/gesture.js';
import Connections from '../../../collections/connections/connections.js';
import Groups from '../../../collections/connections/groups.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import ConnectionShareable from '../../../views/apps/common/behaviors/sharing/connection-shareable.js';
import ConnectionInfoShowable from '../../../views/apps/connection-manager/dialogs/info/behaviors/connection-info-showable.js';
import HeaderBarView from '../../../views/apps/connection-manager/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/connection-manager/sidebar/sidebar-view.js';
import ContextMenuView from '../../../views/apps/connection-manager/context-menus/context-menu-view.js';
import FooterBarView from '../../../views/apps/connection-manager/footer-bar/footer-bar-view.js';
import UserConnectionsView from '../../../views/apps/connection-manager/mainbar/user-connections-view.js';
import ConnectionRequestsDropdownView from '../../../views/apps/connection-manager/connection-requests/connection-requests-dropdown-view.js';
import FindConnectionsDialogView from '../../../views/apps/connection-manager/dialogs/connections/find-connections-dialog-view.js';
import SelectConnectionsDialogView from '../../../views/apps/connection-manager/dialogs/connections/select-connections-dialog-view.js';
import ConnectionInfoDialogView from '../../../views/apps/connection-manager/dialogs/info/connection-info-dialog-view.js';
import ShareWithConnectionsDialogView from '../../../views/apps/connection-manager/dialogs/sharing/share-with-connections-dialog-view.js';
import ConnectionRequestDialogView from '../../../views/apps/connection-manager/dialogs/connections/connection-request-dialog-view.js';
import PreferencesFormView from '../../../views/apps/connection-manager/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, LinkShareable, ConnectionShareable, ConnectionInfoShowable, {

	//
	// attributes
	//

	name: 'connection_manager',

	events: {
		'click': 'onClick',
		'contextmenu': 'onContextMenu'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);
		
		// set optional parameters
		//
		if (this.options.hidden) {
			this.hidden = this.options.hidden;
		}
		if (this.options.dialog) {
			this.dialog = this.options.dialog;
		}
		if (this.options.preferences) {
			if (this.options.preferences.get('view_kind') == 'maps') {
				if (!this.model.contents.hasGeolocation()) {
					this.options.preferences.set('view_kind', 'icons');
				}
			}
		}
		
		// set attributes
		//
		if (!this.model) {
			this.model = application.session.user;
		}
		this.collection = new Connections();
		this.groups = new Groups();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// attribute methods
	//

	title: function() {
		return this.hasSelectedGroup()? this.getSelectedGroup().getName() : config.apps[this.name].name;
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasSelected();
		}
	},

	hasSelectedMember: function() {
		let selected = this.getSelectedModel() || false;
		return selected && (selected instanceof Connection);
	},

	hasSelectedGroup: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').numSelected();
		}
	},

	//
	// getting methods
	//

	getUrl: function() {
		if (this.hasSelected() && !this.hasSelectedGroup()) {
			return this.getSelectedModel().getUrl();
		}
	},

	getSelected: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').getSelected();
		}
	},
	
	getSelectedGroup: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getSelectedModel();
		}
	},

	getSelectedModel: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').getSelectedModel();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').getSelectedModels();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// selecting methods
	//

	select: function(which) {

		// select connection or group
		//
		if (this.hasSelected()) {
			this.selectConnection(which);
		} else {
			this.selectGroup(which);	
		}
	},

	selectConnection: function(which) {
		this.getChildView('content').select(which);
	},

	selectGroup: function(which) {
		this.getChildView('sidebar').select(which);
	},

	//
	// opening methods
	//

	openConnection: function(connection) {
		let effect = application.settings.theme.get('icon_open_effect');

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected && item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show connection's profile info
		//
		application.showUser(connection);
	},

	//
	// deleting methods
	//
	
	deleteConnections: function(connections, options) {
		let names = new Connections(connections).getNames();
		let list = names.toList();

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {
			
			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Connections",
				message: "Are you sure you want to delete " + list + " from your connections?",
				
				// callbacks
				//
				accept: () => {
					this.deleteConnections(connections, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// remove connections from your connections list
			//
			this.collection.disconnectFrom(application.session.user, {

				// callbacks
				//
				success: () => {

					// remove connections
					//
					this.connections.remove(connections);

					// play delete sound
					//
					application.play('delete');

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Connections Deleted',
						message: list + ' ' + (names.length == 1? 'was' : 'were') + " deleted from your connections list."
					});
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete connections.",
						response: response
					});
				}
			});
		}
	},

	deleteItems: function(items, options) {
		let selected;

		if (!items) {
			return;
		}

		// find selected model
		//
		if (items.length > 0) {
			selected = items[0];
		} else {
			selected = items;
		}

		// show / hide applicable menu options
		//
		if (selected instanceof Member) {
			this.getChildView('sidebar').getChildView('groups').deleteMembers(items, options);
		} else if (selected instanceof Group) {
			this.getChildView('sidebar').getChildView('groups').deleteGroups(items, options);
		} else {
			this.deleteConnections(items, options);
		}
	},

	deleteSelectedConnections: function() {
		this.deleteItems(this.getSelectedModels());
	},

	//
	// group methods
	//

	getSelectedGroups: function() {
		return this.getChildView('sidebar').getChildView('groups').getChildView('items').getSelectedModels();
	},

	deleteGroups: function(groups) {
		this.getChildView('sidebar').getChildView('groups').deleteGroups(groups);
	},

	//
	// searching methods
	//

	searchFor: function(search) {

		// update button bar
		//
		if (this.hasChildView('header buttons')) {
			this.getChildView('header buttons').goto(search, {
				silent: true
			});
		}

		// perform search
		//
		new Connections().fetchByUser(application.session.user, {
			data: search,

			// callbacks
			//
			success: (collection) => {

				// update attributes
				//
				this.search = search;

				// update views
				//
				this.setConnections(collection.models);

				// show message
				//
				if (collection.length == 0) {
					this.showMessage("No connections found.", {
						icon: '<i class="fa fa-user-friends"></i>'
					});
				} else {
					this.hideMessage();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find connections.",
					response: response
				});
			}
		});
	},

	clearSearch: function() {

		// clear search bar
		//
		this.getChildView('header').clearSearchBar();

		// reset collection
		//
		this.reset();

		// clear search attributes
		//
		this.preferences.set({
			search_kind: null
		});

		// clear navigation
		//
		if (this.hasChildView('header buttons')) {
			this.getChildView('header buttons').reset();
		}

		// show message
		//
		if (this.collection.length == 0) {
			this.showMessage("No connections.", {
				icon: '<i class="fa fa-user-friends"></i>',
				
				// callbacks
				//
				onclick: () => {
					this.showFindConnectionsDialog();
				}
			});
		} else {
			this.hideMessage();			
		}
	},

	setSearch: function(search) {
		let kind = search? Object.keys(search)[0] : '';
		let value = search? search[kind] : '';

		this.hideMessage();

		// check if search has changed
		//
		if (!search) {

			// clear search bar
			//
			this.clearSearch();
		} else if (search != this.search) {

			// show search bar
			//
			this.getChildView('header').showSearchBar(kind, value);
		}

		// set menu
		//
		this.getChildView('header menu search').setSearchKind(kind);

		// perform search
		//
		if (value) {

			// perform search
			//
			this.searchFor(value);
		} else {
			this.setConnections(this.collection.models);
		}
	},

	setConnections: function(connections) {

		// set attributes
		//
		this.connections = new Connections(connections);
		this.search = null;

		// update main bar
		//
		this.showContent();

		// show message if no content
		//
		this.showStatusMessage();

		// update footer bar
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').onChange();
		}
	},

	//
	// rendering methods
	//

	showChatMessage: function(chat, message) {
		application.launch('chat_viewer', {
			model: chat,
			message: message
		});
	},

	//
	// sharing methods
	//

	shareWithSelected: function(options) {
		this.shareWithConnections(this.getSelectedModels(), null, options);
	},

	shareItemsWithSelected: function(items, options) {
		this.shareWithConnections(this.getSelectedModels(), items, options);
	},

	shareMessageWithSelected: function() {
		import(
			'../../../collections/chats/chats.js'
		).then((Chats) => {
			new Chats.default().fetch({

				// callbacks
				//
				success: (collection) => {
					let user = this.getSelectedModel();
					let chat = collection.getChatByUser(user);
					let message = config.apps.connection_manager.connection_message;

					// show user's chat
					//
					this.showChatMessage(chat, message);
				}
			});
		});
	},

	shareGestureWithSelected: function(kind) {
		let connection = this.getSelectedModel();
		new Gesture().save({
			kind: kind,
			recipient_id: connection.get('id')
		}, {

			// callbacks
			//
			success: (model) => {

				// play gesture sound
				//
				model.play();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Gesture Shared',
					message: 'You just sent ' + connection.get('short_name') + ' a ' + kind + '.'
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Could not save gesture.'
				});
			}
		});
	},

	shareSelectedByTopic: function(options) {
		let connection = this.getSelectedModel();
		this.shareLinkByTopic(connection.getUrl(), _.extend({}, options, {
			message: connection.get('short_name') + ': ' + '\n'
		}));
	},

	shareSelectedByMessage: function(options) {
		let connection = this.getSelectedModel();
		this.shareLinkByMessage(connection.getUrl(), _.extend({}, options, {
			message: connection.get('short_name') + ': ' + '\n'
		}));
	},

	shareSelectedByLink: function() {
		let connection = this.getSelectedModel();
		this.showShareByLinkDialog(connection.getUrl());
	},

	shareSelectedByEmail: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/sharing/share-by-email-dialog-view.js'
		).then((ShareByEmailDialogView) => {

			// show share by email dialog
			//
			this.show(new ShareByEmailDialogView.default({
				model: this.getSelectedModel()
			}));
		});
	},

	load: function() {

		// fetch user connections
		//
		this.collection.fetchByUser(this.model, {

			// callbacks
			//
			success: (collection) => {

				// show content
				//
				this.setConnections(collection.toArray());
				if (!this.options.hidden || !this.options.hidden['footer-bar']) {
					this.showFooterBar();
				}
				this.onLoad();

				// show message
				//
				if (!this.options.search_kind && collection.length == 0) {
					this.showMessage("No connections.", {
						icon: '<i class="fa fa-user-friends"></i>',
						
						// callbacks
						//
						onclick: () => {
							this.showFindConnectionsDialog();
						}
					});
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's connections.",
					response: response
				});
			}
		});
	},
	
	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// load connections
		//
		this.load();
	},

	reset: function() {
		this.setConnections(this.collection.models);
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView({
			collection: this.collection
		});
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			collection: this.groups,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelectGroup(item),
			ondeselect: (item) => this.onDeselectGroup(item),
			onopen: (item) => this.onOpen(item),
			onchange: () => this.onChange()
		});
	},

	getContentView: function() {
		return new UserConnectionsView({
			collection: this.connections,

			// options
			//
			preferences: this.preferences,
			multicolumn: true,

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: true,
			droppable: true,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropon: (items, item) => this.onDropOn(items, item)
		});
	},

	getContextMenuView: function() {
		return new ContextMenuView();
	},

	showStatusMessage: function() {
		if (this.connections.length == 0) {
			if (this.hasSelectedGroup()) {
				this.showMessage("No connections in this group.", {
					icon: '<i class="fa fa-user-friends"></i>'
				});
			} else {
				this.showMessage("No connections.", {
					icon: '<i class="fa fa-user-friends"></i>',
					
					// callbacks
					//
					onclick: () => {
						this.showFindConnectionsDialog();
					}
				});
			}
		} else {
			this.hideMessage();
		}
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showFindConnectionsDialog: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/connections/find-connections-dialog-view.js'
		).then((FindConnectionsDialogView) => {

			// show find connections dialog
			//
			this.show(new FindConnectionsDialogView.default());
		});	
	},

	showNewGroupDialog: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/groups/new-group-dialog-view.js'
		).then((NewGroupDialogView) => {

			// show new group dialog
			//
			this.show(new NewGroupDialogView.default({

				// callbacks
				//
				onsave: (group) => {
					this.groups.add(group);
				}
			}));
		});
	},

	showEditGroupDialog: function(group) {
		import(
			'../../../views/apps/connection-manager/dialogs/groups/edit-group-dialog-view.js'
		).then((EditGroupDialogView) => {

			// show edit group dialog
			//
			this.show(new EditGroupDialogView.default({
				model: group
			}));
		});
	},

	showInfoDialog: function(options) {
		let connections = this.getSelectedModels();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show info after delay
		//
		window.setTimeout(() => {
			if (connections.length == 1) {
				this.showConnectionInfoDialog(connections[0], options);
			} else if (connections.length > 1) {
				this.showConnectionsInfoDialog(connections, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No connections selected."
				});
			}
		}, delay);
	},

	showGestureDialog: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/sharing/share-gesture-dialog-view.js'
		).then((ShareGestureDialogView) => {

			// show gesture dialog
			//
			this.show(new ShareGestureDialogView.default({

				// callbacks
				//
				onsubmit: (kind) => {
					this.shareGestureWithSelected(kind);
				}
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// item event handling methods
	//

	onOpen: function(item) {
		if (!item || !item.model || !(item.model instanceof Connection)) {
			return;
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		} else {
			this.openConnection(item.model);
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update mainbar to match selected sidebar group
		//
		if (this.hasSelectedGroup()) {
			let group = this.getChildView('sidebar').getChildView('groups').getSelected()[0].model;
			this.setConnections(group.get('members').models);
		}
	},

	//
	// selection event handling methods
	//

	onSelectGroup: function(item) {

		// check that we are selecting group view
		//
		if (!item.model || !(item.model instanceof Group)) {
			return;
		}

		// set attributes
		//
		this.selected = item;

		// update view
		//
		this.setConnections(item.model.get('members').models);
		if (!this.options.dialog) {
			this.setTitle(this.title());
		}
		this.onSelect();
	},

	onDeselectGroup: function() {
		this.selected = null;
		this.setConnections(this.collection.models);
		if (!this.options.dialog) {
			this.setTitle(this.title());
		}
		this.onDeselect();
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items, connectionView) {

		// unhighlight dropped item
		//
		connectionView.unhighlight();
		
		// check if dropped item is shareable
		//
		if (items[0] instanceof File || items[0] instanceof Directory) {
			let connections = connectionView.model? [connectionView.model] : null;

			// play drop sound
			//
			application.play('drop');
		
			// show share dropped items with highlighted connections
			//
			this.shareWithConnections(connections, items);
		}
	}
}), {

	//
	// static methods
	//

	fetchMutualConnections(model, options) {
		new Connections().fetchMutual(application.session.user, model, options);
	},

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getConnectionRequestsDropdownView: function(model) {
		return new ConnectionRequestsDropdownView({
			model: model
		});
	},

	getUserConnectionsView: function(options) {
		return new UserConnectionsView(options);
	},

	//
	// static dialog rendering methods
	//

	showFindConnectionsDialog: function() {
		application.show(new FindConnectionsDialogView());
	},

	showSelectConnectionsDialog: function(options) {
		application.show(new SelectConnectionsDialogView(options));
	},

	showConnectionInfoDialog: function(model) {
		application.show(new ConnectionInfoDialogView({
			model: model
		}));
	},

	showShareWithConnectionsDialog: function(options) {
		application.show(new ShareWithConnectionsDialogView(options));
	},

	showConnectionRequestDialog: function(options) {
		application.show(new ConnectionRequestDialogView(options));
	}
});