/******************************************************************************\
|                                                                              |
|                              user-panels-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's information.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserProfile from '../../../../models/users/profile/user-profile.js';
import UserPreferences from '../../../../models/preferences/user-preferences.js';
import BaseView from '../../../../views/base-view.js';
import UserProfileHeaderView from '../../../../views/users/profile/user-profile-header-view.js';
import UserProfileView from '../../../../views/apps/profile-viewer/mainbar/profile/user-profile-view.js';
import UserFilesView from '../../../../views/apps/profile-viewer/mainbar/files/user-files-view.js';
import UserPhotosView from '../../../../views/apps/profile-viewer/mainbar/photos/user-photos-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'user-panels',

	template: template(`
		<div class="user-profile-header" style="margin-bottom:10px"></div>
		
		<h2 class="name" style="display:none"><%= name %></h2>
		
		<ul class="user-info nav nav-tabs collapsed-xs" role="tablist">
		
			<li role="presentation" class="profile tab<% if (nav == 'profile' || !nav) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".profile.tab-pane">
					<i class="fa fa-user-circle"></i>
					<label>Profile</label>
				</a>
			</li>
		
			<li role="presentation" class="news tab<% if (nav == 'news') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".news.tab-pane">
					<i class="fa fa-newspaper"></i>
					<label>News</label>
				</a>
			</li>
		
			<li role="presentation" class="connections tab<% if (nav == 'connections') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".connections.tab-pane">
					<i class="fa fa-user-friends"></i>
					<label>Connections</label>
				</a>
			</li>
		
			<li role="presentation" class="files tab<% if (nav == 'files') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".files.tab-pane">
					<i class="fa fa-file"></i>
					<label>Files</label>
				</a>
			</li>
		
			<li role="presentation" class="photos tab<% if (nav == 'photos') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".photos.tab-pane">
					<i class="fa fa-camera"></i>
					<label>Photos</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" class="profile tab-pane<% if (nav == 'profile' || !nav) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="news tab-pane<% if (nav == 'news') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="connections tab-pane<% if (nav == 'connections') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="files tab-pane<% if (nav == 'files') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="photos tab-pane<% if (nav == 'photos') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		header: '.user-profile-header',
		profile: '.profile.tab-pane',
		news: '.news.tab-pane',
		connections: '.connections.tab-pane',
		files: '.files.tab-pane',
		photos: '.photos.tab-pane',
		requests: '.requests.tab-pane',
		notifications: '.notifications.tab-pane',
		sharing: '.sharing.tab-pane'
	},

	events: {
		'click > .nav-tabs [role="tab"]': 'onClickTab'
	},

	nav: 'profile',

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.nav) {
			this.nav = this.options.nav;
		}

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// querying methods
	//

	hasActiveView: function() {
		return this.nav != undefined;
	},

	hasSelected: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().hasSelected();
		}
	},

	//
	// getting methods
	//

	getActiveView: function() {
		return this.getChildView(this.nav);
	},
	
	getSelected: function() {
		return this.getActiveView().getSelected();
	},

	getSelectedModels: function() {
		return this.getActiveView().getSelectedModels();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'nav':
				this.$el.find('.' + value + '.tab a').trigger('click');
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('full_name'),
			nav: this.nav
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
					this.options.profile = model;
					this.showPanels(this.options.nav);
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
			this.showPanels(this.options.nav);
		}

		// hide connections tab
		//
		if (!application.hasApp('connection_manager')) {
			this.hideTab('connections');
		}
	},

	showHeader: function() {
		this.showChildView('header', new UserProfileHeaderView({
			model: this.model,

			// options
			//
			profile: this.options.profile,
			autosave: true,

			// capabilities
			//
			editable: this.model.isCurrent() && this.options.editable
		}));
	},

	hideTab: function(name) {
		this.$el.find('.' + name).hide();
	},

	//
	// panel rendering methods
	//

	showPanels: function(nav) {
		this.showHeader();
		this.showPanel(nav || 'profile');

		// show hidden panels
		//
		if (!nav || nav == 'profile') {

			//  show profile panels
			//
			this.showNewsPanel();
			this.showUserConnections();
			this.showUserFiles();
			this.showUserPhotos();
		}
	},

	showPanel: function(nav) {

		// set attributes
		//
		this.nav = nav;

		// return if view has already been rendered
		//
		if (this.hasChildView(nav)) {
			return;
		}

		// update view
		//
		switch (nav || 'profile') {
			case 'profile':
				this.showProfile();
				break;
			case 'news':
				this.fetchAndShowUserNews();
				break;
			case 'connections':
				this.showUserConnections();
				break;
			case 'files':
				this.showUserFiles();
				break;
			case 'photos':
				this.showUserPhotos();
				break;
		}
	},

	showProfile: function() {
		this.showChildView('profile', new UserProfileView({
			model: this.model,

			// options
			//
			profile: this.options.profile,
			nav: this.options.tab,
			header: this.getChildView('header'),

			// capabilities
			//
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			onclicktab: this.options.onclicktab,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}));
	},

	showNewsPanel: function() {
		if (application.hasApp('topic_viewer')) {
			this.fetchAndShowUserNews();
		} else {
			this.hideTab('news');
		}
	},

	fetchAndShowUserNews: function() {
		let preferences = UserPreferences.create('topic_viewer');

		// skip fetching of user preferences if not logged in
		//
		if (!application.session.user) {
			this.showUserNews(preferences);
			return;
		}

		// fetch user news browser preferences
		//
		preferences.fetch({

			// callbacks
			//
			success: (model) => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// update view
				//
				this.showUserNews(model);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not fetch user preferences.",
					response: response
				});
			}
		});
	},

	showUserNews: function(preferences) {
		application.loadAppView('topic_viewer', {

			// callbacks
			//
			success: (TopicViewerView) => {
				this.showChildView('news', TopicViewerView.getUserTopicView({
					user: this.model,

					// options
					//
					nav: this.options.tab,
					preferences: preferences,
					collapsed: !preferences.get('show_comments'),
					condensed: !preferences.get('show_options'),
					itemsPerPage: preferences.get('items_per_page'),
					public: this.options.public,

					// capabilities
					//
					editable: false,

					// callbacks
					//
					onselect: this.options.onselect,
					ondeselect: this.options.ondeselect,
					onopen: this.options.onopen,
					onadd: this.options.onadd,
					onremove: this.options.onremove
				}));
			}
		});
	},

	showUserConnections: function() {

		// check if we can show connections
		//
		if (!application.hasApp('connection_manager')) {
			this.$el.find('.connections').hide();
			return;
		}

		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {
				this.showChildView('connections', ConnectionManagerView.getUserConnectionsView({
					model: this.model,
					load: true,

					// options
					//
					preferences: UserPreferences.create('connection_manager'),

					// capabilities
					//
					selectable: true,

					// callbacks
					//
					onselect: this.options.onselect,
					ondeselect: this.options.ondeselect,
					onopen: this.options.onopen,
					onadd: this.options.onadd,
					onremove: this.options.onremove
				}));
			}
		});
	},

	showUserFiles: function() {
		this.showChildView('files', new UserFilesView({
			model: this.model,

			// options
			//
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			editable: true,
			draggable: true,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}));
	},

	showUserPhotos: function() {
		this.showChildView('photos', new UserPhotosView({
			model: this.model,

			// options
			//
			view_kind: this.options.preferences? this.options.preferences.get('photos_view_kind') : undefined,

			// capabilities
			//
			editable: false,

			// callbacks
			//
			onopen: this.options.onopen
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.$el.find('.name').html(this.model.getName('full'));
	},

	onClickTab: function(event) {
		let className = $(event.target).closest('li').attr('class');
		let tab = className.replace('tab', '').trim();

		// update tabs
		//
		this.showPanel(tab);

		// perform callback
		//
		if (this.options.onclicktab) {
			this.options.onclicktab(tab);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('files')) {
			this.getChildView('files').onKeyDown(event);
		}
	}
});