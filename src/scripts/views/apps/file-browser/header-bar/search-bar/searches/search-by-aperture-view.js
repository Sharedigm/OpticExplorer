/******************************************************************************\
|                                                                              |
|                          search-by-aperture-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by aperture.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByOrderableView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-orderable-view.js';

export default SearchByOrderableView.extend({

	//
	// attributes
	//

	icon: 'fa fa-dot-circle',
	placeholder: "Search by Aperture",

	values: [
		'F1',
		'F1.2',
		'F1.4',
		'F2',
		'F2.8',
		'F4',
		'F5.6',
		'F8',
		'F11',
		'F16',
		'F22',
		'F32'
	],

	//
	// search attributes
	//

	key: 'aperture'
});