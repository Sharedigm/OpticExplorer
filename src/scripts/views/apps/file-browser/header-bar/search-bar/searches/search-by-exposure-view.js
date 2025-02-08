/******************************************************************************\
|                                                                              |
|                          search-by-exposure-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by exposure.             |
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

	icon: 'fa fa-clock',
	placeholder: "Search by Exposure",

	values: [
		'8',
		'4',
		'2',
		'1',
		'1/2',
		'1/4',
		'1/8',
		'1/15',
		'1/30',
		'1/60',
		'1/125',
		'1/250',
		'1/500',
		'1/1000',
		'1/2000',
		'1/4000'
	],

	//
	// search attributes
	//

	key: 'exposure'
});