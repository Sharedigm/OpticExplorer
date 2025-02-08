/******************************************************************************\
|                                                                              |
|                               file-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Item from '../../../../../../models/storage/item.js';
import FileMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/file-menu-view.js';

export default FileMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-chat': 'onClickNewChat',
		'click .open-chats': 'onClickOpenChats',
		'click .show-info': 'onClickShowInfo',
		'click .download-item': 'onClickDownloadItem',
		'click .end-chat': 'onClickEndChat',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let hasOpenChat = this.parent.app.hasOpenChat();
		let hasSelected = this.parent.app.selected != undefined;
		let hasSelectedChat = this.parent.app.hasSelectedChat();
		let hasSelectedMessage = this.parent.app.hasSelectedMessage();
		let hasSelectedItem = hasSelected && this.parent.app.selected.model instanceof Item;

		return {
			'new-window': true,
			'new-chat': isSignedIn,
			'open-chats': isSignedIn,
			'show-info': hasOpenChat || hasSelectedChat,
			'download-item': hasSelectedItem,
			'end-chat': isSignedIn && hasSelectedChat && !hasSelectedMessage,
			'close-tab': hasTabs,
			'close-window': true
		};
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.onChange();
	},

	onDeselect: function() {
		this.onChange();
	},

	//
	// mouse event handling methods
	//

	onClickNewChat: function() {
		this.parent.app.showChatInvitationsDialog();
	},

	onClickOpenChats: function() {
		this.parent.app.openSelectedChats();
	},

	onClickEndChat: function() {
		this.parent.app.endSelectedChat();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDownloadItem: function() {
		this.parent.app.download();
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	}
});