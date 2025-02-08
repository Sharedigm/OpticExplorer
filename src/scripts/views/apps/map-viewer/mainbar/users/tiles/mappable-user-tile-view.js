/******************************************************************************\
|                                                                              |
|                         mappable-user-tile-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a mappable user tile.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserTileView from '../../../../../../views/apps/profile-browser/mainbar/users/tiles/user-tile-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default UserTileView.extend(_.extend({}, Mappable));