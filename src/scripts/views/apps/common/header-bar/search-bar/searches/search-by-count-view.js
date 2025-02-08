/******************************************************************************\
|                                                                              |
|                           search-by-count-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by number.                     |
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
	// search attributes
	//

	key: 'count',

	//
	// getting methods
	//

	getKey: function() {
		let key = _.result(this, 'key');

		switch (this.getOperator()) {
			case 'greater_than':
				return 'min_' + key;
			case 'less_than':
				return 'max_' + key;
			default:
				return 'num_' + key;
		}
	}
});