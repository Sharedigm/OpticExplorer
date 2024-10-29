/******************************************************************************\
|                                                                              |
|                              group-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a list view of a collection of connection groups.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../../views/items/lists/list-view.js';
import GroupListItemView from '../../../../../../views/apps/connection-manager/sidebar/groups/lists/group-list-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	editable: false,

	// views
	//
	childView: GroupListItemView
});