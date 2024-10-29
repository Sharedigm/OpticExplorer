/******************************************************************************\
|                                                                              |
|                              groups-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of groups.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../views/items/lists/list-view.js';
import GroupsListItemView from '../../../../views/users/groups/lists/groups-list-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	childView: GroupsListItemView
});