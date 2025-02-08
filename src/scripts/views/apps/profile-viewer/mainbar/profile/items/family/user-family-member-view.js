/******************************************************************************\
|                                                                              |
|                         user-family-member-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user family member.            |
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
				<%= icon %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<%= name %>
					</div>
				</div>
		
				<div class="row">
					<span class="details"><%= relationship.toTitleCase() %></div>
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
		switch (this.model.get('relationship')) {
			case 'partner':
			case 'wife':
			case 'husband':
			case 'girlfriend':
			case 'boyfriend':
				return '<i class="fa fa-heart"></i>';

			case 'mother':
			case 'sister':
			case 'grandmother':
			case 'aunt':
			case 'mother-in-law':
			case 'sister-in-law':
			case 'grandmother-in-law':
			case 'aunt-in-law':
				return '<i class="fa fa-female"></i>';

			case 'father':
			case 'brother':
			case 'grandfather':
			case 'uncle':
			case 'father-in-law': 
			case 'brother-in-law': 
			case 'grandfather-in-law': 
			case 'uncle-in-law':
				return '<i class="fa fa-male"></i>';

			case 'son':
			case 'daughter':
				return '<i class="fa fa-child"></i>';

			case 'pet': 
			case 'ex-pet': 
			case 'pet-in-law': 
			case 'ex-pet-in-law':
				return '<i class="fa fa-paw"></i>';

			default:
				return '<i class="fa fa-user"></i>';
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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-family-member-dialog-view.js'
		).then((EditUserFamilyMemberDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserFamilyMemberDialogView.default({
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
				message: "Are you sure you want to delete " + this.model + " from your family members?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user family member
			//
			this.model.destroy(options);
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));