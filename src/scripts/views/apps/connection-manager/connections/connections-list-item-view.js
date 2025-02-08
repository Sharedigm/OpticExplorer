/******************************************************************************\
|                                                                              |
|                        connections-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single connections list item.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionRequest from '../../../../models/connections/connection-request.js';
import BaseView from '../../../../views/base-view.js';
import Selectable from '../../../../views/behaviors/selection/selectable.js';
import DragSelectable from '../../../../views/behaviors/selection/drag-selectable.js';
import Collapsable from '../../../../views/behaviors/expanders/collapsable.js';
import '../../../../utilities/scripting/string-utils.js';
import '../../../../utilities/time/date-utils.js';

export default BaseView.extend(_.extend({}, Selectable, DragSelectable, Collapsable, {

	//
	// attributes
	//

	tagName: 'li',

	template: template(`
		<div class="content">
		
			<div class="tile">
				<a href="<%= href %>" target="_blank">
					<% if (url) { %>
					<div class="thumbnail" style="background-image:url(<%= url %>)" >
						<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</a>
			</div>
		
			<div class="info">
				<div class="heading">
					<% if (editable) { %>
					<div class="buttons">
						<button type="button" class="btn btn-sm delete" data-toggle="tooltip" title="Delete">
							<i class="fa fa-xmark"></i>
						</button>
					</div>
					<% } %>
		
					<div class="title">
						<a href="<%= href %>" target="_blank"><%= name %></a>
					</div>
				</div>
		
				<% if (detailed) { %>
				<div class="fineprint">
					<% if (location && location.hasName()) { %>
					<label class="form-label"><i class="fa fa-globe-americas"></i>Location</label>	
					<%= location.getName() %><br />
					<% } %>
		
					<label class="form-label"><i class="fa fa-calendar-alt"></i>Date</label>
					connected since 
					<%= accepted_at? accepted_at.format('longDate') : '?' %>
				</div>
				<% } %>
			</div>
		</div>
	`),

	events: {
		'mousedown .content': 'onMouseDown',
		'click .expander': 'onClickExpander',
		'click .delete': 'onClickDelete'
	},

	//
	// deleting methods
	//

	deleteConnection: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Connection",
				message: "Are you sure you want to delete " + this.model.getName() + " from your connections list?",
				
				// callbacks
				//
				accept: () => {
					this.deleteConnection(_.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// delete connection
			//
			new ConnectionRequest({
				'id': this.model.get('connection_request_id')
			}).decline({

				// callbacks
				//
				success: () => {
					let model = this.model;

					// remove model from list
					//
					this.model.collection.remove(this.model);

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-user-friends"></i>',
						title: 'Connection Deleted',
						message: "You have deleted " + model.getName() + " from your connections list."
					});
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete connection request.",
						response: response
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
			href: application.getUrl() + '#users/' + this.model.get('id'),
			url: this.model.getProfilePhotoUrl({
				min_size: 50
			}),
			name: this.model.getName(),

			// options
			//
			detailed: this.options.detailed,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	onRender: function() {

		// collapse / expand
		//
		if (this.options.collapsed) {
			this.collapse();
		}
	},

	//
	// mouse event handling methods
	//

	onClickExpander: function() {
		this.toggleCollapse();
	},

	onClickDelete: function() {
		this.deleteConnection();
	}
}));
