/******************************************************************************\
|                                                                              |
|                              user-tiles-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of user tiles.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TilesView from '../../../../../../views/items/tiles/tiles-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import UserTileView from '../../../../../../views/apps/profile-browser/mainbar/users/tiles/user-tile-view.js';

export default TilesView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: UserTileView,
	editable: false,

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TilesView.prototype.onRender.call(this);

		// set tile size
		//
		this.setTileSize(this.options.tile_size || 'medium');
	},
}));