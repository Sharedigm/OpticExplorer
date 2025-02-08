/******************************************************************************\
|                                                                              |
|                         search-shared-by-me-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by sharing.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByCountView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-count-view.js';

export default SearchByCountView.extend({

	//
	// attributes
	//

	icon: 'fa fa-mail-reply',
	placeholder: "Search by Shares",

	//
	// search attributes
	//

	key: 'shares'
});