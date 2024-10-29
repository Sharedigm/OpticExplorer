/******************************************************************************\
|                                                                              |
|                        file-associations-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of a list of file associations.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../views/collections/tables/sortable-table-list-view.js';
import FileAssociationsListItemView from '../../../../../views/apps/file-browser/lists/file-associations-list/file-associations-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="file-extension" style="width:150px">
					<i class="fa fa-file"></i>
					<label>Extension</label>
				</th>
		
				<th class="application">
					<i class="fa fa-rocket"></i>
					<label>Application</label>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),
	childView: FileAssociationsListItemView,

	sorting: {
		
		// disable sorting on message and password fields
		//
		headers: {
			'.application': {
				sorter: false 
			}
		},

		// sort on first column in descending order 
		//
		sortList: [[0, 0]]
	},
	
	//
	// getting methods
	//

	getValues: function() {
		let rows = this.$el.find('tr');
		let values = {};
		for (let i = 0; i < rows.length; i++) {
			let row = $(rows[i]);
			let key = row.find('.extension').html();
			let value = row.find('select').val();
			values[key] = value;
		}
		return values;
	},

	//
	// rendering methods
	//

	childViewOptions: function() {
		return {
			settings: this.model
		}; 
	}
});