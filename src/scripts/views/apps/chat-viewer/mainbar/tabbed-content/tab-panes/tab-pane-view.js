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

import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import ContainableSelectable from '../../../../../../views/behaviors/containers/containable-selectable.js';
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
		return new ChatView(this.options);
	}
}));