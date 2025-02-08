/******************************************************************************\
|                                                                              |
|                               user-job-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user job.                      |
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
				<i class="fa fa-briefcase"></i>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<%= title? title.toTitleCase() : '' %>
					</div>
				</div>
		
				<div class="row">
					<% if (company_name) { %><span class="details"><% if (url) { %><a href="<%= url %>" target="_blank"><%= company_name %></a><% } else { %><%= company_name %><% } %></span><% } %>
		
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
		
					<% if (division) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-sitemap"></i>Division</label>
						<p class="form-control-static"><%= division %></p>
					</div>
					<% } %>
		
					<% if (description) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-quote-left"></i>What</label>
						<p class="form-control-static"><%= description %></p>
					</div>
					<% } %>
		
					<% if (from_date || to_date) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>When</label>
						<p class="form-control-static"><% if (from_date) { %>from <%= from_date.format('mmm, yyyy') %><% } %> to <% if (to_date) { %><%= to_date.format('mmm, yyyy') %><% } else if (from_date) { %>present<% } %></p>
					</div>
					<% } %>
		
					<% if (location || flag) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-globe-americas"></i>Where</label>
						<p class="form-control-static"><%= location %><% if (flag) { %>&nbsp;<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' /><% } %></p>
					</div>
					<% } %>
		
					<% if (achievements) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-check"></i>Actions</label>
						<p class="form-control-static"><%= achievements %></p>
					</div>
					<% } %>
		
					<% if (awards) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-trophy"></i>Awards</label>
						<p class="form-control-static"><%= awards %></p>
					</div>
					<% } %>
		
					<% if (skills) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-wrench"></i>Skills</label>
						<p class="form-control-static"><%= skills %></p>
					</div>
					<% } %>
				</form>
			</div>
		</div>
	`),
	editable: false,

	events: _.extend({}, CardView.prototype.events, Expandable.events),
	
	//
	// getting methods
	//

	getCountry: function() {
		return this.options.countries? this.options.countries.findWhere({
			'name': this.model.get('country')
		}) : undefined;
	},

	getFlag: function() {
		let country = this.getCountry();
		if (country) {
			return country.getFlag();
		}
	},

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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-job-dialog-view.js'
		).then((EditUserJobDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserJobDialogView.default({
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
				message: "Are you sure you want to delete " + this.model + "?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user job
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			flag: this.getFlag(),
			url: this.model.getUrl(),
			location: this.model.getLocation(),

			// capabilities
			//
			expandable: this.options.expandable
		};
	},

	//
	// mouse event handing methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));