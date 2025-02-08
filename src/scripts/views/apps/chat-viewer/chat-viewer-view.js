/******************************************************************************\
|                                                                              |
|                             chat-viewer-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for sending and receiving direct             |
|        messages.                                                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Post from '../../../models/topics/post.js'; 
import Directory from '../../../models/storage/directories/directory.js';
import File from '../../../models/storage/files/file.js';
import Item from '../../../models/storage/item.js';
import ChatMessage from '../../../models/chats/chat-message.js';
import Chats from '../../../collections/chats/chats.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import MultiDoc from '../../../views/apps/common/behaviors/tabbing/multidoc.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import ChatInfoShowable from '../../../views/apps/chat-browser/dialogs/info/behaviors/chat-info-showable.js';
import HeaderBarView from '../../../views/apps/chat-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/chat-viewer/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/chat-viewer/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/chat-viewer/footer-bar/footer-bar-view.js';
import OpenChatsDialogView from '../../../views/apps/chat-viewer/dialogs/chats/open-chats-dialog-view.js';
import PreferencesFormView from '../../../views/apps/chat-viewer/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, MultiDoc, ContainableSelectable, MultiSelectable, ItemOpenable, ItemInfoShowable, ChatInfoShowable, {

	//
	// attributes
	//

	name: 'chat_viewer',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.model && this.collection) {
			this.model = this.collection.at(this.collection.length - 1);
		}
		if (!this.collection) {
			this.collection = new Chats();
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let activeView = this.getActiveView();
			if (activeView && activeView.each) {
				activeView.each(callback, filter, options);
			}
		}
	},

	//
	// querying methods
	//

	hasSelectedChat: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').hasSelected();
		}
	},

	hasOpenChat: function() {
		return !this.collection.isEmpty();
	},

	hasOpenChats: function() {
		return this.collection.length > 1;
	},

	hasSelectedMessage: function() {
		if (this.hasActiveView()) {
			return this.getActivePaneView().hasSelected();
		}
	},

	//
	// counting methods
	//

	numChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').numChildren();
		}
	},

	numOpenChats: function() {
		return this.collection.length;
	},

	numMessages: function() {
		if (this.hasActiveView()) {
			return this.getActivePaneView().numChildren();
		}
	},

	//
	// getting methods
	//

	getChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').getChildModels();
		}
	},

	getSelectedChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').getSelectedModels();
		}
	},

	getOpenChats: function() {
		return this.collection.toArray();
	},

	getSelectedOpenChat: function() {
		return this.model;
	},

	getMessages: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getChildModels();
		}
	},

	getSelectedMessages: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedModels();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// mainbar options
			//
			case 'show_elapsed_time':
			case 'messages_per_page':
			case 'translation':
			case 'language':
				this.preferences.set(key, value);
				this.showContent();
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	setSearch: function(search) {
		let kind = search? Object.keys(search)[0] : '';
		let value = search? search[kind] : '';
		let searchKind = kind? kind.replace(/-/g, '_') : undefined;

		// set menu
		//
		this.getChildView('header menu search').setSearchKind(searchKind);

		// set search bar
		//
		this.getChildView('header').showSearchBar(searchKind, value);
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.getActiveView().select(which);
	},

	editSelected: function() {
		let item = this.selected;
		if (item && item.model instanceof ChatMessage) {
			if (item.model.isOwnedBy(application.session.user)) {
				item.edit();
			}
		}
	},

	deleteSelected: function() {
		let item = this.selected;
		if (item && item.model instanceof ChatMessage) {
			if (item.model.isOwnedBy(application.session.user)) {
				item.delete();
			}
		}
	},

	//
	// chat methods
	//

	openChat: function(chat, options) {
		if (chat) {
			this.openModel(chat);

			// add chat to sidebar, if necessary
			//
			let chats = this.getChildView('sidebar chats').collection;
			if (!chats.contains(chat)) {
				chats.add(chat);
			}
		}

		// set options
		//
		if (options && (options.message || options.items)) {
			let activeView = this.getActiveView();
			if (activeView) {
				let formView = activeView.getChildView('form');
				if (formView) {
					if (options.message) {
						formView.setValue('message', options.message);
					}
					if (options.items) {
						formView.addAttachments(options.items);
					}
				}
			}
		}
	},

	openChats: function(chats, options) {
		for (let i = 0; i < chats.length; i++) {
			this.openChat(chats[i], options);
		}
	},

	openSelectedChats: function() {
		if (this.hasSelected()) {
			this.openSelected();
		} else {
			this.showOpenChatsDialog();
		}
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

					// remove chat from list
					//
					this.getChildView('sidebar chats').collection.remove(chat);

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
		if (this.hasSelectedChat()) {
			this.endChat(this.getSelectedChats()[0]);
		}
	},

	//
	// attachment downloading methods
	//

	download: function() {
		if (this.selected && this.selected.model.download) {
			this.selected.model.download();
		}
	},

	//
	// sharing methods
	//

	shareItemsWithChat: function(directory) {
		this.getActiveView().shareItems({
			model: directory
		});
	},

	shareLocationWithChat: function() {
		this.getActiveView().shareLocation({
			name: 'My Location'
		});
	},

	//
	// searching methods
	//

	searchFor: function(search) {
		this.options.search = search;
		this.showContent();
	},

	clearSearch: function() {
		this.options.search = undefined;
		this.showContent();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// show help message
		//
		if (this.collection.isEmpty()) {
			this.showMessage("Loading chats...", {
				icon: '<i class="fa fa-spin fa-spinner"></i>',
			});
		}

		// hide footer bar
		//
		if (this.options.hidden && this.options.hidden['footer-bar']) {
			this.$el.find('.footer-bar').hide();
		}
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},
	
	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.model,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			info_kind: this.preferences.get('sidebar_info_kind'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onload: (collection) => this.onLoad(collection),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.openModel(item.model)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			message: this.options.message,
			items: this.options.items,
			search: this.options.search,
			check_in: this.options.check_in,

			// callbacks
			//
			onload: () => this.onLoad(),
			onopen: (item) => this.onOpen(item),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onchangetab: (index) => this.onChangeTab(index),
			ondropout: (items) => this.onDropOut(items),
			ondelete: (items) => this.onDelete(items),
			onclose: (index) => this.closeTab(index)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView({
			collection: this.collection
		});
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No chats.", {
			icon: '<i class="fa fa-message"></i>'
		});
	},

	//
	// dialog rendering methods
	//

	showOpenChatsDialog: function() {
		import(
			'../../../views/apps/chat-viewer/dialogs/chats/open-chats-dialog-view.js'
		).then((OpenChatsDialogView) => {

			// show open dialog
			//
			this.show(new OpenChatsDialogView.default({

				// options
				//
				title: "Open Chats",

				// callbacks
				//
				onopen: (items) => {
					this.openModels(items);
				}
			}));
		});
	},

	showInfoDialog: function() {
		if (this.selected && this.selected.model instanceof Item) {
			
			// show attachment info
			//
			this.showItemInfoDialog(this.selected.model);
		} else if (this.hasSelectedChat()) {

			// show sidebar chat info
			//
			this.showChatsInfoDialog(this.getSelectedChats());
		} else if (this.hasOpenChat()) {

			// show mainbar chat info
			//
			this.showChatInfoDialog(this.getSelectedOpenChat());
		}
	},

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

	showEditChatMessageDialog: function(message) {
		import(
			'../../../views/apps/chat-viewer/dialogs/messages/edit-chat-message-dialog-view.js'
		).then((EditChatMessageDialogView) => {

			// show edit chat message dialog
			//
			this.show(new EditChatMessageDialogView.default({
				model: message,

				// options
				//
				preferences: this.preferences,

				// callbacks
				//
				onsubmit: () => {

					// update view
					//
					this.selected.render();
				}
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/chat-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onLoad: function(collection) {

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// hide loading message
		//
		this.hideMessage();

		// open a chat
		//
		if (this.collection.isEmpty() && collection && collection.length > 0) {

			// get selected chat
			//
			if (this.options.user) {
				this.model = collection.getChatByUser(this.options.user)
			}

			// get first chat
			//
			if (!this.model) {
				this.model = collection.at(0);
			}

			// load chat
			//
			this.loadModel(this.model);
		}

		// show help message
		//
		if (this.collection.isEmpty()) {
			this.showMessage("Click to start a chat.", {
				icon: '<i class="fa fa-comments"></i>',

				// callbacks
				//
				onclick: () => this.showChatInvitationsDialog()
			});
		}

		// update views
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onChangeTab: function(index) {

		// set attributes
		//
		this.model = this.collection.at(index);

		// update sidebar info panel
		//
		this.getChildView('sidebar').setChat(this.model);

		// call superclass method
		//
		AppSplitView.prototype.onChangeTab.call(this, index);
	},
	
	//
	// file event handling methods
	//

	onOpen: function(item) {
		if (item.model instanceof Post) {
			this.openPost(item.model);
		} else if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model);
		}
	},

	onDelete: function() {
		application.play('delete');
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// call superclass method
		//
		AppSplitView.prototype.onSelect.call(this, item);
	},

	onDeselect: function(item) {
		this.selected = null;

		// call superclass method
		//
		AppSplitView.prototype.onDeselect.call(this, item);
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	//
	// static dialog rendering methods
	//

	showOpenChatsDialog: function(options) {
		application.show(new OpenChatsDialogView(options));
	}
});