/******************************************************************************\
|                                                                              |
|                            user-article-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user article.                  |
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
				<i class="fa fa-file-alt"></i>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">
						<% if (url) { %>
						<a href="<%= url %>" target="_blank"><%= title %></a>
						<% } else { %>
						<%= title %>
						<% } %>
					</div>
				</div>
		
				<div class="row">
					<% if (journal) { %><span class="details">in <%= journal %></span><% } %>
		
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
		
					<% if (authors) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-user"></i>Authors</label>
						<p class="form-control-static"><%= authors %></p>
					</div>
					<% } %>
					
					<% if (subjects) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-info-circle"></i>Subjects</label>
						<p class="form-control-static"><%= subjects %></p>
					</div>
					<% } %>
		
					<% if (date) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>Date</label>
						<p class="form-control-static"><%= date %></p>
					</div>
					<% } %>
		
					<% if (publisher) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-building"></i>Publisher</label>
						<p class="form-control-static"><%= publisher %></p>
					</div>
					<% } %>
		
					<div class="form-group">
						<label class="form-label"><i class="fa fa-building"></i>City</label>
						<p class="form-control-static"><% if (city) { %><%= city %><% if (state) { %>, <% } %><% } %><% if (state) { %><%= state %><% } %></p>
					</div>
		
					<div class="form-group">
						<label class="form-label"><i class="fa fa-globe-americas"></i>Country</label>
						<p class="form-control-static"><% if (country) { %><%= country %><% } %><% if (flag) { %>&nbsp;<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' /><% } %></p>
					</div>
		
					<% if (issn_number) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-hashtag"></i>ISSN #</label>
						<p class="form-control-static"><%= issn_number %></p>
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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/publications/edit-user-article-dialog-view.js'
		).then((EditUserArticleDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserArticleDialogView.default({
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

			// delete user article
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