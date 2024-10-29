/******************************************************************************\
|                                                                              |
|                             group-member-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of group member (a user within a group).          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserListItemView from '../../../../../../views/apps/profile-browser/mainbar/users/lists/user-list-item-view.js';
import TreeViewable from '../../../../../../views/items/trees/tree-viewable.js';

export default UserListItemView.extend(_.extend({}, TreeViewable, {

	//
	// querying methods
	//

	hasTop: function() {
		return this.parent.parent != null;
	},

	//
	// getting methods
	//

	getTop: function() {
		return this.parent.parent;
	}
}));