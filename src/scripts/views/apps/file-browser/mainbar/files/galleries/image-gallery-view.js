/******************************************************************************\
|                                                                              |
|                             image-gallery-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a gallery of image files.                      |
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
import ItemsGalleryView from '../../../../../../views/items/galleries/items-gallery-view.js';
import ImageGalleryItemView from '../../../../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-item-view.js';

export default ItemsGalleryView.extend({

	//
	// attributes
	//

	childView: ImageGalleryItemView,

	//
	// filtering methods
	//

	modelFilter: function (model) {
		return model instanceof ImageFile;
	}
});