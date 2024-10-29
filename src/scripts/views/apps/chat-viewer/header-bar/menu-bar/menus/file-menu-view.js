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

	template: template(`
		<li role="presentation">
			<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="command shortcut">enter</span></a>
		</li>

		<li role="presentation">
			<a class="new-chat"><i class="fa fa-plus"></i>New Chat<span class="shift command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-chats"><i class="fa fa-folder"></i>Open Chats<span class=" command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="download-item"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="end-chat"><i class="fa fa-minus"></i>End Chat<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-tab"><i class="fa fa-xmark"></i>Close Tab<span class=" command shortcut">L</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

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
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-window': true,
			'new-chat': isSignedIn,
			'open-chats': isSignedIn,
			'show-info': hasOpenChat || hasSelectedChat,
			'download-item': hasSelectedItem,
			'end-chat': isSignedIn && hasSelectedChat && !hasSelectedMessage,
			'close-tab': hasTabs,
			'close-window': !isDesktop
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			is_desktop: this.parent.app.isDesktop()
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