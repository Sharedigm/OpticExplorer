/******************************************************************************\
|                                                                              |
|                             search-by-age-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching connections.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByNumberView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-number-view.js';

export default SearchByNumberView.extend({

	//
	// attributes
	//

	className: 'search by-age form-inline',
	icon: 'fa fa-hourglass-half',
	placeholder: "Search by Age",

	//
	// search attributes
	//

	key: 'age'
});