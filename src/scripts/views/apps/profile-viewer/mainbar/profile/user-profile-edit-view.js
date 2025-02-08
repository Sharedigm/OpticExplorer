/******************************************************************************\
|                                                                              |
|                          user-profile-edit-view.js                           |
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

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="user-profile-panels"></div>
		
		<div class="buttons">
			<button class="save btn btn-primary btn-lg">
				<i class="fa fa-save"></i>Save
			</button>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	regions: {
		panels: '.user-profile-panels'
	},

	events: {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .save': 'onClickSave',
		'click .edit-name': 'onClickEditName',
		'click .select-profile-photo': 'onClickSelectProfilePhoto',
		'click .select-cover-photo': 'onClickSelectCoverPhoto',
		'click .cancel': 'onClickCancel'
	},

	// image attributes
	//
	thumbnailSize: 50,

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return this.model.getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// setting methods
	//

	setHeaderProfilePhoto: function(profilePhoto) {
		this.parent.parent.getChildView('header').setProfilePhoto(profilePhoto);
	},

	setProfilePhoto: function(profilePhoto) {
		this.setHeaderProfilePhoto(profilePhoto);
		this.getChildView('header').setProfilePhoto(profilePhoto);
	},

	setCoverPhoto: function(coverPhoto) {
		this.getChildView('header').setCoverPhoto(coverPhoto);
	},

	//
	// saving methods
	//

	saveProfileInfo: function() {

		// update photos
		//
		if (this.profilePhoto) {
			this.getChildView('header').setProfilePhoto(this.profilePhoto);
		}
		if (this.coverPhoto) {
			this.getChildView('header').setCoverPhoto(this.coverPhoto);
		}

		// get user profile form view
		//
		let form = this.getChildView('panels').getChildView('about').getChildView('content');

		// submit form
		//
		if (!form.submit({

			// callbacks
			//
			success: () => {

				// perform callback
				//
				if (this.options.onsave) {
					this.options.onsave();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save user's profile.",
					response: response
				});
			}
		})) {

			// show form warning
			//
			this.showWarning();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (!this.options.profile) {

			// fetch user profile
			//
			new UserProfile().fetchByUser(this.model, {

				// callbacks
				//
				success: (model) => {
					this.options.profile = model;
					this.showPanels();
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
			this.showPanels();
		}
	},

	showPanels: function() {
		this.showChildView('panels', new UserProfilePanelsView({
			model: this.model,

			// options
			//
			profile: this.options.profile,
			tab: this.options.nav,

			// capabilities
			//
			editable: true
		}));		
	},

	showWarning: function(message) {	
		if (message) {
			this.$el.find('.alert-warning .message').html(message);
		}
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},
	
	onClickSave: function() {
		this.saveProfileInfo();
	},

	onClickEditName: function() {

		// go to edit name view
		//
		application.navigate('users/current/profile/name/edit', {
			trigger: true
		});
	},
	
	onClickSelectProfilePhoto: function() {
		import(
			'../../../../../views/apps/file-browser/dialogs/images/open-images-dialog-view.js'
		).then((OpenImagesDialogView) => {

			// show open dialog
			//
			application.show(new OpenImagesDialogView.default({

				// use home directory
				//
				model: application.getDirectory(),

				// options
				//
				title: "Select Profile Photo",

				// callbacks
				//
				onopen: (selected) => {
					this.profilePhoto = selected? selected[0] : null;
					this.showProfilePhoto(this.profilePhoto);
				}
			}));
		});
	},

	onClickCancel: function() {

		// revert header photo
		//
		if (this.profilePhoto) {
			this.parent.parent.getChildView('header').setProfilePhotoUrl(this.getThumbnailUrl());
		}
		if (this.options.header) {
			this.options.header.hideButtons();
		}

		// perform callback
		//
		if (this.options.oncancel) {
			this.options.oncancel();
		}
	}
});
