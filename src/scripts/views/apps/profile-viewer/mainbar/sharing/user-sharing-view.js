/******************************************************************************\
|                                                                              |
|                             user-sharing-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's sharing.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import ReceivedSharesView from '../../../../../views/apps/profile-viewer/mainbar/sharing/forms/received-shares-view.js';
import SentSharesView from '../../../../../views/apps/profile-viewer/mainbar/sharing/forms/sent-shares-view.js';
import UserLinksView from '../../../../../views/apps/profile-viewer/mainbar/sharing/forms/user-links-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<ul class="nav nav-tabs secondary" role="tablist">
			
			<li role="presentation" class="received tab<% if (tab == 'received' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".received.tab-pane">
					<i class="fa fa-user"></i>
					<label>Items Shared With Me</label>
				</a>
			</li>
		
			<li role="presentation" class="sent tab<% if (tab == 'sent') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".sent.tab-pane">
					<i class="fa fa-users"></i>
					<label>Items Shared by Me</label>
				</a>
			</li>
		
			<li role="presentation" class="links tab<% if (tab == 'links') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".links.tab-pane">
					<i class="fa fa-link"></i>
					<label>Links</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="received tab-pane<% if (tab == 'received' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="sent tab-pane<% if (tab == 'sent') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="links tab-pane<% if (tab == 'links') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		received: '.received.tab-pane',
		sent: '.sent.tab-pane',
		links: '.links.tab-pane'
	},

	events: {
		'click .nav-tabs [role="tab"]': 'onClickTab'
	},

	//
	// setting methods
	//

	setTab: function(tab) {

		// update attributes
		//
		this.options.tab = tab;

		// find new url
		//
		let url = '#users/' + (this.model.isCurrent()? 'current' : this.model.get('id')) + '/sharing' + (tab && tab != 'received'? '/' + tab : '');
		if (this.options.editable) {
			url += '/edit';
		}

		// update url
		//
		application.navigate(url, {
			trigger: false
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab
		};
	},

	onRender: function() {

		// show current tab
		//
		// this.setTab(this.options.tab);

		// show child views
		//
		this.showReceivedShares();
		this.showSentShares();
		this.showUserLinks();
	},

	showReceivedShares: function() {
		this.showChildView('received', new ReceivedSharesView({
			model: this.model
		}));	
	},

	showSentShares: function() {
		this.showChildView('sent', new SentSharesView({
			model: this.model
		}));	
	},

	showUserLinks: function() {
		this.showChildView('links', new UserLinksView({
			model: this.model
		}));
	},

	//
	// event handling methods
	//

	/*
	onClickTab: function(event) {
		let className = $(event.target).closest('li').attr('class');
		let tab = className.replace('tab', '').replace('active', '').trim();
		this.setTab(tab);
	}
	*/
});
