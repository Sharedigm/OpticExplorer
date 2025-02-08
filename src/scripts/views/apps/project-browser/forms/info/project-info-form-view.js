/******************************************************************************\
|                                                                              |
|                          project-info-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for a task project's information.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import ProjectIconView from '../../../../../views/apps/project-browser/mainbar/projects/icons/project-icon-view.js';
import GeneralPaneView from '../../../../../views/apps/project-browser/forms/info/panes/general-pane-view.js';
import HistoryPaneView from '../../../../../views/apps/project-browser/forms/info/panes/history-pane-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';
import SecurityPaneView from '../../../../../views/apps/project-browser/forms/info/panes/security-pane-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "History",
			"icon": "fa fa-calendar"
		},
		{
			"name": "Members",
			"icon": "fa fa-user"
		},
		{
			"name": "Security",
			"icon": "fa fa-shield-alt"
		}
	],

	//
	// rendering methods
	//
	
	onRender: function() {
		let required = this.model.get('required');

		// show child views
		//
		this.showItem();
		this.showGeneralPane();
		this.showSecurityPane();

		if (!required) {
			this.showHistoryPane();
			this.showMembersPane();
		} else {
			this.hideTab('history');
			this.hideTab('members');
		}

		// fetch project members
		//
		if (application.isSignedIn() && !required) {
			this.model.fetchMembers({

				// callbacks
				//
				success: (collection) => {
					this.showMembersPane(collection);
				}
			});
		} else {
			this.hideTab('members');
		}
	},

	showItem: function() {
		this.showChildView('item', new ProjectIconView({
			model: this.model,

			// capabilities
			//
			selectable: false
		}));
	},

	showGeneralPane: function() {
		this.showChildView('general', new GeneralPaneView({
			model: this.model
		}));
	},

	showHistoryPane: function() {
		this.showChildView('history', new HistoryPaneView({
			model: this.model
		}));
	},

	showMembersPane: function(members) {

		// show members list
		//
		this.showChildView('members', new UsersView({
			collection: members,

			// options
			//
			empty: "No members.",

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onopen: function(item) {

				// show member's profile info
				//
				application.showUser(item.model);
			}
		}));
	},

	showSecurityPane: function() {
		this.showChildView('security', new SecurityPaneView({
			model: this.model
		}));
	}
});