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
			<a class="new-topic"><i class="fa fa-plus"></i>New Topic<span class="shift command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-topics"><i class="fa fa-folder"></i>Open Topics<span class=" command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="add-topics"><i class="fa fa-plus"></i>Add Topics<span class="command shortcut">D</span></a>
		</li>
		
		<li role="presentation">
			<a class="remove-topics"><i class="fa fa-minus"></i>Remove Topics<span class="shortcut">delete</span></a>
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
			<a class="close-topic"><i class="fa fa-xmark"></i>Close Topic<span class=" command shortcut">L</span></a>
		</li>
		
		<li role="presentation" class="hidden">
			<a class="close-post"><i class="fa fa-xmark"></i>Close Post<span class=" command shortcut">L</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-topic': 'onClickNewTopic',
		'click .open-topics': 'onClickOpenTopics',
		'click .add-topics': 'onClickAddTopics',
		'click .remove-topics': 'onClickRemoveTopics',
		'click .show-info': 'onClickShowInfo',
		'click .download-item': 'onClickDownloadItem',
		'click .close-topic': 'onClickCloseTopic',
		'click .close-post': 'onClickClosePost',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();
		let hasSelectedOpenTopic = this.parent.app.hasSelectedOpenTopic();
		let hasSelectedOpenPost = this.parent.app.hasSelectedOpenPost();

		return {
			'new-window': true,
			'new-topic': isSignedIn,
			'open-topic': isSignedIn,
			'add-topics': isSignedIn,
			'remove-topics': isSignedIn,
			'show-info': isSignedIn,
			'download-item': isSignedIn,
			'close-topic': isSignedIn && hasSelectedOpenTopic,
			'close-post': isSignedIn && hasSelectedOpenPost,
			'close-window': isSignedIn
		};
	},

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let hasOpenItem = this.parent.app.hasOpenItem();
		let hasSelectedTopic = this.parent.app.hasSelectedTopic();
		let hasSelectedPost = this.parent.app.hasSelectedPost();
		let selectedTopic = hasSelectedTopic? this.parent.app.getSelectedTopics()[0] : undefined;
		let isTopicRequired = hasSelectedTopic && selectedTopic.isRequired();
		let isTopicOwned = hasSelectedTopic && selectedTopic.isOwnedBy(application.session.user);
		let hasSelectedItem = this.parent.app.selected && this.parent.app.selected.model instanceof Item;

		return {
			'new-window': true,
			'new-topic': isSignedIn,
			'open-topic': isSignedIn,
			'add-topics': isSignedIn && !hasSelectedTopic,
			'remove-topic': isSignedIn && hasSelectedTopic && !hasSelectedItem && !hasSelectedPost && !isTopicOwned && !isTopicRequired,
			'show-info': hasOpenItem || hasSelectedTopic,
			'download-item': hasSelectedItem,
			'close-topic': hasTabs,
			'close-post': hasTabs,
			'close-window': true
		};
	},

	//
	// setting methods
	//

	setTopic: function(topic) {
		this.setItemDisabled('remove-topic', topic.isRequired() || 
			topic.isOwnedBy(application.session.user));
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

	onClickNewTopic: function() {
		this.parent.app.showNewTopicDialog();
	},

	onClickOpenTopics: function() {
		this.parent.app.openSelectedTopics();
	},

	onClickAddTopics: function() {
		this.parent.app.showAddTopicsDialog();
	},

	onClickRemoveTopics: function() {
		this.parent.app.removeSelectedTopics();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDownloadItem: function() {
		this.parent.app.download();
	},

	onClickCloseTopic: function() {
		this.parent.app.closeActiveTab();
	},

	onClickClosePost: function() {
		this.parent.app.closeActiveTab();
	}
});