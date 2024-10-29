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

import ImageFile from '../../../../../../models/storage/media/image-file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import EditableTabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/editable-tab-view.js';

export default EditableTabView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		if (this.model instanceof ImageFile) {
			return '<i class="fa fa-image"></i>';
		} else if (this.model instanceof Directory) {
			return '<i class="fa fa-folder"></i>';
		} else {
			return '<i class="fa fa-file"></i>';
		}
	}
});