/******************************************************************************\
|                                                                              |
|                           image-gallery-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an image file gallery item.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import GalleryItemView from '../../../../../../views/items/galleries/gallery-item-view.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default GalleryItemView.extend({

	//
	// attributes
	//

	defaultResolution: [512, 512],

	//
	// getting methods
	//

	getUrl: function() {
		return this.model.getUrl({
			max_size: 512
		});
	},

	getResolution: function() {
		return this.model.get('resolution') || this.defaultResolution;
	},

	getName: function() {
		return FileUtils.getItemName(this.model.get('path'));
	},

	//
	// opening methods
	//

	open: function() {

		// perform callback or open
		//
		if (this.options.onopen) {
			this.options.onopen(this);
		} else {
			this.openImage();	
		}
	}
});