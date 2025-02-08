/******************************************************************************\
|                                                                              |
|                            profile-browser-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing and finding people.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Users from '../../../collections/users/users.js';
import Contacts from '../../../collections/contacts/contacts.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ConnectionShareable from '../../../views/apps/common/behaviors/sharing/connection-shareable.js';
import GoogleContactsImportable from '../../../views/apps/common/behaviors/importing/google-contacts-importable.js';
import HeaderBarView from '../../../views/apps/profile-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/profile-browser/sidebar/sidebar-view.js';
import UsersView from '../../../views/apps/profile-browser/mainbar/users/users-view.js';
import FooterBarView from '../../../views/apps/profile-browser/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/clock/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, ConnectionShareable, GoogleContactsImportable, {

	//
	// attributes
	//

	name: 'profile_browser',

	events: {
		'click > .body': 'onClick',
		'contextmenu > .body': 'onContextMenu'
	},

	//
	// constructor
	//

	initialize: function() {
	
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);
		
		// set attributes
		//
		this.collection = new Users();
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

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setUsers: function(users) {

		// set attributes
		//
		this.collection.reset(users);
		this.search = null;

		// update main bar
		//
		if (this.collection.length == 0) {
			this.showMessage("No people found.", {
				icon: '<i class="far fa-user"></i>'
			});
		} else {
			this.hideMessage();	
		}

		// update
		//
		this.onChange();
	},

	clear: function() {
		this.collection.reset();

		// update
		//
		this.onChange();
	},

	//
	// selecting methods
	//

	openSelected: function() {
		application.showUsers(this.getSelectedModels());
	},

	showInfo: function() {
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show info for each selected person after delay
		//
		window.setTimeout(() => {
			let selected = this.getSelected();
			for (let i = 0; i < selected.length; i++) {
				this.onOpen(selected[i]);
			}
		}, delay);
	},

	//
	// searching methods
	//

	searchFor: function(search) {

		// update message
		//
		if (search && search != '') {
			this.hideMessage();
		} else {
			this.showMessage("Search for people you know.", {
				icon: '<i class="fa fa-user"></i>'
			});
			this.clear();

			// update footer
			//
			if (this.hasChildView('footer info')) {
				this.getChildView('footer info').onChange();
			}
		
			return;
		}

		// update nav bar
		//
		this.getChildView('header nav').goto(search, {
			silent: true
		});

		// perform search
		//
		new Users().fetchUnconnected({

			// options
			//
			data: {
				name: search
			},

			// callbacks
			//
			success: (collection) => {

				// update attributes
				//
				this.search = search;

				// update views
				//
				this.setUsers(collection.models);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find people.",
					response: response
				});
			}
		});
	},

	clearSearch: function() {

		// clear search bar
		//
		if (this.hasChildView('header search')) {
			this.getChildView('header search').remove();
		}

		// clear navigation
		//
		this.getChildView('header nav').reset();

		// clear view
		//
		this.hideMessage();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showHeaderBar();
		this.showContents();

		// show / hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		// enable / disable send requests
		//
		this.getChildView('sidebar').setNumSelected(this.numSelected());
		
		// show initial help message
		//
		this.showMessage("Search for people you know.", {
			icon: '<i class="fa fa-user"></i>'
		});
		this.onLoad();
	},

	onShow: function() {

		// set focus
		//
		this.$el.find('.search-bar input').focus();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			hidden: this.options.hidden
		});
	},

	getContentView: function() {
		return new UsersView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: true,
			droppable: false,

			// callbacks
			//
			onselect: (items) => this.onSelect(items),
			ondeselect: (items) => this.onDeselect(items),
			onopen: (item) => this.onOpen(item),
			ondropon: (items, item) => this.onDropOn(items, item)
		});
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

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/profile-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showConnectionRequestDialog: function(users) {
		import(
			'../../../views/apps/connection-manager/dialogs/connections/connection-request-dialog-view.js'
		).then((ConnectionRequestDialogView) => {

			// show connection request dialog
			//
			this.show(new ConnectionRequestDialogView.default({
				model: application.session.user,
				collection: new Users(users)
			}));
		});
	},

	//
	// event handling methods
	//

	onOpen: function(item) {

		// open selected profile
		//
		if (!this.options.onopen) {
			application.showUser(item.model);
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getUsersView: function(options) {
		return new UsersView(options);
	},

	//
	// static inviting methods
	//

	inviteGoogleContacts: function(contacts) {
		import(
			'../../../views/apps/profile-browser/dialogs/invitations/invite-google-contacts-dialog-view.js'
		).then((InviteGoogleContactsDialogView) => {

			// show invite google contacts dialog
			//
			application.show(new InviteGoogleContactsDialogView.default({
				collection: new Contacts(contacts),
				message: config.apps.profile_browser.invitation_message
			}));
		});
	}
});