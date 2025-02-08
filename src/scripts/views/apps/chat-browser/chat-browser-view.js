/******************************************************************************\
|                                                                              |
|                              chat-browser-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing and finding chats.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Chats from '../../../collections/chats/chats.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ChatInfoShowable from '../../../views/apps/chat-browser/dialogs/info/behaviors/chat-info-showable.js';
import HeaderBarView from '../../../views/apps/chat-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/chat-browser/sidebar/sidebar-view.js';
import ChatsView from '../../../views/apps/chat-browser/mainbar/chats/chats-view.js';
import FooterBarView from '../../../views/apps/chat-browser/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/chat-browser/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, ChatInfoShowable, {

	//
	// attributes
	//

	name: 'chat_browser',

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
		this.collection = new Chats();
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
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setChats: function(chats) {

		// set attributes
		//
		this.collection.reset(chats);
		this.search = null;

		// update main bar
		//
		if (this.collection.length == 0) {
			this.showMessage("No chats found.", {
				icon: '<i class="fa fa-comments"></i>'
			});
		} else {
			this.hideMessage();	
		}

		// update footer bar
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},
	
	//
	// selecting methods
	//

	select: function(which) {
		this.getChildView('content').select(which);
	},

	openSelected: function() {
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// open selected chats in chat viewer after delay
		//
		window.setTimeout(() => {
			this.showSelectedChats();
		}, delay);
	},

	endChat: function(chat, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm end chat
			//
			application.confirm({
				message: "Are you sure that you want to leave your chat with " + chat.getName() + '?',

				// callbacks
				//
				accept: () => {
					this.endChat(chat, {
						confirm: false
					});
				}
			});
		} else {

			// remove current user from chat
			//
			chat.removeMember(application.session.user, {

				// callbacks
				//
				success: () => {

					// set current chat
					//
					this.model = this.collection.at(0);

					// update
					//
					this.showContents();

					// play remove sound
					//
					application.play('remove');
				}
			});
		}
	},

	endSelectedChat: function() {
		if (this.hasSelected()) {
			this.endChat(this.getSelectedModel());
		}
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
		this.collection.fetch({

			// callbacks
			//
			success: (collection) => {
				this.setChats(collection.models);
				this.onLoad();
			}
		});

		// this.showContents();

		// show / hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}
		
		// show initial help message
		//
		this.showMessage("Loading chats...", {
			icon: '<i class="fa fa-spin fa-spinner"></i>',
		});
	},

	showChats: function(chats) {
		application.launch('chat_viewer', {
			collection: new Chats(chats)
		});
	},

	showSelectedChats: function() {
		this.showChats(this.getSelectedModels());
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
			hidden: this.options.hidden,
			onsave: this.options.onsave,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
	},

	getContentView: function() {
		return new ChatsView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			draggable: true,
			droppable: false,
			editable: false,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
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

	showChatInvitationsDialog: function(chat) {
		import(
			'../../../views/apps/chat-browser/dialogs/invitations/chat-invitations-dialog-view.js'
		).then((ChatInvitationsDialogView) => {

			// show chat invitations dialog
			//
			this.show(new ChatInvitationsDialogView.default({
				model: chat,
				message: chat? config.apps.chat_viewer.join_chat_invitation_message : 
					config.apps.chat_viewer.new_chat_invitation_message
			}));
		});		
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/chat-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showInfoDialog: function(options) {
		let items = this.getSelectedModels();
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
			if (items.length == 1) {
				this.showChatInfoDialog(items[0], options);
			} else if (items.length > 1) {
				this.showChatsInfoDialog(items, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No items selected."
				});
			}
		}, delay);
	},

	//
	// event handling methods
	//

	onOpen: function(item) {

		// open selected chats
		//
		if (!this.options.onopen) {
			this.openSelected();
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	//
	// rendering event handling methods
	//

	onShow: function() {

		// set focus
		//
		this.$el.find('.search-bar input').focus();
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});