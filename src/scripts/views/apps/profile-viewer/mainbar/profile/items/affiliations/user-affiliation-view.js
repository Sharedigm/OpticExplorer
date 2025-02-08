/******************************************************************************\
|                                                                              |
|                            user-affiliation-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user affiliation.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../../views/items/cards/card-view.js';
import Expandable from '../../../../../../../views/behaviors/expanders/expandable.js';
import '../../../../../../../utilities/scripting/string-utils.js';
import '../../../../../../../utilities/time/date-utils.js';

export default CardView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	className: 'expandable item',

	template: template(`
		<div class="card">
		
			<div class="icon">
				<i class="fa fa-users"></i>
			</div>
			
			<div class="info">
				<div class="row">
					<div class="title">			
						<% if (role) { %><%= role.toTitleCase() %><% } %>
					</div>
				</div>
				
				<div class="row">
					<% if (organization_name) { %><span class="details">at <% if (url) { %><a href="<%= url %>" target="_blank"><%= organization_name %></a><% } else { %><%= organization_name %><% } %></span><% } %>
		
					<% if (expandable) { %>
					<div class="expander">
						<button type="button" class="collapse btn-sm">
							<i class="fa fa-caret-up"></i>
						</button>
						<button type="button" class="expand btn-sm">
							<i class="fa fa-caret-down"></i>	
						</button>
					</div>
					<% } %>
				</div>
			</div>
		
			<div class="hideable">
				<form class="form-horizontal">
					<% if (organization_unit) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-sitemap"></i>Unit</label>
						<p class="form-control-static"><%= organization_unit %></p>
					</div>
					<% } %>
		
					<% if (from_year || to_year) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>When</label>
						<p class="form-control-static"><% if (from_year) { %>from <%= from_year %><% } %> to <% if (to_year) { %><%= to_year %><% } else if (from_year) { %>present<% } %></p>
					</div>
					<% } %>
				</form>
			</div>
		</div>
	`),
	editable: false,

	events: _.extend({}, CardView.prototype.events, Expandable.events),
	
	//
	// opening methods
	//

	open: function() {
		if (this.options.editable) {
			this.edit();
		}
	},

	edit: function() {
		import(
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-affiliation-dialog-view.js'
		).then((EditUserAffiliationDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserAffiliationDialogView.default({
				model: this.model,

				// callbacks
				//
				onchange: () => this.render()
			}));
		});
	},

	delete: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + this.model + " from your affiliations?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user affiliation
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,
			url: this.model.getUrl(),

			// capabilities
			//
			expandable: this.options.expandable
		};
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));