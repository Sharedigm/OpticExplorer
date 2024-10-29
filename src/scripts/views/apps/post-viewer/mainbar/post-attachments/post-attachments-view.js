/******************************************************************************\
|                                                                              |
|                           post-attachments-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying a collection of post.         |
|        attachments.   This can be used for a post gallery view.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../../views/items/items-view.js';
import PostAttachmentTilesView from '../../../../../views/apps/post-viewer/mainbar/post-attachments/tiles/post-attachment-tiles-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showTiles: function() {

		// show chat tiles
		//
		this.showChildView('items', new PostAttachmentTilesView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			tile_size: 'extra_large'
		})));
	}
});