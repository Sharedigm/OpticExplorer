/******************************************************************************\
|                                                                              |
|                        add-provider-sign-in-dialog-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
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
						<i class="fa fa-plus"></i>
					</div>
					<div class="title">
						Add Provider Sign In
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>If you already have an account with one of the identity providers listed below, then you can add the ability to sign in using your credentials from one of these providers. </p>
		
					<form class="form-horizontal">
						<div class="identity-providers form-group">
							<label class="control-label">Add Sign In With</label>
							
							<% if (providers.length > 0) { %>
							<div class="buttons">
		
								<% if (providers.includes('Google') && !existing_providers.includes('Google')) { %>
								<button class="btn colored red" type="button" id="google-sign-in" data-dismiss="modal">
									<i class="fab fa-google"></i>Google
								</button>
								<% } %>
		
								<% if (providers.includes('Facebook') && !existing_providers.includes('Facebook')) { %>
								<button class="btn colored blue" type="button" id="facebook-sign-in" data-dismiss="modal">
									<i class="fab fa-facebook"></i>Facebook
								</button>
								<% } %>
		
								<% if (providers.includes('Github') && !existing_providers.includes('Github')) { %>
								<button class="btn colored violet" type="button" id="github-sign-in" data-dismiss="modal">
									<i class="fab fa-github"></i>GitHub
								</button>
								<% } %>
							</div>
							<% } else { %>
							<p class="form-control-static">No more sign in providers are available. </p>
							<% } %>
						</div>
					</form>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button id="cancel" class="btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click #google-sign-in': 'onClickGoogleSignIn',
		'click #facebook-sign-in': 'onClickFacebookSignIn',
		'click #github-sign-in': 'onClickGithubSignIn'
	},

	//
	// querying methods
	//

	hasProviderNamed: function(name) {
		return this.collection.hasItemNamed(name);
	},

	getExistingProviders: function() {
		let providers = [];

		if (this.hasProviderNamed('Google')) {
			providers.push('Google');
		}
		if (this.hasProviderNamed('Facebook')) {
			providers.push('Facebook');
		}
		if (this.hasProviderNamed('GitHub')) {
			providers.push('Github');
		}

		return providers;
	},

	//
	// adding methods
	//

	addSignIn: function(provider) {

		/*
		// show add sign in view
		//
		Backbone.history.navigate('#providers/github/sign-in/add', {
			trigger: true
		});
		*/

		// add linked account using provider
		//
		window.location = config.servers.api + '/providers/' + provider.toLowerCase() + '/login/add';
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			providers: application.session.get('config').identity_providers || [],
			existing_providers: this.getExistingProviders()
		};
	},

	//
	// mouse event handling methods
	//

	onClickGoogleSignIn: function() {
		this.addSignIn('google');
	},

	onClickFacebookSignIn: function() {
		this.addSignIn('facebook');
	},

	onClickGithubSignIn: function() {
		this.addSignIn('github');
	}
});
