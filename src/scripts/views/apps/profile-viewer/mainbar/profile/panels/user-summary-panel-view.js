/******************************************************************************\
|                                                                              |
|                          user-summary-panel-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's profile information.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import UserSummaryView from '../../../../../../views/apps/profile-viewer/mainbar/profile/info/user-summary-view.js';
import '../../../../../../utilities/time/date-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'form-horizontal panel',

	template: template(`
		<div class="header info">
		
			<% if (heading || icon) { %>
			<div class="heading"><% if (icon) { %><div class="icon"><%= icon %></div><% } %><%= heading %></div>
			<% } %>
		
			<% if (editable) { %>
			<div class="buttons">
				<button type="button" class="edit success btn btn-sm" data-toggle="tooltip" title="Edit">
					<i class="fa fa-pencil-alt"></i>
				</button>
			</div>
			<% } %>
		</div>
		
		<div class="content"></div>
	`),

	regions: {
		content: '.content'
	},

	events: {
		'click .edit': 'onClickEdit',
		'dblclick': 'onDoubleClick'
	},

	//
	// editing methods
	//

	edit: function() {
		import(
			'../../../../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-profile-dialog-view.js'
		).then((EditUserProfileDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserProfileDialogView.default({
				model: this.model,

				// callbacks
				//
				onsave: () => {
					this.render();
				}
			}));
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.options.icon,
			heading: this.options.heading,

			// capabilities
			//
			expandable: this.options.expandable,
			editable: this.options.editable
		};
	},

	onRender: function() {

		// show child views
		//
		/*
		if (this.options.editable) {
			this.showChildView('content', new UserProfileFormView({
				model: this.model
			}));
		} else {
			this.showChildView('content', new UserProfileInfoView({
				model: this.model
			}));
		}
		*/
		this.showChildView('content', new UserSummaryView({
			model: this.model,
			user: this.options.user
		}));
	},

	//
	// mouse event handling methods
	//

	onClickEdit: function() {
		if (this.model.isOwnedBy(application.session.user)) {
			this.edit();
		}
	},

	onDoubleClick: function() {
		if (this.model.isOwnedBy(application.session.user)) {
			this.edit();
		}
	}
});