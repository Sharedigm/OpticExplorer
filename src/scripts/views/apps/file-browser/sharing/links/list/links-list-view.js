/******************************************************************************\
|                                                                              |
|                               links-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of shareable links.                     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import LinksListItemView from '../../../../../../views/apps/file-browser/sharing/links/list/links-list-item-view.js';

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

				<th class="editable">
					<i class="fa fa-pencil"></i>
					<label>Editable</label>
				</th>

				<th class="message">
					<i class="fa fa-quote-left"></i>
					<label>Message</label>
				</th>
				
				<th class="hits">
					<i class="fa fa-mouse-pointer"></i>
					<label>Hits</label>
				</th>
		
				<th class="limit hidden-xs">
					<i class="fa fa-step-forward"></i>
					<label>Limit</label>
				</th>
		
				<th class="expiration hidden-xs">
					<i class="fa fa-calendar-alt"></i>
					<label>Exp</label>
				</th>
		
				<th class="protection">
					<i class="fa fa-lock"></i>
				</th>
		
				<% if (editable) { %>
				<th class="delete">
					<i class="fa fa-info-circle"></i>
				</th>
				<% } %>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	sorting: {

		// disable sorting on message and password fields
		//
		headers: {
			'.message': {
				sorter: false 
			},

			'.protection': {
				sorter: false 
			}
		},
		
		// sort on date column in descending order 
		//
		sortList: [[0, 1]]
	},

	empty: "No links.",

	//
	// views
	//

	childView: LinksListItemView,
	
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
