/******************************************************************************\
|                                                                              |
|                         provider-registration-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view is used to register a new account using a third             |
|        party identity provider.                                              |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAgreementView from '../../../../views/users/registration/user-agreement-view.js';
import QueryString from '../../../../utilities/web/query-string.js';

export default UserAgreementView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-pencil-alt"></i>Sign Up With <%= provider.toTitleCase() %></h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-pencil-alt"></i>Sign Up With <%= provider.toTitleCase() %></li>
		</ol>
		
		<div class="content">
			<p>In order to create an account and to use the service, you must first agree to the following terms and conditions. </p>
		
			<div class="provider-policy"></div>
			<div class="terms-of-use"></div>
			<div class="form"></div>
		</div>

		<div class="buttons">
			<button class="next btn btn-lg btn-primary" disabled>
				<i class="fa fa-arrow-right"></i>Sign Up with <%= provider.toTitleCase() %>
			</button>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	//
	// getting methods
	//

	getProviderName: function() {
		if (this.options.provider == 'cilogon') {
			return decodeURI(QueryString.value('name'));
		} else {
			return this.options.provider.toTitleCase();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			provider: this.getProviderName(),
		};
	},

	onRender: function() {
		this.showProviderPolicy();
		this.showTermsOfUse();
		this.showUserAgreementFormView();
	},

	showProviderPolicy: function() {
		fetch('templates/policies/provider-policy.tpl').then((response) => response.text()).then((text) => {
			text = text.replace(/<h1/g, '<h2');
			this.$el.find('.provider-policy').html(text);
		});
	},

	showTermsOfUse: function() {
		fetch('templates/policies/terms-of-use.tpl').then((response) => response.text()).then((text) => {
			text = text.replace(/<h1/g, '<h2');
			this.$el.find('.terms-of-use').html(text);
		});
	},

	//
	// mouse event handling methods
	//

	onClickNext: function() {

		// check validation
		//
		if (this.getChildView('form').isValid()) {

			// sign up using provider
			//
			window.location = config.servers.api + '/providers/' + this.options.provider + '/register' + (QueryString.exists()? '?' + QueryString.get() : '');
		} else {

			// display error message
			//
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go to home view
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
	}
});