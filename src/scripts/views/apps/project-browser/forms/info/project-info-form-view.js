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

	className: 'form-vertical',

	template: template(`
		<div class="items">
			<div class="icon-grid"></div>
		</div>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>
		
			<% if (show_history) { %>
			<li role="presentation" class="history tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history.tab-pane">
					<i class="fa fa-calendar"></i>
					<label>History</label>
				</a>
			</li>
			<% } %>
		
			<% if (show_members) { %>
			<li role="presentation" class="members tab<% if (tab == 'members') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".members.tab-pane">
					<i class="fa fa-user"></i>
					<label>Members</label>
				</a>
			</li>
			<% } %>
		
			<% if (show_security) { %>
			<li role="presentation" class="security tab<% if (tab == 'security') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".security.tab-pane">
					<i class="fa fa-shield-alt"></i>
					<label>Security</label>
				</a>
			</li>
			<% } %>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="history tab-pane<% if (tab == 'history') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="members tab-pane<% if (tab == 'members') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="security tab-pane<% if (tab == 'security') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane',
		history: '.history.tab-pane',
		members: '.members.tab-pane',
		security: '.security.tab-pane'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: 'general',
			show_history: !this.model.get('required'),
			show_members: application.isSignedIn() && !this.model.get('required'),
			show_security: true
		};
	},
	
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