/******************************************************************************\
|                                                                              |
|                              group-tile-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an tile grid item view of a connection group.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TileView from '../../../../../../views/items/tiles/tile-view.js';
import ItemDroppable from '../../../../../../views/behaviors/drag-and-drop/item-droppable.js';

export default TileView.extend(_.extend({}, ItemDroppable, {

	//
	// attributes
	//

	events: _.extend({}, TileView.prototype.events, ItemDroppable.events),
	
	//
	// getting methods
	//

	getName: function(kind) {
		return this.model.getName(kind);
	},

	getThumbnailUrl: function() {
		return this.model.getThumbnailUrl({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getIcon: function() {
		if (this.model.hasThumbnail()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl() + ')"></div>';
		} else {
			return '<i class="fa fa-users"></i>';
		}
	}
}));