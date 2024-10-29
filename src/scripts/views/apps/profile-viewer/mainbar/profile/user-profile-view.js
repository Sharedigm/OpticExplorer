/******************************************************************************\
|                                                                              |
|                              user-profile-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's profile info.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserProfile from '../../../../../models/users/profile/user-profile.js';
import BaseView from '../../../../../views/base-view.js';
import UserProfilePanelsView from '../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-profile-panels-view.js';
import UserSummaryPanelView from '../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-summary-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="user-profile-panels"></div>
		
		<% if (editable) { %>
		<div class="buttons">
			<button class="edit-profile btn btn-primary btn-lg">
				<i class="fa fa-pencil-alt"></i>Edit Profile
			</button>
		</div>
		<% } %>
	`),

	regions: {
		panels: '.user-profile-panels'
	},

	events: {
		'click .edit-profile': 'onClickEditProfile',
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('panels')) {
			return this.getChildView('panels').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('panels').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('panels').getSelectedModels();
	},

	//
	// editing methods
	//

	edit: function() {
		this.getChildView('panels').getChildView('about').edit();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			editable: false
		};
	},

	onRender: function() {
		if (!this.options.profile) {

			// fetch user profile
			//
			new UserProfile().fetchByUser(this.model, {

				// callbacks
				//
				success: (model) => {
					this.showUserProfile(model);
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not find user's profile.",
						response: response
					});
				}
			});
		} else {
			this.showUserProfile(this.options.profile);
		}
	},

	showUserProfile: function(profile) {
		this.options.profile = profile;

		// show summary or full profile
		//
		if (this.options.summary) {
			this.showUserProfileSummary(profile);
		} else {
			this.showUserProfilePanels(profile);
		}
	},

	showUserProfilePanels: function() {
		this.showChildView('panels', new UserProfilePanelsView({
			model: this.model,

			// options
			//
			profile: this.options.profile,
			tab: this.options.nav,
			multicolumn: false,

			// capabilities
			//
			editable: this.model.isCurrent() && this.options.editable != false,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onclicktab: this.options.onclicktab,
			onadd: (items) => this.onAdd(items),
			onremove: (items) => this.onRemove(items)
		}));
	},

	showUserProfileSummary: function() {
		this.showChildView('panels', new UserSummaryPanelView({
			user: this.model,
			model: this.options.profile,

			// options
			//
			heading: "About me..."
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update summary view
		//
		this.getChildView('panels').showUserSummaryPanel();
	},

	onAdd: function(items) {
		this.onChange();

		// perform callback
		//
		if (this.options.onadd) {
			this.options.onadd(items);
		}
	},

	onRemove: function(items) {
		this.onChange();

		// perform callback
		//
		if (this.options.onremove) {
			this.options.onremove(items);
		}
	},

	//
	// mouse event handling methods
	//

	onClickEditProfile: function() {
		this.edit();
	}
});
