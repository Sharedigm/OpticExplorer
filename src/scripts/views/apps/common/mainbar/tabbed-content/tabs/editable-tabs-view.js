/******************************************************************************\
|                                                                              |
|                             editable-tabs-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a collection of tabs.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/editable-tab-view.js';
import TabsView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tabs-view.js';

export default TabsView.extend({

	//
	// attributes
	//

	childView: EditableTabView,

	//
	// event handling methods
	//

	setDirty: function(dirty) {

		// update active tab
		//
		if (this.hasActiveView()) {
			this.getActiveTabView().setDirty(dirty);
		}
	}
});