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

import EditableTabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/editable-tab-view.js';

export default EditableTabView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		return '<i class="fa fa-music"></i>';
	}
});