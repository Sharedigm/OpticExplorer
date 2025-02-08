/******************************************************************************\
|                                                                              |
|                         mappable-user-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of mappable user items.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserListView from '../../../../../../views/apps/profile-browser/mainbar/users/lists/user-list-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import MappableUserListItemView from '../../../../../../views/apps/map-viewer/mainbar/users/lists/mappable-user-list-item-view.js';

export default UserListView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: MappableUserListItemView
}));