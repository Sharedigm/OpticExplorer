/******************************************************************************\
|                                                                              |
|                           user-events-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of user (calendar) events.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../views/items/lists/list-view.js';
import UserEventsListItemView from '../../../../../views/apps/calendar/sidebar/lists/user-events-list-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	empty: "No events.",

	//
	// views
	//

	childView: UserEventsListItemView
});