/******************************************************************************\
|                                                                              |
|                          editable-tab-pane-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying editable tab panes.           |
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

export default TabPaneView.extend({

	//
	// querying methods
	//

	isDirty: function() {
		return this.dirty;
	},

	//
	// setting methods
	//

	setDirty: function(dirty) {

		// set tab state
		//
		if (this.hasTab()) {
			this.getTab().setDirty(dirty);
		}
	}
});