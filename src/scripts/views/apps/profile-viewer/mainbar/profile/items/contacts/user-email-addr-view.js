/******************************************************************************\
|                                                                              |
|                             user-email-addr-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user email addr.               |
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
import HtmlUtils from '../../../../../../../utilities/web/html-utils.js';
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
				<%= icon %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<a href="mailto:<%= href %>"><%= url %></a>
					</div>
				</div>
				
				<div class="row">
					<% if (email_addr_kind) { %><span class="details"><%= email_addr_kind.toTitleCase() %> Email</span><% } %>
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
		switch (this.model.get('email_addr_kind')) {
			case 'home':
				return '<i class="fa fa-home"></i>'; 
			case 'work':
				return '<i class="fa fa-briefcase"></i>';
			default:
				return '<i class="fa fa-envelope"></i>';
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
			'../../../../../../../views/apps/profile-viewer/dialogs/profile/edit/contacts/edit-user-email-addr-dialog-view.js'
		).then((EditUserEmailAddrDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserEmailAddrDialogView.default({
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
				message: "Are you sure you want to delete " + this.model + " from your contacts?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user email addresss
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let emailAddr = this.model.get('email_addr');

		return {
			icon: this.getIcon(),
			name: this.getName(),
			href: emailAddr,
			url: HtmlUtils.encode(emailAddr)
		};
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));