/******************************************************************************\
|                                                                              |
|                          connection-info-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing information about a connection.       |
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
import Connections from '../../../../../collections/users/connections/connections.js';
import ShareRequests from '../../../../../collections/storage/sharing/share-requests.js';
import InfoFormView from '../../../../../views/apps/common/forms/info-form-view.js';
import UserIconView from '../../../../../views/apps/profile-browser/mainbar/users/icons/user-icon-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';
import ConnectionInfoPaneView from '../../../../../views/apps/connection-manager/forms/info/panes/connection-info-pane-view.js';
import ConnectionHistoryPaneView from '../../../../../views/apps/connection-manager/forms/info/panes/connection-history-pane-view.js';
import SentShareRequestsListView from '../../../../../views/apps/file-browser/sharing/share-requests/sent-list/sent-share-requests-list-view.js';
import ReceivedShareRequestsListView from '../../../../../views/apps/file-browser/sharing/share-requests/received-list/received-share-requests-list-view.js';

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
		
			<li role="presentation" class="history tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history.tab-pane">
					<i class="fa fa-calendar-alt"></i>
					<label>History</label>
				</a>
			</li>
		
			<li role="presentation" class="mutual tab<% if (tab == 'mutual') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".mutual.tab-pane">
					<i class="fa fa-user-friends"></i>
					<label>Mutual</label>
				</a>
			</li>
		
			<li role="presentation" class="sent tab<% if (tab == 'sent') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".sent.tab-pane">
					<i class="fa fa-share"></i>
					<label>Sent</label>
				</a>
			</li>
		
			<li role="presentation" class="received tab<% if (tab == 'received') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".received.tab-pane">
					<i class="fa fa-reply"></i>
					<label>Received</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="history tab-pane<% if (tab == 'history') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="mutual tab-pane<% if (tab == 'mutual') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="sent tab-pane<% if (tab == 'sent') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="received tab-pane<% if (tab == 'received') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane',
		history: '.history.tab-pane',
		mutual: '.mutual.tab-pane',
		sent: '.sent.tab-pane',
		received: '.received.tab-pane',
	},

	events: {
		'mousedown': 'onMouseDown'
	},

	//
	// counting methods
	//

	numSelectedShareRequests: function() {
		switch (this.getTab()) {
			case 'sent':
				return this.numSentSelected();
			case 'received':
				return this.numReceivedSelected();
		}
	},

	numSent: function() {
		if (this.hasChildView('sent')) {
			return this.getChildView('sent').collection.length;
		}
	},

	numSentSelected: function() {
		if (this.hasChildView('sent')) {
			return this.getChildView('sent').numSelected();
		}
	},

	numReceived: function() {
		if (this.hasChildView('received')) {
			return this.getChildView('received').collection.length;
		}
	},

	numReceivedSelected: function() {
		if (this.hasChildView('received')) {
			return this.getChildView('received').numSelected();
		}
	},

	//
	// getting methods
	//

	getTab: function() {
		let tab = this.$el.find('.nav-tabs li.active');
		let className = tab.attr('class');
		return className.replace('tab', '').replace('active', '').trim();
	},

	getSelectedShareRequests: function() {
		switch (this.getTab()) {
			case 'sent':
				return this.getSelectedSent();
			case 'received':
				return this.getSelectedReceived();
		}
	},

	getSelectedSent: function() {
		if (this.hasChildView('sent')) {
			return this.getChildView('sent').getSelectedModels();
		}
	},
	
	getSelectedReceived: function() {
		if (this.hasChildView('received')) {
			return this.getChildView('received').getSelectedModels();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.options.index,
			tab: this.options.tab || 'general'
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'general':
				this.showGeneralPane();
				break;
			case 'history':
				this.showHistoryPane();
				break;
			case 'mutual':
				this.fetchAndShowMutualPane();
				break;
			case 'sent':
				this.fetchAndShowSentPane();
				break;
			case 'received':
				this.fetchAndShowReceivedPane();
				break;			
		}
	},

	showItem: function() {
		this.showChildView('item', new UserIconView({
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
		this.showChildView('general', new ConnectionInfoPaneView({
			model: this.model,
			kind: 'File'
		}));
	},

	showHistoryPane: function() {
		this.showChildView('history', new ConnectionHistoryPaneView({
			model: this.model
		}));
	},

	fetchAndShowMutualPane: function() {
		new Connections().fetchMutual(application.session.user, this.model, {

			// callbacks
			//
			success: (collection) => {

				// show number of mutual connections
				//
				this.$el.find('.mutual .count').text(collection.length);

				// show mutual connections pane
				//
				this.showMutualPane(collection);
			}
		});		
	},

	showMutualPane: function(collection) {
		this.showChildView('mutual', new UsersView({
			collection: collection,

			// options
			//
			preferences: UserPreferences.create('connection_manager', {
				view_kind: 'icons',
				detail_kind: null
			}),
			empty: "No mutual connections with " + this.model.getName() + ".",

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onopen: (item) => {
				this.onOpen(item);
			}
		}));
	},

	fetchAndShowSentPane: function() {
		new ShareRequests().fetchReceivedFrom(this.model, {

			// callbacks
			//
			success: (collection) => {
				this.showSentPane(collection);
			}
		});
	},

	fetchAndShowReceivedPane: function() {
		new ShareRequests().fetchSentTo(this.model, {

			// callbacks
			//
			success: (collection) => {
				this.showReceivedPane(collection);
			}
		});
	},

	showSentPane: function(collection) {
		this.showChildView('sent', new SentShareRequestsListView({
			model: this.model,
			collection: collection,

			// options
			//
			hidden: {
				'recipient': true
			},

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));		
	},

	showReceivedPane: function(collection) {
		this.showChildView('received', new ReceivedShareRequestsListView({
			model: this.model,
			collection: collection,

			// options
			//
			hidden: {
				'sender': true
			},

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));		
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// show connection's profile info
		//
		application.showUser(item.model);
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function() {

		// deselect previously selected items
		//
		if (this.hasChildView('sent')) {
			this.getChildView('sent').deselectAll();
		}
		if (this.hasChildView('received')) {
			this.getChildView('received').deselectAll();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});
