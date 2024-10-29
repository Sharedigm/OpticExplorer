/******************************************************************************\
|                                                                              |
|                                 tab-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a single tab.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../../../../models/topics/topic.js';
import Post from '../../../../../../models/topics/post.js';
import Chat from '../../../../../../models/chats/chat.js';
import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';

export default TabView.extend({

	//
	// getting methods
	//

	getTopicIcon: function() {
		let icon = this.model.getIcon({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
		if (icon) {
			return icon;
		} else {
			return '<i class="fa fa-hashtag"></i>';
		}
	},

	getPostIcon: function() {
		return '<i class="fa fa-newspaper"></i>';
	},

	getChatIcon: function() {
		let icon = this.model.getIcon({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
		if (icon) {
			return icon;
		} else {
			return '<i class="fa fa-comments"></i>';
		}
	},

	getIcon: function() {
		if (this.model instanceof Topic) {
			return this.getTopicIcon();
		} else if (this.model instanceof Post) {
			return this.getPostIcon();
		} else if (this.model instanceof Chat) {
			return this.getChatIcon();
		}
	}
});