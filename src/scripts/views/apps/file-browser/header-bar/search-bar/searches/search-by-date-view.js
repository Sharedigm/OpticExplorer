/******************************************************************************\
|                                                                              |
|                            search-by-date-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by date.                 |
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

	icons: {
		create_date: 'fa fa-magic',
		modify_date: 'fa fa-edit',
		access_date: 'fa fa-eye'
	},

	//
	// getting methods
	//

	getKey: function() {
		let relation = this.getRelation();

		switch (this.options.kind) {
			case 'create_date':
				return 'created_' + relation;
			case 'update_date':
				return 'updated_' + relation;
			case 'access_date':
				return 'accessed_' + relation;
		}
	}
});