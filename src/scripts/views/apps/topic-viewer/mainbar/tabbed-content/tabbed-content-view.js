/******************************************************************************\
|                                                                              |
|                             tabbed-content-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for editing code files.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedContentView from '../../../../../views/apps/common/mainbar/tabbed-content/tabbed-content-view.js';
import TabsView from '../../../../../views/apps/topic-viewer/mainbar/tabbed-content/tabs/tabs-view.js';
import TabPanesView from '../../../../../views/apps/topic-viewer/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

export default TabbedContentView.extend({

	//
	// attributes
	//

	tabsView: TabsView,
	tabPanesView: TabPanesView,

	//
	// setting methods
	//

	setOption: function(key, value) {

		// apply to children
		//
		for (let i = 0; i < this.getChildView('panes').children.length; i++) {
			this.getChildView('panes').getChildViewAt(i).setOption(key, value);
		}
	}
});