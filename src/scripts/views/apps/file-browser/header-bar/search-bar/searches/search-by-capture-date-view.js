/******************************************************************************\
|                                                                              |
|                        search-by-capture-date-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by capture date.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByDateView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-date-view.js';

export default SearchByDateView.extend({

	//
	// attributes
	//

	icon: 'fa fa-calendar-alt',
	placeholder: "Search by Capture Date",

	//
	// seearch attributes
	//

	key: 'capture_date'
});