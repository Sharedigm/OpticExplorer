/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code tabs.                    |
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
import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import ContainableSelectable from '../../../../../../views/behaviors/containers/containable-selectable.js';
import TopicView from '../../../../../../views/apps/topic-viewer/mainbar/topics/topic-view.js';
import PostView from '../../../../../../views/apps/post-viewer/mainbar/posts/post-view.js';
import ChatView from '../../../../../../views/apps/chat-viewer/mainbar/chats/chat-view.js';

export default TabPaneView.extend(_.extend({}, ContainableSelectable, {

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// rendering methods
	//

	getContentView: function() {

		// show topic
		//
		if (this.model instanceof Topic) {
			return new TopicView(this.options);

		// show post
		//
		} else if (this.model instanceof Post) {
			return new PostView(this.options);

		// show chat
		//
		} else if (this.model instanceof Chat) {
			return new ChatView(this.options);
		}
	}
}));