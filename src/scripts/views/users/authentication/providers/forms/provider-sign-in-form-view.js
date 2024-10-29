/******************************************************************************\
|                                                                              |
|                        provider-sign-in-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to sign in using an identity provider.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SignInFormView from '../../../../../views/users/authentication/forms/sign-in-form-view.js';

export default SignInFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username form-group">
			<label class="control-label"><i class="normal fa fa-user"></i>Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" autocomplete="username">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
				<div class="fineprint"><a class="request-username"><i class="normal fa fa-envelope"></i> Request my username</a></div>
			</div>
		</div>

		<div class="password form-group">
			<label class="control-label"><i class="normal fa fa-key"></i>Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="form-control" maxlength="200" autocomplete="current-password">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Password" data-content="This is the password that you specified when you registered."></i>
					</div>
				</div>
				<div class="fineprint"><a class="reset-password"><i class="normal fa fa-undo"></i> Reset my password</a></div>
			</div>
		</div>
		
		<% if (providers && providers.length > 0) { %>
		<label style="display:block; text-align:center; line-height:1em; margin-bottom:10px">Or</label>
		
		<div class="identity-providers form-group" style="margin:0">
			<label class="control-label">Sign In With</label>
			<div class="buttons">
		
				<% if (providers.includes('Google')) { %>
				<button class="btn colored red" type="button" id="google-sign-in" data-dismiss="modal">
					<i class="fab fa-google"></i>Google
				</button>
				<% } %>
		
				<% if (providers.includes('Facebook')) { %>
				<button class="btn colored blue" type="button" id="facebook-sign-in" data-dismiss="modal">
					<i class="fab fa-facebook"></i>Facebook
				</button>
				<% } %>
		
				<% if (providers.includes('Github')) { %>
				<button class="btn colored violet" type="button" id="github-sign-in" data-dismiss="modal">
					<i class="fab fa-github"></i>GitHub
				</button>
				<% } %>
			</div>
		</div>
		<% } %>
	`),

	events: _.extend({}, SignInFormView.prototype.events, {
		'click #google-sign-in': 'onClickGoogleSignIn',
		'click #facebook-sign-in': 'onClickFacebookSignIn',
		'click #github-sign-in': 'onClickGitHubSignIn'
	}),

	//
	// authenticating methods
	//

	signInWith: function(provider) {

		// redirect to third party sign in
		//
		window.location = config.servers.api + '/providers/' + provider.toLowerCase() + '/login';
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			providers: application.session.get('config').identity_providers
		};
	},

	//
	// mouse event handling methods
	//

	onClickGoogleSignIn: function() {
		this.signInWith('Google');
	},

	onClickFacebookSignIn: function() {
		this.signInWith('Facebook');
	},

	onClickGitHubSignIn: function() {
		this.signInWith('Github');
	}
});
