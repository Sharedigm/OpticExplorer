/******************************************************************************\
|                                                                              |
|                          user-profile-header-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing the current user's info.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../models/storage/directories/directory.js';
import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="cover photo"<% if (cover_photo_url) { %> style="background-image:url(<%= cover_photo_url %>)"<% } %>>
			<div class="tilted overflow shadowed glossy polaroid profile photo"<% if (profile_photo_url) { %> style="background-image:url(<%= profile_photo_url %>)"<% } %>>
		
				<div class="thumbnail missing"<% if (profile_photo_url) { %> style="visibility:hidden"<% } %>>
					<i class="fa fa-user"></i>
				</div>
		
				<% if (editable) { %>
				<div class="buttons">
		
					<button type="button" class="select-profile-avatar caution btn btn-sm" data-toggle="tooltip" title="Select Profile Avatar">
						<i class="fa fa-smile"></i>
					</button>
		
					<button type="button" class="select-profile-photo caution btn btn-sm" data-toggle="tooltip" title="Select Profile Photo">
						<i class="fa fa-image"></i>
					</button>
		
					<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" title="Clear Profile Photo">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
				<% } %>
			</div>
		
			<% if (editable) { %>
			<div class="buttons">
		
				<button type="button" class="select-cover-photo caution btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Select Desktop Cover Photo">
					<i class="fa fa-desktop"></i>
				</button>
		
				<button type="button" class="select-profile-cover caution btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Select Profile Cover Photo">
					<i class="fa fa-image"></i>
				</button>
		
				<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Clear Cover Photo">
					<i class="fa fa-xmark"></i>
				</button>
			</div>
			<% } %>
		</div>
		
		<% if (editable) { %>
		<div class="alternate buttons">
		
			<button type="button" class="select-profile-avatar caution btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Select Profile Avatar">
				<i class="fa fa-smile"></i>
			</button>
		
			<button type="button" class="select-profile-photo caution btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Select Profile Photo">
				<i class="fa fa-image"></i>
			</button>
		
			<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="Clear Profile Photo">
				<i class="fa fa-xmark"></i>
			</button>
		</div>
		<% } %>
		
		<% if (heading) { %>
		<h2 style="text-align:center">
			<%= heading %>
		
			<% if (editable) { %>
			<button type="button" class="btn btn-sm edit" data-toggle="tooltip" title="Edit">
				<i class="fa fa-pencil-alt"></i>
			</button>
			<% } %>
		</h2>
		<% } %>
	`),

	events: {
		'click .profile > .buttons .select-profile-avatar': 'onClickSelectProfileAvatar',
		'click .profile > .buttons .select-profile-photo': 'onClickSelectProfilePhoto',
		'click .profile > .buttons .delete': 'onClickDeleteProfilePhoto',

		'click .alternate.buttons .select-profile-avatar': 'onClickSelectProfileAvatar',
		'click .alternate.buttons .select-profile-photo': 'onClickSelectProfilePhoto',
		'click .alternate.buttons .delete': 'onClickDeleteProfilePhoto',

		'click .cover > .buttons .select-cover-photo': 'onClickSelectCoverPhoto',
		'click .cover > .buttons .select-profile-cover': 'onClickSelectProfileCover',
		'click .cover > .buttons .delete': 'onClickDeleteCoverPhoto'
	},

	// image attributes
	//
	thumbnailSize: 200,
	defaultProfilePhotoPath: config.apps.profile_viewer.avatars_directory,
	defaultCoverPhotoPath: config.apps.profile_viewer.cover_photos_directory,

	//
	// constructor
	//

	initialize: function() {
		this.profile_photo_path = this.options.profile.get('profile_photo_path');
		this.cover_photo_path = this.options.profile.get('cover_photo_path');
		this.profile_photo_url = this.getProfilePhotoUrl();
		this.cover_photo_url = this.getCoverPhotoUrl();
	},

	//
	// getting methods
	//

	getProfilePhotoUrl: function() {
		if (this.options.profile && application.session.user && this.model == application.session.user) {
			
			// use current user profile
			//
			if (this.options.profile.hasProfilePhoto()) {
				return this.options.profile.getProfilePhoto().getThumbnailUrl({
					min_size: this.thumbnailSize
				});
			}
		} else {

			// use user model
			//
			if (this.model.hasProfilePhoto()) {
				return this.model.getProfilePhotoUrl({
					min_size: this.thumbnailSize
				});
			}
		}
	},

	getCoverPhotoUrl: function() {
		if (this.options.profile && application.session.user && this.model == application.session.user) {
			
			// use current user profile
			//
			if (this.options.profile.hasCoverPhoto()) {
				return this.options.profile.getCoverPhoto().getUrl();
			}
		} else {

			// use user model
			//
			if (this.model.hasCoverPhoto()) {
				return this.model.getProfileCoverPhotoUrl();
			}
		}
	},

	//
	// setting methods
	//

	setProfilePhoto: function(imageFile) {
		this.options.profile.set({
			profile_photo_path: imageFile? imageFile.get('path') : null
		});
		this.showProfilePhoto(imageFile);
	},

	setCoverPhoto: function(imageFile) {
		this.options.profile.set({
			cover_photo_path: imageFile? imageFile.get('path') : null
		});
		this.showCoverPhoto(imageFile);
	},

	setProfilePhotoUrl: function(url) {
		this.$el.find('.profile.photo').css('background-image', url? 'url(' + url + ')' : '');
		if (url) {
			this.$el.find('.thumbnail.missing').css('visibility', 'hidden');
		} else {
			this.$el.find('.thumbnail.missing').css('visibility', '');
		}
	},

	setCoverPhotoUrl: function(url) {
		this.$el.find('.cover.photo').css('background-image', url? 'url(' + url + ')' : '');
	},
	
	reset: function() {

		// reset model
		//
		this.options.profile.set({
			profile_photo_path: this.profile_photo_path
		});
		this.options.profile.set({
			cover_photo_path: this.cover_photo_path
		});

		// reset view
		//
		this.setProfilePhotoUrl(this.profile_photo_url);
		this.setCoverPhotoUrl(this.cover_photo_url);
	},

	//
	// saving methods
	//

	saveProfilePhoto: function(imageFile) {
		this.options.profile.save({
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
	},

	saveCoverPhoto: function(imageFile) {
		this.options.profile.save({
			cover_photo_path: imageFile? imageFile.get('path') : null
		}, {

			// callbacks
			//
			success: () => this.setCoverPhoto(imageFile),

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save profile.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			profile_photo_url: this.getProfilePhotoUrl(),
			cover_photo_url: this.getCoverPhotoUrl(),
			heading: this.options.heading,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	onRender: function() {

		// add header styles
		//
		if (config.branding.page.header2 && config.branding.page.header2.font) {
			application.loadFont(config.branding.page.header2.font);
			this.$el.find('h2').css('font-family', config.fonts[config.branding.page.header2.font]['font-family']);
			if (config.branding.page.header2.size) {
				this.$el.find('h2').css('font-size', config.branding.page.header2.size);
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showProfilePhoto: function(imageFile) {
		this.setProfilePhotoUrl(imageFile? imageFile.getThumbnailUrl({
			min_size: this.thumbnailSize
		}) : undefined);

		// update header
		//
		application.setProfilePhoto(imageFile);
	},

	showCoverPhoto: function(imageFile) {
		this.setCoverPhotoUrl(imageFile? imageFile.getUrl() : undefined);
	},

	showButtons: function() {
		this.$el.find('.buttons').show();
	},

	hideButtons: function() {
		this.$el.find('.buttons').hide();
	},

	//
	// dialog rendering methods
	//

	showOpenProfileAvatarDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/images/open-images-dialog-view.js'
		).then((OpenImagesDialogView) => {

			// show open dialog
			//
			application.show(new OpenImagesDialogView.default({
				model: new Directory({
					path: this.defaultProfilePhotoPath
				}),

				// options
				//
				title: "Select Profile Avatar",

				// callbacks
				//
				onopen: (items) => {
					let photo = items? items[0] : null;
					if (this.options.autosave) {
						this.saveProfilePhoto(photo);
					} else {
						this.setProfilePhoto(photo);	
					}
				}
			}));
		});
	},

	showOpenProfilePhotoDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/images/open-images-dialog-view.js'
		).then((OpenImagesDialogView) => {

			// show open dialog
			//
			application.show(new OpenImagesDialogView.default({
				model: application.getDirectory('Profile'),

				// options
				//
				title: "Select Profile Photo",

				// callbacks
				//
				onopen: (items) => {
					let photo = items? items[0] : null;
					if (this.options.autosave) {
						this.saveProfilePhoto(photo);
					} else {
						this.setProfilePhoto(photo);	
					}
				}
			}));
		});
	},

	showOpenCoverPhotoDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: new Directory({
					path: this.defaultCoverPhotoPath
				}),

				// options
				//
				title: "Select Cover Photo",

				// callbacks
				//
				onopen: (items) => {
					let photo = items? items[0] : null;
					if (this.options.autosave) {
						this.saveCoverPhoto(photo);
					} else {
						this.setCoverPhoto(photo);
					}
				}
			}));
		});
	},

	showOpenProfileCoverDialog: function() {
		import(
			'../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: application.getDirectory('Profile'),

				// options
				//
				title: "Select Cover Photo",

				// callbacks
				//
				onopen: (items) => {
					let photo = items? items[0] : null;
					if (this.options.autosave) {
						this.saveCoverPhoto(photo);
					} else {
						this.setCoverPhoto(photo);
					}
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickSelectProfileAvatar: function() {
		this.showOpenProfileAvatarDialog();
	},

	onClickSelectProfilePhoto: function() {
		this.showOpenProfilePhotoDialog();
	},

	onClickDeleteProfilePhoto: function() {
		if (this.options.autosave) {
			this.saveProfilePhoto(null);
		} else {
			this.setProfilePhoto(null);	
		}
	},

	onClickSelectCoverPhoto: function() {
		this.showOpenCoverPhotoDialog();
	},

	onClickSelectProfileCover: function() {
		this.showOpenProfileCoverDialog();
	},

	onClickDeleteCoverPhoto: function() {
		if (this.options.autosave) {
			this.saveCoverPhoto(null);
		} else {
			this.setCoverPhoto(null);	
		}
	}
});
