/******************************************************************************\
|                                                                              |
|                            welcome-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is shown to first time users.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import VideoFile from '../../../models/storage/media/video-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import UserPreferences from '../../../models/preferences/user-preferences.js';
import Items from '../../../collections/storage/items.js';
import AboutDialogView from '../../../views/dialogs/alerts/about-dialog-view.js';
import GoogleContactsImportable from '../../../views/apps/common/behaviors/importing/google-contacts-importable.js';

export default AboutDialogView.extend(_.extend({}, GoogleContactsImportable, {

	//
	// attributes
	//

	className: 'welcome modal',

	template: template(`
		<div class="modal-dialog">

			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="<%= welcome.icon || 'fa fa-hand-spock' %>"></i>
					</div>
					<div class="title">
						<%= template(welcome.title)() %>
					</div>
				</div>
			</div>

			<div class="modal-content">
				<div class="modal-body">
					<div class="logo">
						<% if (branding.about && branding.about.logo) { %>
						<img src="<%= branding.about.logo.src %>" data-toggle="tooltip" title="<%= branding.about.logo.tooltip %>" />
						<% } else if (branding.welcome.splash.brand.logo) { %>
						<% if (branding.welcome.splash.brand.logo.href) { %>
						<a href="<%= branding.welcome.splash.brand.logo.href %>"><img src="<%= branding.welcome.splash.brand.logo.src %>" data-toggle="tooltip" title="<%= branding.welcome.splash.brand.logo.tooltip %>" /></a>
						<% } else { %>
						<img src="<%= branding.welcome.splash.brand.logo.src %>" data-toggle="tooltip" title="<%= branding.welcome.splash.brand.logo.tooltip %>" />
						<% } %>
						<% } %>
					</div>

					<h1><%= template(welcome.greeting)() %></h1>

					<p class="message">
						<%= template(welcome.message)() %>
					</p>

					<% if (typeof welcome.options != 'undefined') { %>
					<div class="container" style="width:100%; overflow:auto">
						<div class="row" style="text-align:center; margin-top:10px">
							<% let keys = Object.keys(welcome.options); %>
							<% for (let i = 0; i < keys.length; i++) { %>
							<% let key = keys[i]; %>
							<% let option = welcome.options[key]; %>

							<% if (option.enabled) { %>
							<div class="well" style="display:inline-block; width:210px; text-align:center;  margin:5px; padding:10px">
								<p style="display:inline-block; margin:auto; margin-bottom:5px; max-width:200px; height:3em"><%= option.message %></p>
								<button class="<%= key.replace(/_/g, '-') %> btn">
									<i class="<%= option.icon %>"></i>
									<%= option.label %>
								</button>
							</div>
							<% } %>

							<% } %>
						</div>
					</div>
					<% } %>
				</div>

				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-arrow-right"></i>Start Using <%= application.name %>
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, AboutDialogView.prototype.events, {
		'click .view-video': 'onClickViewVideo',
		'click .view-slide-show': 'onClickViewSlideShow',
		'click .set-theme': 'onClickSetTheme',
		'click .set-notifications': 'onClickSetNotifications',
		'click .edit-profile': 'onClickEditProfile',
		'click .import-contacts': 'onClickImportContacts',
		'click .invite-contacts': 'onClickInviteContacts',
		'click .ok': 'onClickOk'
	}),

	//
	// methods
	//

	showImageFile: function(file, options) {
		application.launch('image_viewer', {
			model: file,
			preferences: UserPreferences.create('image_viewer', {
				show_sidebar: false
			}),
			slide_show: true
		}, options);
	},

	showSlideShow: function(path) {

		// load contents of welcome directory
		//
		new Directory({
			path: path
		}).load({

			// callbacks
			//
			success: (directory) => {

				// find first image
				//
				let file = directory.contents.filter(Items.filters.is_image)[0];

				// show image file
				//
				this.showImageFile(file, {
					maximized: true,
					full_screen: true,
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Slide show not found.'
				});
			}
		});
	},

	showVideoFile: function(file, options) {
		application.launch('video_player', {
			model: file,
			preferences: UserPreferences.create('video_player', {
				show_sidebar: false
			}),
			autoplay: true
		}, options);
	},

	showVideo: function(path) {

		// load video file
		//
		new VideoFile({
			path: path
		}).fetch({

			success: (file) => {
				this.showVideoFile(file, {
					maximized: true,
					full_screen: false
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Video not found.'
				});
			}
		});
	},

	setTheme: function() {
		application.launch('theme_picker');
	},

	setNotifications: function() {
		application.launch('settings_manager', {
			nav: 'Notifications'
		});
	},

	importContacts: function() {
		application.launch('contact_editor', {
			import: true
		});
	},

	inviteContacts: function() {
		this.importGoogleContacts((contacts) => {

			// show invite google contacts dialog
			//
			this.showGoogleContactsDialog(contacts);
		});
	},

	editProfile: function() {
		application.launch('profile_viewer');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			welcome: config.welcome,
			defaults: config.defaults,
			branding: config.branding
		};
	},

	//
	// dialog rendering methods
	//

	showGoogleContactsDialog: function(contacts) {
		application.loadAppView('profile_browser', {

			// callbacks
			//
			success: (ProfileBrowserView) => {
				ProfileBrowserView.inviteGoogleContacts(contacts);
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClickViewVideo: function() {
		this.showVideo(config.welcome.options.view_video.path);
	},

	onClickViewSlideShow: function() {
		this.showSlideShow(config.welcome.options.view_slide_show.path);
	},

	onClickSetTheme: function() {
		this.setTheme();
	},

	onClickSetNotifications: function() {
		this.setNotifications();
	},

	onClickEditProfile: function() {
		this.editProfile();
	},

	onClickImportContacts: function() {
		this.importContacts();
	},

	onClickInviteContacts: function() {
		this.inviteContacts();
	},

	onClickOk: function() {
		application.session.user.start();
	}
}));