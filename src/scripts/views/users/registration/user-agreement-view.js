/******************************************************************************\
|                                                                              |
|                            user-agreement-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        user registration process.                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import UserAgreementFormView from '../../../views/users/registration/forms/user-agreement-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	regions: {
		form: '.form'
	},

	template: template(`
		<h1><i class="fa fa-pencil-alt"></i>Sign Up</h1>
		
		<ol class="breadcrumb">
			<li><a href="#"><i class="fa fa-home"></i>Home</li></a>
			<li><i class="fa fa-pencil-alt"></i>Sign Up</li>
		</ol>
		
		<div class="content">
			<p>In order to create an account and to use the service, you must first agree to the following terms and conditions. </p>
			<div class="terms-of-use"></div>
			<div class="form"></div>
		</div>
		
		<div class="buttons">
			<button class="next btn btn-primary btn-lg" disabled>
				<i class="fa fa-arrow-right"></i>Next
			</button>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	events: {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .next': 'onClickNext',
		'click .cancel': 'onClickCancel'
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.next').prop('disabled', disabled !== false);
	},

	//
	// navigating methods
	//

	accept: function() {
		this.undelegateEvents();

		// perform callback
		//
		if (this.options && this.options.accept) {
			this.options.accept();
		} else {
			this.showRegistration();
		}
	},

	next: function() {

		// check form validation
		//
		if (this.getChildView('form').isValid()) {
			this.accept();
		} else {
			this.showWarning();
		}
	},

	cancel: function() {

		// go to home view
		//
		application.navigate('', {
			trigger: true
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show form
		//
		this.showTermsOfUse({

			// callbacks
			//
			success: () => {
				this.showUserAgreementFormView();
				this.parent.onLoad();
			}
		});
	},

	showTermsOfUse: function(options) {
		fetch('templates/policies/terms-of-use.tpl').then((response) => response.text()).then((text) => {
			
			// decrease header styles
			//
			text = text.replace(/<h2>/g, '<h3>');
			text = text.replace(/<\\h2>/g, '<\\h3>');
			text = text.replace(/<h1>/g, '<h2>');
			text = text.replace(/<\\h1>/g, '<\\h2>');

			// insert text
			//
			this.$el.find('.terms-of-use').html(text);

			// reapply styles
			//
			if (options && options.success) {
				options.success();
			}
		});
	},

	showUserAgreementFormView: function() {
		this.showChildView('form', new UserAgreementFormView({

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		}));
	},

	showRegistration: function() {
		import(
			'../../../views/users/registration/user-registration-view.js'
		).then((UserRegistrationView) => {

			// show registration page
			//
			application.showPage(new UserRegistrationView.default());
		});
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

	onClickNext: function() {
		this.next();
	},

	onClickCancel: function() {
		this.cancel();
	}
});