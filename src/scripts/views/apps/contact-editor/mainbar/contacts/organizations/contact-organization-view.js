/******************************************************************************\
|                                                                              |
|                         contact-organization-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a contact's organization.               |
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
				<i class="fa fa-briefcase"></i>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<%= title? title.toTitleCase() : '' %>
					</div>
				</div>
		
				<div class="row">
					<% if (company_name) { %><span class="details"><%= company_name %></span><% } %>
				</div>
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
			'../../../../../../views/apps/contact-editor/dialogs/contacts/edit/edit-user-job-dialog-view.js'
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
				message: "Are you sure you want to delete " + this.model.get('title') + "?",

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
			title: this.model.get('title'),
			company_name: this.model.get('company_name')
		};
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
	// mouse event handing methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));