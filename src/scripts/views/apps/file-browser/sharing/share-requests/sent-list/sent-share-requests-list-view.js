/******************************************************************************\
|                                                                              |
|                       sent-share-requests-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of sent share requests.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import SentShareRequestsListItemView from '../../../../../../views/apps/file-browser/sharing/share-requests/sent-list/sent-share-requests-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<% if (!hidden['date']) { %>
				<th class="date">
					<i class="fa fa-calendar-alt"></i>
					<label>Date</label>
				</th>
				<% } %>
		
				<% if (!hidden['path']) { %>
				<th class="path">
					<i class="fa fa-sitemap"></i>
					<label>Path</label>
				</th>
				<% } %>
		
				<% if (!hidden['recipient']) { %>
				<th class="recipient">
					<i class="fa fa-user"></i>
					<label>Recipient</label>
				</th>
				<% } %>
		
				<% if (!hidden['message']) { %>
				<th class="message">
					<i class="fa fa-quote-left"></i>
					<label>Message</label>
				</th>
				<% } %>
		
				<% if (!hidden['share_as']) { %>
				<th class="share-as hidden-xs">
					<i class="fa fa-copy"></i>
					<label>Share</label>
				</th>
				<% } %>
		
				<% if (!hidden['status']) { %>
				<th class="status">
					<i class="fa fa-info-circle"></i>
					<label>Status</label>
				</th>
				<% } %>
		
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
			'.message': {
				sorter: false 
			}
		},
		
		// sort on date column in descending order 
		//
		sortList: [[0, 1]]
	},

	// views
	//
	childView: SentShareRequestsListItemView,
	
	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.hidden == undefined) {
			this.options.hidden = [];
		}
		if (this.options.selectable == undefined) {
			this.options.selectable = true;
		}
		if (this.options.multipleSelectable == undefined) {
			this.options.multipleSelectable = true;
		}

		// customize empty view
		//
		this.emptyView = BaseView.extend({
			className: 'empty',
			template: template("No share requests sent from " + this.model.getName() + ".")
		});

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
			hidden: this.options.hidden,

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
			hidden: this.options.hidden,

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
