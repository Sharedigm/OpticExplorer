/******************************************************************************\
|                                                                              |
|                            chat-info-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form view for displaying a chat session's information.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import ChatInvitations from '../../../../../collections/chats/sharing/chat-invitations.js';
import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import ChatIconView from '../../../../../views/apps/chat-browser/mainbar/chats/icons/chat-icon-view.js';
import GeneralChatPaneView from '../../../../../views/apps/chat-browser/forms/info/panes/general-chat-pane-view.js';
import ChatInvitationsListView from '../../../../../views/apps/chat-browser/forms/invitations/lists/chat-invitations-list-view.js';
import ChatHistoryPaneView from '../../../../../views/apps/chat-browser/forms/info/panes/chat-history-pane-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

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
		
			<li role="presentation" class="members tab<% if (tab == 'members') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".members.tab-pane">
					<i class="fa fa-user"></i>
					<label>Members</label>
				</a>
			</li>
		
			<li role="presentation" class="invitations tab<% if (tab == 'invitations') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".invitations.tab-pane">
					<i class="fa fa-envelope"></i>
					<label>Invitations</label>
				</a>
			</li>
		
			<li role="presentation" class="history tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history.tab-pane">
					<i class="fa fa-calendar"></i>
					<label>History</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="members tab-pane<% if (tab == 'members') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="invitations tab-pane<% if (tab == 'invitations') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="history tab-pane<% if (tab == 'history') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane',
		members: '.members.tab-pane',
		invitations: '.invitations.tab-pane',
		history: '.history.tab-pane'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.getName(),
			tab: 'general'
		};
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'general':
				this.showGeneralPane();
				break;
			case 'members':
				this.showMembersPane();
				break;
			case 'invitations':
				this.showInvitationsPane();
				break;
			case 'history':
				this.showHistoryPane();
				break;
		}
	},

	showItem: function() {
		this.showChildView('item', new ChatIconView({
			model: this.model,

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// pane rendering methods
	//

	showGeneralPane: function() {
		this.showChildView('general', new GeneralChatPaneView({
			model: this.model
		}));
	},

	showMembersPane: function() {

		// show members list
		//
		this.showChildView('members', new UsersView({
			collection: this.model.get('members'),

			// options
			//
			preferences: UserPreferences.create('connection_manager', {
				view_kind: 'icons',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onOpen: function(item) {

				// show user's profile info
				//
				application.showUser(item.model);
			}
		}));
	},

	showInvitationsPane: function() {
		new ChatInvitations().fetchByChat(this.model, {

			// callbacks
			//
			success: (collection) => {
				this.showChildView('invitations', new ChatInvitationsListView({
					collection: collection
				}));
			}
		});
	},

	showHistoryPane: function() {
		this.showChildView('history', new ChatHistoryPaneView({
			model: this.model
		}));
	},
});