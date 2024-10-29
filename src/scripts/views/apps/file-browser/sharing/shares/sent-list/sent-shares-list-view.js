/******************************************************************************\
|                                                                              |
|                           sent-shares-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of sent shares.                         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import SentSharesListItemView from '../../../../../../views/apps/file-browser/sharing/shares/sent-list/sent-shares-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="date">
					<i class="fa fa-calendar-alt"></i>
					<label>Date</label>
				</th>
		
				<% if (show_path) { %>
				<th class="path">
					<i class="fa fa-sitemap"></i>
					<label>Path</label>
				</th>
				<% } %>
		
				<th class="recipient">
					<i class="fa fa-user"></i>
					<label>Recipient</label>
				</th>
		
				<% if (editable) { %>
				<th class="delete"></th>
					<i class="fa fa-trash-alt"></i>
				<% } %>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	sorting: {
		
		// sort on date column in descending order 
		//
		sortList: [[0, 1]]
	},

	empty: "No shared items sent.",

	//
	// views
	//

	childView: SentSharesListItemView,
	
	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.selectable == undefined) {
			this.options.selectable = true;
		}
		if (this.options.multipleSelectable == undefined) {
			this.options.multipleSelectable = true;
		}

		// call superclass constructor
		//
		SortableTableListView.prototype.initialize.call(this);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,

			// options
			//
			numbered: this.options.numbered,
			show_path: this.options.showPath,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			numbered: this.options.numbered,
			showPath: this.options.showPath,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});
