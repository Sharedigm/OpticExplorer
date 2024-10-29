/******************************************************************************\
|                                                                              |
|                         sortable-table-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a sortable list.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListView from '../../../views/collections/tables/table-list-view.js';
import TableSortable from '../../../views/collections/tables/behaviors/table-sortable.js';

export default TableListView.extend(_.extend({}, TableSortable, {

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TableListView.prototype.onRender.call(this);
	}
}));