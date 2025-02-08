/******************************************************************************\
|                                                                              |
|                         mappable-user-tiles-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of mappable user tiles.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserTilesView from '../../../../../../views/apps/profile-browser/mainbar/users/tiles/user-tiles-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import MappableUserTileView from '../../../../../../views/apps/map-viewer/mainbar/users/tiles/mappable-user-tile-view.js';

export default UserTilesView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: MappableUserTileView
}));