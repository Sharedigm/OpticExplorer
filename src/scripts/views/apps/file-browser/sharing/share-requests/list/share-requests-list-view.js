/******************************************************************************\
|                                                                              |
|                          share-requests-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of shareable links.                     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import ShareRequestsListItemView from '../../../../../../views/apps/file-browser/sharing/share-requests/list/share-requests-list-item-view.js';

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
		
				<th class="message">
					<i class="fa fa-quote-left"></i>
					<label>Message</label>
				</th>
		
				<th class="share-as">
					<i class="fa fa-copy"></i>
					<label>Share</label>
				</th>
		
				<th class="status">
					<i class="fa fa-info-circle"></i>
					<label>Status</label>
				</th>
		
				<% if (editable) { %>
				<th class="delete">
					<i class="fa fa-trash-alt"></i>
				</th>
				<% } %>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	sorting: {

		// disable sorting on message field
		//
		headers: {
			2: {
				sorter: false 
			}
		},
		
		// sort on date column in descending order 
		//
		sortList: [[0, 0]]
	},

	empty: "No share requests.",

	//
	// views
	//

	childView: ShareRequestsListItemView,
	
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
