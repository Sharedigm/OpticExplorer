/******************************************************************************\
|                                                                              |
|                        search-by-focal-length-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by focal length.         |
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

	icon: 'fa fa-arrows-alt-h',
	placeholder: "Search by Focal Length",

	values: {
		"10": "10mm",
		"12": "12mm",
		"18": "18mm",
		"24": "24mm",
		"35": "35mm",
		"50": "50mm",
		"60": "60mm",
		"70": "70mm",
		"85": "85mm",
		"90": "90mm",
		"105": "105mm",
		"150": "150mm",
		"200": "200mm",
		"300": "300mm",
		"400": "400mm",
		"500": "500mm"
	},

	//
	// search attributes
	//

	key: 'focal_length'
});