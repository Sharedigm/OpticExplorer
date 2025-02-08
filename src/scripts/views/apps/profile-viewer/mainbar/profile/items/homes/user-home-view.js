/******************************************************************************\
|                                                                              |
|                              user-home-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user home.                     |
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

	className: 'item',

	template: template(`
		<div class="card">
			<div class="icon">
				<i class="fa fa-home"></i>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<% if (city || state || country) { %>
						<%= city %>, <%= state %> <%= country != 'United States'? country : '' %>
						<% } %>
						&nbsp;<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' />
					</div>
				</div>
				
				<div class="row">
					<% if (from_year || to_year) { %><span class="details">from <%= from_year || 'birth' %> to <%= to_year || 'present' %></span><% } %>
				</div>
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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-home-dialog-view.js'
		).then((EditUserHomeDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserHomeDialogView.default({
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
				message: "Are you sure you want to delete " + this.model + " from your homes?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user home
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			flag: this.getFlag()
		};
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));