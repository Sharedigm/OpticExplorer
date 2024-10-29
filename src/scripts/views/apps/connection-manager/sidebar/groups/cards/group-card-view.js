/******************************************************************************\
|                                                                              |
|                              group-card-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item card view of a connections group.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import ItemDroppable from '../../../../../../views/behaviors/drag-and-drop/item-droppable.js';

export default CardView.extend(_.extend({}, ItemDroppable, {

	//
	// attributes
	//

	events: _.extend({}, CardView.prototype.events, ItemDroppable.events),
	
	//
	// getting methods
	//

	getName: function(kind) {
		return this.model.getName(kind);
	},

	getThumbnailUrl: function() {
		return this.model.getThumbnailUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
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