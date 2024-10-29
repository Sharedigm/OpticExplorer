/******************************************************************************\
|                                                                              |
|                                 tabs-view.js                                 |
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

import EditableTabsView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/editable-tabs-view.js';
import TabView from '../../../../../../views/apps/code-editor/mainbar/tabbed-content/tabs/tab-view.js';

export default EditableTabsView.extend({

	//
	// attributes
	//

	childView: TabView
});