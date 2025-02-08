/******************************************************************************\
|                                                                              |
|                         mappable-user-icons-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of mappable user icons.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserIconsView from '../../../../../../views/apps/profile-browser/mainbar/users/icons/user-icons-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import MappableUserIconView from '../../../../../../views/apps/map-viewer/mainbar/users/icons/mappable-user-icon-view.js';

export default UserIconsView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: MappableUserIconView
}));