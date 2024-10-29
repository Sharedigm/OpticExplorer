/******************************************************************************\
|                                                                              |
|                              group-tiles-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a tile grid view of connection groups.                   |
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
import GroupTileView from '../../../../../../views/apps/connection-manager/sidebar/groups/tiles/group-tile-view.js';

export default TilesView.extend({

	//
	// attributes
	//

	childView: GroupTileView,
	editable: false
});