/******************************************************************************\
|                                                                              |
|                           search-by-gender-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by gender.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByValueView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-value-view.js';

export default SearchByValueView.extend({

	//
	// attributes
	//

	className: 'search by-gender form-inline',
	icon: 'fa fa-transgender',

	values: {
		male: {
			icon: 'fa fa-male',
			text: "Male"
		},
		female: {
			icon: 'fa fa-female',
			text: "Female"
		},
		other: {
			icon: 'fa fa-transgender',
			text: "Other"
		}
	},

	//
	// search attributes
	//

	key: 'gender'
});