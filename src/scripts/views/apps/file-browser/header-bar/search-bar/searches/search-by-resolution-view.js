/******************************************************************************\
|                                                                              |
|                         search-by-resolution-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by resolution.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByNumbersView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-numbers-view.js';

export default SearchByNumbersView.extend({

	//
	// attributes
	//

	icon: 'fa fa-arrows-alt',

	kinds: {
		resolution: {
			icon: 'fa fa-arrows',
			label: 'r',
			placeholder: 'Search by Resolution'
		},

		width: {
			icon: 'fa fa-arrows-h',
			label: 'w',
			placeholder: 'Search by Width'
		},

		height: {
			icon: 'fa fa-arrows-v',
			label: 'h',
			placeholder: 'Search by Height'
		}
	}
});