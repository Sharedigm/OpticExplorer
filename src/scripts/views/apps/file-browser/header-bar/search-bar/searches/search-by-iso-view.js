/******************************************************************************\
|                                                                              |
|                            search-by-iso-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by iso.                  |
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

	icon: 'fa fa-film',
	placeholder: "Search by ISO",

	values: [
		25,
		50,
		64,
		100,
		200,
		400,
		800,
		1000,
		1600,
		3200
	],

	//
	// search attributes
	//

	key: 'iso'
});