/******************************************************************************\
|                                                                              |
|                      user-identities-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a user identities list item.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../views/collections/tables/table-list-item-view.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<td class="provider">
			<%= title %>
		</td>
		
		<% if (show_description) { %>
		<td class="description">
			<%= description %>
		</td>
		<% } %>
		
		<% if (show_external_id) { %>
		<td class="external-id">
			<%= user_external_id %>
		</td>
		<% } %>
		
		<td class="date">
			<%= created_at.format('mediumDate') %>
		</td>
		
		<% if (admin && show_status) { %>
			<td class="status">
				<select class="status">
					<option value="1" <%= enabled_flag == 1 ? 'selected="selected"' : ''%>>Enabled</option>
					<option value="0" <%= enabled_flag == 1 ? '': 'selected="selected"' %>>Disabled</option>
				</select>
			</td>
		<% } %>
		
		<% if (show_delete) { %>
		<td class="delete">
			<button type="button" class="btn btn-sm">
				<i class="fa fa-xmark"></i>
			</button>
		</td>
		<% } %>
	`),

	events: {
		'change select.status': 'onChangeStatus',
		'click .delete button': 'onClickDelete',
	},

	//
	// deleting methods
	//

	deleteProvider: function(provider, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Delete Provider",
				message: "Are you sure you wish to delete " + this.model.get('title') + " as a sign in provider?",

				// callbacks
				//
				accept: () => {
					this.deleteProvider(provider, {
						confirm: false
					});
				}
			});
		} else {

			// delete provider
			//
			provider.destroy({

				// callbacks
				//
				success: () => {

					// perform callback
					//
					if (this.options.ondelete) {
						this.options.ondelete(this);
					}
				},

				error: () => {

					// show error message
					//
					application.error({
						message: "Could not remove this identity."
					});
				}
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return { 
			admin: application.session.user.get('admin_flag'),
			show_description: this.options.show_description,
			show_external_id: this.options.show_external_id,
			show_status: this.options.show_status,
			show_delete: this.options.show_delete
		};
	},

	//
	// mouse event handling methods
	//

	onClickDelete: function() {
		this.deleteProvider(this.model);
	},

	onChangeStatus: function(event) {
		this.model.setEnabled(event.target.value, {

			// callbacks
			//
			success: () => {

				// show success notify view
				//
				application.notify({
					icon: '<i class="fa fa-user"></i>',
					title: 'Status Updated',
					message: "User identity status updated."
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: "Could not update this identity's status."
				});
			}
		});
	}
});
