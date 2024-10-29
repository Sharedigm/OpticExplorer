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

import File from '../../../../../../models/storage/files/file.js';
import ImageFile from '../../../../../../models/storage/media/image-file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';

export default TabView.extend({

	//
	// constructor
	//

	initialize: function() {
		this.attributes.index = this.options.index;
	},

	//
	// getting methods
	//

	getIcon: function() {
		if (this.model instanceof ImageFile) {
			return '<i class="fa fa-image"></i>';
		} else if (this.model instanceof Directory) {
			return '<i class="fa fa-folder"></i>';
		} else if (this.model instanceof File) {
			return '<i class="fa fa-file"></i>';
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.options.index == 0) {
			this.$el.addClass('active');
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function() {

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(this.options.index);
		}
	}
});