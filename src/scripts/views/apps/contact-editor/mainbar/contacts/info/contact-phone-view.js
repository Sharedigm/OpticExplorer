/******************************************************************************\
|                                                                              |
|                            contact-phone-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a contact's phone number.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import Expandable from '../../../../../../views/behaviors/expanders/expandable.js';
import '../../../../../../utilities/scripting/string-utils.js';
import '../../../../../../utilities/time/date-utils.js';

export default CardView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	className: 'expandable item',

	template: template(`
		<div class="card">
		
			<div class="icon">
				<%= icon %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<% if (country_code) { %>
						<%= country_code %>
						<% } %>
		
						<% if (area_code) { %>
						(<%= area_code %>)
						<% } %>
		
						<% if (phone_number) { %>
						<%= phone_number %>
						<% } %>
					</div>
				</div>
				
				<div class="row">
					<% if (phone_kind) { %><span class="details"><%= phone_kind.toTitleCase() %> Phone</span><% } %>
				</div>
			</div>
		</div>
	`),
	editable: false,

	events: _.extend({}, CardView.prototype.events, Expandable.events),

	//
	// getting methods
	//

	getIcon: function() {
		switch (this.model.get('phone_kind')) {
			case 'mobile':
				return '<i class="fa fa-mobile"></i>';
			case 'home':
				return '<i class="fa fa-phone"></i>';
			case 'work':
				return '<i class="fa fa-briefcase"></i>';
			default:
				return '<i class="fa fa-phone"></i>';
		}
	},

	getDescription: function() {
		return this.model.get('phone_number') || "this phone number";
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
			'../../../../../../views/apps/contact-editor/dialogs/contacts/edit/contacts/edit-user-phone-dialog-view.js'
		).then((EditUserPhoneDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserPhoneDialogView.default({
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
				message: "Are you sure you want to delete " + this.getDescription() + " from your contacts?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user phone number
			//
			this.model.destroy(options);
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update
		//
		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));