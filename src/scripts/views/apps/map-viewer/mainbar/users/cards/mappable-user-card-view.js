/******************************************************************************\
|                                                                              |
|                         mappable-user-card-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a mappable user card.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserCardView from '../../../../../../views/apps/profile-browser/mainbar/users/cards/user-card-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default UserCardView.extend(_.extend({}, Mappable));