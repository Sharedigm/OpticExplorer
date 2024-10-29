/******************************************************************************\
|                                                                              |
|                        register-by-invitation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used for registration by invitation.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserProfile from '../../../models/users/profile/user-profile.js';
import BaseView from '../../../views/base-view.js';
import UserProfileHeaderView from '../../../views/users/profile/user-profile-header-view.js';
import UserAgreementFormView from '../../../views/users/registration/forms/user-agreement-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	regions: {
		header: '.user-profile-header',
		form: '.user-agreement-form'
	},

	template: template(`
		<h1><i class="fa fa-envelope"></i>Register by Invitation</h1>
		
		<ol class="breadcrumb">
			<li><i class="fa fa-envelope"></i>Register by Invitation</li>
		</ol>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<div class="terms-of-use"></div>
			<div class="user-agreement-form">
				<br />
				<% if (message) { %>
				<p><%= inviter.getName().toTitleCase() %> has invited you to connect and sends along the following message:</p>
				<div class="well"><%= message %></div>
				<% } else { %>
				<p><%= inviter.getName().toTitleCase() %> has invited you to connect.</p>
				<% } %>
			</div>
		</div>
		
		<div class="buttons">
			<button class="next btn btn-primary btn-lg">
				<i class="fa fa-arrow-right"></i>Next
			</button>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	events: {
		'click .next': 'onClickNext',
		'click .cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// fetch user profile
		//
		new UserProfile().fetchByUser(this.model.get('inviter'), {

			// callbacks
			//
			success: (model) => {

				// show child view
				//
				this.showUserProfileHeader(model);
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
	},

	showUserProfileHeader: function(profile) {

		// show user profile header
		//
		this.showChildView('header', new UserProfileHeaderView({
			model: this.model.get('inviter'),
			profile: profile,
			heading: 'From' + '<hr />' + this.model.get('inviter').get('full_name')
		}));	
	},

	showTermsOfUse: function() {
		fetch('templates/policies/terms-of-use.tpl').then((response) => response.text()).then((text) => {
			this.$el.find('.terms-of-use').html(text);
		});
	},

	showUserAgreementForm: function() {
		this.showChildView('form', new UserAgreementFormView({

			// callbacks
			//
			onvalidate: (isValid) => {
				this.$el.find('.next').prop('disabled', !isValid);
			}
		}));
	},

	showRegistration: function() {
		import(
			'../../../views/users/registration/user-registration-view.js'
		).then((UserRegistrationView) => {

			// show registration page
			//
			application.showPage(new UserRegistrationView.default({
				user_invitation: this.model
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickNext: function() {
		if (!this.AUPshown) {
			this.getChildView('header').$el.hide();
			this.$el.find('.next').prop('disabled', true);	
			this.showTermsOfUse();
			this.showUserAgreementForm();
			this.AUPshown = true;
		} else {
			this.showRegistration();
		}
	},

	onClickCancel: function() {

		// go to home view
		//
		application.navigate('', {
			trigger: true
		});
	}
});
