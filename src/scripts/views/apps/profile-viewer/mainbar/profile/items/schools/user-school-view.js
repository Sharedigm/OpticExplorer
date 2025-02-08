/******************************************************************************\
|                                                                              |
|                              user-school-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user school.                   |
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
				<% if (degree) { %>
				<i class="fa fa-graduation-cap"></i>
				<% } else { %>
				<i class="fa fa-university"></i>
				<% } %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<% if (url) { %><a href="<%= url %>" target="_blank"><%= school_name %></a><% } else { %><%= school_name %><% } %>
					</div>
				</div>
		
				<div class="row">
					<% if (school_name) { %><span class="details"><% if (degree) { %><%= degree.toTitleCase() %><% } %></span><% } %>
		
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
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>When</label>
						<p class="form-control-static"><% if (from_year) { %>from <%= from_year %><% } %> to <% if (to_year) { %><%= to_year %><% } else if (from_year) { %>present<% } %></p>
					</div>
		
					<% if (from_grade_level || to_grade_level) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-bars"></i>Grades</label>
						<p class="form-control-static"><% if (from_grade_level) { %>from <%= from_grade_level %><% } %><% if (to_grade_level) { %> to <%= to_grade_level %><% } %></p>
					</div>
					<% } %>
		
					<% if (location || flag) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-globe-americas"></i>Where</label>
						<p class="form-control-static"><%= location %><% if (flag) { %>&nbsp;<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' /><% } %></p>
					</div>
					<% } %>
		
					<% if (major_subject || minor_subject) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-certificate"></i>Subject</label>
						<p class="form-control-static"><%= major_subject %><% if (minor_subject) { %>
						/ <%= minor_subject %><% } %></p>
					</div>
					<% } %>
		
					<% if (sports) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-football-ball"></i>Sports</label>
						<p class="form-control-static"><%= sports %></p>
					</div>
					<% } %>
		
					<% if (clubs) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-users"></i>Clubs</label>
						<p class="form-control-static"><%= clubs %></p>
					</div>
					<% } %>
		
					<% if (activities) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-music"></i>Activities</label>
						<p class="form-control-static"><%= activities %></p>
					</div>
					<% } %>
		
					<% if (honors) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-trophy"></i>Honors</label>
						<p class="form-control-static"><%= honors %></p>
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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-school-dialog-view.js'
		).then((EditUserSchoolDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserSchoolDialogView.default({
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
				message: "Are you sure you want to delete " + this.model + " from your schools?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user school
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			degree: this.model.getDegree(),
			flag: this.getFlag(),
			url: this.model.getUrl(),
			location: this.model.getLocation(),

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