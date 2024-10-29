/******************************************************************************\
|                                                                              |
|                         add-provider-sign-in-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view shows error information in the event of a linked            |
|        account error.                                                        |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import UserAgreementFormView from '../../../../views/users/registration/forms/user-agreement-form-view.js';
import QueryString from '../../../../utilities/web/query-string.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-link"></i>Add Sign In With <%= provider %></h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-link"></i>Add Sign In With <%= provider %></li>
		</ol>
		
		<div class="content">
			<p>Before you can add a sign-in using this identity provider, you must first agree to the following terms and conditions. </p>

			<h2><i class="fa fa-link"></i>Provider Policy</h2>
			<div class="provider-policy"></div>		
			<div class="form"></div>
		</div>
		
		<div class="buttons">
			<button id="add-sign-in" class="btn btn-lg btn-primary" disabled>
				<i class="fa fa-link"></i>Add Sign In with <%= provider %>
			</button>
			<button id="cancel" class="btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	regions: {
		form: '.form'
	},

	events: {
		'click #add-sign-in': 'onClickAddSignIn',
		'click #cancel': 'onClickCancel'
	},

	//
	// getting methods
	//

	getProviderName: function() {
		if (this.options.provider == 'cilogon') {
			return QueryString.value('name');
		} else {
			return this.options.provider.toTitleCase();
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#add-sign-in').prop('disabled', disabled !== false);
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			provider: this.getProviderName()
		};
	},

	onRender: function() {

		// show form
		//
		this.showProviderPolicy();
		this.showUserAgreementFormView();
	},

	showProviderPolicy: function() {
		fetch('templates/policies/provider-policy.tpl').then((response) => response.text()).then((text) => {
			this.$el.find('.provider-policy').html(text);
		});
	},

	showUserAgreementFormView: function() {
		this.showChildView('form', new UserAgreementFormView({

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddSignIn: function() {

		// add linked account using provider
		//
		window.location = config.servers.api + '/providers/' + this.options.provider + '/login/add' + (QueryString.exists()? '?' + QueryString.get() : '');
	},

	onClickCancel: function() {

		// go to home view
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
	}
});