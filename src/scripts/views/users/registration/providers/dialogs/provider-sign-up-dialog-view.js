/******************************************************************************\
|                                                                              |
|                        provider-sign-up-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog that is used to sign up using an identity       |
|        provider.                                                             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../views/dialogs/modal-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-pencil-alt"></i>
					</div>
					<div class="title">
						Sign Up
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>You can create a new account by filling out a simple registration form by clicking the "Sign Up" button below.<p>
		
					<% if (providers && providers.length > 0) { %>
					<label style="display:block; text-align:center">Or</label>
					
					<p>If you aleady have an account with one of the identity providers listed below, then you can create a new account using your credentials from one of these providers. </p>
		
					<form class="form-horizontal">
						<div class="identity-providers form-group">
							<label class="control-label">Sign Up With</label>
							<div class="buttons">
		
								<% if (providers.includes('Google')) { %>
								<button class="btn colored red" type="button" id="google-sign-up" data-dismiss="modal">
									<i class="fab fa-google"></i>Google
								</button>
								<% } %>
		
								<% if (providers.includes('Facebook')) { %>
								<button class="btn colored blue" type="button" id="facebook-sign-up" data-dismiss="modal">
									<i class="fab fa-facebook"></i>Facebook
								</button>
								<% } %>
		
								<% if (providers.includes('Github')) { %>
								<button class="btn colored violet" type="button" id="github-sign-up" data-dismiss="modal">
									<i class="fab fa-github"></i>GitHub
								</button>
								<% } %>
							</div>
						</div>
					</form>
					<% } %>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button id="sign-up" class="btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>Sign Up
						</button>
						<button id="cancel" class="btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click #google-sign-up': 'onClickGoogleSignUp',
		'click #facebook-sign-up': 'onClickFacebookSignUp',
		'click #github-sign-up': 'onClickGitHubSignUp',
		'click #sign-up': 'onClickSignUp',
		'keypress': 'onKeyPress'
	},

	//
	// rendering methods
	//

	templateContext: function() {	
		return {
			providers:  application.session.get('config').identity_providers
		};
	},

	//
	// mouse event handling methods
	//

	onClickGoogleSignUp: function() {
		Backbone.history.navigate('#providers/google/register', {
			trigger: true
		});
	},

	onClickFacebookSignUp: function() {
		Backbone.history.navigate('#providers/facebook/register', {
			trigger: true
		});
	},

	onClickGitHubSignUp: function() {
		Backbone.history.navigate('#providers/github/register', {
			trigger: true
		});
	},

	onClickSignUp: function() {
		Backbone.history.navigate('#register', {
			trigger: true
		});
	},

	onKeyPress: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			this.onClickOk();
		}
	}
});
