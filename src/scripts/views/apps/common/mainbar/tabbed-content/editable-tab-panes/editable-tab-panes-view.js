/******************************************************************************\
|                                                                              |
|                          editable-tab-panes-view.js                          |
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

import EditableTabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-pane-view.js';
import TabPanesView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

export default TabPanesView.extend({

	//
	// attributes
	//

	childView: EditableTabPaneView
});