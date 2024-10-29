/******************************************************************************\
|                                                                              |
|                             authenticatable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for logging in.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// authenticating methods
	//

	login: function(done) {

		// get user information
		//
		this.session.getUser('current', {

			// callbacks
			//
			success: () => {

				// call event handler
				//
				this.onSignIn(done);
			}
		});
	},

	logout: function() {

		// end session
		//
		this.session.logout({

			// callbacks
			//
			success: () => {

				// call event handler
				//
				this.onSignOut();
			},

			error: (jqxhr, textstatus, errorThrown) => {

				// show error message
				//
				this.error({
					message: "Could not log out: " + errorThrown + "."
				});
			}
		});
	},

	//
	// dialog rendering methods
	//

	localSignIn: function(done) {
		import(
			'../views/users/authentication/dialogs/sign-in-dialog-view.js'
		).then((SignInDialogView) => {
			if (!SignInDialogView.default.current) {

				// show sign in dialog
				//
				this.show(new SignInDialogView.default({

					// callbacks
					//
					success: () => this.login(done)
				}));
			}
		});
	},

	providerSignIn: function(done) {
		import(
			'../views/users/authentication/providers/dialogs/provider-sign-in-dialog-view.js'
		).then((ProviderSignInDialogView) => {

			// show sign in dialog
			//
			this.show(new ProviderSignInDialogView.default({

				// callbacks
				//
				success: () => this.login(done)
			}));
		});
	},

	signIn: function(done) {
		let config = this.session.get('config');
		if (config && config.identity_providers && config.identity_providers.length > 0) {
			this.providerSignIn(done);
		} else {
			this.localSignIn(done);
		}
	},

	//
	// event handling methods
	//

	onSignIn: function(done) {

		// set current user
		//
		this.setUser(application.session.user, () => {

			// go to home view
			//
			this.navigate('#home', {
				trigger: true
			});

			// play login sound
			//
			this.play('login');

			// perform callback
			//
			if (done) {
				done();
			}
		});
	},

	onSignOut: function() {

		// update header
		//
		if (this.getView().options.show_header) {
			this.getView().showHeader();
		}

		// go to welcome view
		//
		this.navigate('#', {
			trigger: true
		});

		// play logout sound
		//
		this.play('logout');

		// reset application
		//
		this.reset();
	}
};