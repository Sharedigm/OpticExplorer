/******************************************************************************\
|                                                                              |
|                             place-tiles-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of map place tiles.                     |
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
import PlaceTileView from '../../../../../../views/apps/map-viewer/mainbar/places/tiles/place-tile-view.js';

export default TilesView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: PlaceTileView,
	editable: false
}));