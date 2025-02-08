/******************************************************************************\
|                                                                              |
|                              user-header-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application header and associated content.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserProfile from '../../models/users/profile/user-profile.js';
import HeaderView from '../../views/layout/header-view.js';
import StorageIndicatorView from '../../views/layout/storage-indicator-view.js';
import AppsBarView from '../../views/apps/common/apps-bar-view.js';
import Browser from '../../utilities/web/browser.js';
import '../../../vendor/bootstrap/js/collapse.js';

export default HeaderView.extend({

	//
	// attributes
	//

	id: 'header',
	className: 'user-header',

	template: template(`
		<div class="navbar navbar-fixed-top navbar-inverse">
			<div class="collapse navbar-collapse">
		
				<div class="navbar-brand">
					<div class="active brand">
						<% if (branding.header.brand.logo) { %>
						<img class="logo" src="<%= branding.header.brand.logo.src %>" />
						<% } %>
		
						<% if (branding.header.brand.logotype) { %>
						<div class="logotype">
							<% if (branding.header.brand.logotype.names) { %>
							<% let keys = Object.keys(branding.header.brand.logotype.names); %>
							<% for (let i = 0; i < keys.length; i++) { %><% let key = keys[i]; %><span><%= key.replace(/ /g, '&nbsp') %></span><% } %>
							<% } %>
						</div>
						<% } %>
					</div>
				</div>
		
				<ul class="nav navbar-nav navbar-right">
		
					<% if (has_profile) { %>
					<li class="my-profile hidden-xxs <% if (nav == 'self') {%> active<% } %>">
						<a class="hidden-xxs self">
							<div data-toggle="tooltip" title="Profile" data-placement="bottom" data-container="body">

								<div class="small tile">
									<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)<% if (!thumbnail_url) { %>; display:none<% } %>">
									</div>
									<div class="thumbnail missing"<% if (thumbnail_url) { %> style="display:none"<% } %>>
										<i class="fa fa-user"></i>
									</div>
								</div>

								<span class="name">
									<%= user.getName('single') %>
								</span>
							</div>
						</a>
					</li>
					<% } %>

					<li class="settings-info hidden-xxs">
						<a class="my-settings">
							<i class="fa fa-cog" data-toggle="tooltip" title="Settings" data-placement="bottom" data-container="body"></i>
						</a>
					</li>

					<li class="storage-info hidden-xxs">
						<a class="storage-indicator">
							<div class="my-storage" data-toggle="tooltip" title="Storage" data-placement="bottom" data-container="body"></div>
						</a>
					</li>
				</ul>

				<ul class="apps-bar nav navbar-nav navbar-right"></ul>

				<ul class="nav navbar-nav navbar-right">

					<% if (has_connections) { %>
					<li class="hidden-xxs">
						<a class="find-connections">
							<span data-toggle="tooltip" title="Find Connections" data-placement="bottom" data-container="body">
								<i class="fa fa-user"></i><i class="fa fa-sm fa-search"></i>
							</span>
						</a>
					</li>
					<% } %>

					<li class="connection-requests-dropdown hidden-xxs"></li>
					<li class="notifications-dropdown hidden-xxs"></li>

					<li class="buttons">
						<a class="sign-out">
							<i class="fa fa-sign-out-alt"></i>
							Sign Out
						</a>
					</li>
				</ul>
			</div>
		</div>
	`),

	regions: {
		storage_indicator: {
			el: '.my-storage',
			replaceElement: false
		},
		apps: {
			el: '.apps-bar',
			replaceElement: true
		},
		connection_requests: {
			el: '.connection-requests-dropdown',
			replaceElement: true
		},
		notifications: {
			el: '.notifications-dropdown',
			replaceElement: true
		}
	},

	events: _.extend({}, HeaderView.prototype.events, {
		'click .brand': 'onClickBrand',
		'click .my-profile': 'onClickMyProfile',
		'click .my-settings': 'onClickMySettings',
		'click .my-storage': 'onClickMyStorage',
		'click .find-connections': 'onClickFindConnections',
		'click .sign-out': 'onClickSignOut'
	}),

	tooltips: {
		placement : 'bottom'
	},

	// image attributes
	//
	thumbnailSize: 25,

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return application.session.user? application.session.user.getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		}) : null;
	},

	//
	// setting methods
	//

	setProfilePhotoUrl: function(url) {
		if (url) {
			this.$el.find('.self .thumbnail:not(.missing)').show().css('background-image', 'url(' + url + ')');
			this.$el.find('.self .thumbnail img').attr('src', url);
			this.$el.find('.self .thumbnail.missing').hide();
		} else {
			this.$el.find('.self .thumbnail:not(.missing)').hide().css('background-image', 'url(' + url + ')');
			this.$el.find('.self .thumbnail img').attr('src', url);
			this.$el.find('.self .thumbnail.missing').show();
		}
	},

	setProfilePhoto: function(imageFile) {

		// set thumbnail image url
		//
		if (imageFile) {
			this.setProfilePhotoUrl(imageFile.getThumbnailUrl({
				min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
			}));
		} else {
			this.setProfilePhotoUrl(null);
		}
	},

	setProfileName: function(name) {
		this.$el.find('.my-profile .name').text(name);
	},

	//
	// authenticating methods
	//

	signOut: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm sign out
			//
			application.confirm({
				message: "Are you sure that you want to log out?",

				// callbacks
				//
				accept: () => {
					this.signOut({
						confirm: false
					});
				}
			});
		} else {

			// sign out of application
			//
			application.logout();
		}
	},

	//
	// saving methods
	//

	saveProfilePhoto: function(imageFile) {
		new UserProfile({
			user_id: application.session.user.get('id')
		}).fetch({
			success: (model) => {
				model.save({
					profile_photo_path: imageFile? imageFile.get('path') : null
				}, {

					// callbacks
					//
					success: () => this.showProfilePhoto(imageFile),

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not save profile.",
							response: response
						});
					}
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			defaults: config.defaults,
			branding: config.branding,
			nav: this.options.nav,
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			user: application.session.user,
			is_mobile: Browser.is_mobile,
			has_profile: application.hasApp('profile_viewer'),
			has_connections: application.hasApp('connection_manager'),
			has_notifications: application.hasApp('notification_center')
		};
	},

	onRender: function() {

		// call superclass method
		//
		HeaderView.prototype.onRender.call(this);

		// show child views
		//
		if (this.model && application.getUserStorage() != 's3') {
			this.showStorageIndicator();
		} else {
			this.hideStorageIndicator();
		}
		if (!Browser.is_mobile) {

			// show connection requests dropdown
			//
			if (application.hasApp('connection_manager')) {
				this.showConnectionRequests();
			}

			// show notifications dropdown
			//
			if (application.hasApp('notification_center')) {
				this.showNotifications();
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	updateProfilePhoto: function() {
		this.setProfilePhotoUrl(this.getThumbnailUrl());
	},

	updateProfileName: function() {
		this.setProfileName(application.session.user.getName('single'));
	},

	showStorageIndicator: function() {

		// show connection requests dropdown
		//
		this.showChildView('storage_indicator', new StorageIndicatorView({
			model: this.model
		}));
	},

	hideStorageIndicator: function() {
		this.$el.find('.storage-info').hide();
	},

	showAppsBar: function(apps, options) {

		// show spaces toolbar
		//
		this.showChildView('apps', new AppsBarView({

			// options
			//
			apps: apps,
			names: options? options.names : [],
			colors: options? options.colors : [],
			current: options? options.current : null,

			// callbacks
			//
			onselect: (app) => {
				this.getChildView('apps').setCurrent(app);

				// set desktop app
				//
				if (application.desktop) {
					application.desktop.setApp(app);
				}
			}
		}));

		// apply color to app bar icons
		//
		this.setNavStyles(config.branding.header);
	},

	showConnectionRequests: function() {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManager) => {

				// show connection requests dropdown
				//
				this.showChildView('connection_requests', ConnectionManager.getConnectionRequestsDropdownView(this.model));
			}
		});
	},

	showNotifications: function() {
		application.loadAppView('notification_center', {

			// callbacks
			//
			success: (NotificationCenter) => {

				// show notifications dropdown
				//
				this.showChildView('notifications', NotificationCenter.getNotificationsDropdownView(this.model));
			}
		});
	},

	//
	// dialog rendering methods
	//

	showAboutDialog: function() {
		import(
			'../../views/dialogs/alerts/about-dialog-view.js'
		).then((AboutDialogView) => {
			application.show(new AboutDialogView.default());
		});
	},

	showFindConnectionsDialog: function() {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManager) => {
				ConnectionManager.showFindConnectionsDialog();
			}
		});
	},

	showMyAccount: function() {
		application.launch('account_manager', {
			model: this.getChildView('storage_indicator').model,
			nav: 'general',
		});
	},

	showMySettings: function() {
		application.launch('settings_manager', {
			model: this.getChildView('storage_indicator').model,
			nav: 'Storage'
		});
	},

	//
	// mouse event handling methods
	//

	onClickBrand: function() {
		if (window.location.hash == '#home') {
			this.showAboutDialog();
		} else {
			application.navigate('#home', {
				trigger: true
			});
		}
	},

	onClickMyAccount: function() {

		// show current user's account
		//
		this.showMyAccount();
	},

	onClickMyProfile: function() {

		// show current user's profile info
		//
		application.showUser(application.session.user);
	},

	onClickMySettings: function() {
		application.launch('settings_browser');
	},

	onClickMyStorage: function() {
		this.showMySettings();
	},

	onClickFindConnections: function() {
		this.showFindConnectionsDialog();
	},

	onClickSignOut: function() {
		this.signOut({
			confirm: Browser.is_mobile
		});
	}
});