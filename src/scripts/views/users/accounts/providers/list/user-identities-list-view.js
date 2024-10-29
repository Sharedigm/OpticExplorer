/******************************************************************************\
|                                                                              |
|                         user-identities-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a list view for showing user identities.                 |
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
import UserIdentitiesListItemView from '../../../../../views/users/accounts/providers/list/user-identities-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="provider">
					<i class="fa fa-cloud"></i>
					<label>Provider</label>
				</th>
		
				<% if (show_description) { %>
				<th class="description">
					<i class="fa fa-quote-left"></i>
					<label>Description</label>
				</th>
				<% } %>
		
				<% if (show_external_id) { %>
				<th class="external-id">
					<i class="fa fa-list"></i>
					<label>External ID</label>
				</th>
				<% } %>
		
				<% if (admin && show_status) { %>
					<th class="date">
						<i class="fa fa-calendar-alt"></i>
						<label>Create Date</label>
					</th>
					<th class="status">
						<i class="fa fa-check"></i>
						<label>Status</label>
					</th>
				<% } else { %>
					<th class="date">
						<i class="fa fa-calendar-alt"></i>
						<label>Create Date</label>
					</th>
				<% } %>
		
				<% if (show_delete) { %>
				<th class="delete">
					<i class="fa fa-trash-alt"></i>
				</th>
				<% } %>
			</tr>
		</thead>
		
		<tbody>
		</tbody>
	`),

	// sort by provider column in descending order 
	//
	sortBy: ['provider', 'ascending'],

	empty: "No identities.",

	//
	// views
	//

	childView: UserIdentitiesListItemView,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,

			// options
			//
			admin: application.session.user.get('admin_flag'),
			show_description: this.options.show_description,
			show_external_id: this.options.show_external_id,
			show_status: this.options.show_status,
			show_delete: this.options.show_delete,

			// callbacks
			//
			ondelete: this.options.ondelete
		};
	},

	childViewOptions: function() {
		return {
			show_description: this.options.show_description,
			show_external_id: this.options.show_external_id,
			show_status: this.options.show_status,
			show_delete: this.options.show_delete,

			// callbacks
			//
			ondelete: this.options.ondelete
		};
	}
});
