/******************************************************************************\
|                                                                              |
|                               registerable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for registering.                              |
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
	// registering methods
	//

	register: function() {
		application.navigate('#register', {
			trigger: true
		});
	},

	//
	// dialog rendering methods
	//

	providerSignUp: function() {
		import(
			'../views/users/registration/providers/dialogs/provider-sign-up-dialog-view.js'
		).then((ProviderSignUpDialogView) => {
			if (!ProviderSignUpDialogView.default.current) {

				// show provider sign up dialog
				//
				application.show(new ProviderSignUpDialogView.default({

					// callbacks
					//
					success: () => this.login()
				}));
			}
		});
	},

	signUp: function() {
		let config = application.session.get('config');
		if (config && config.identity_providers && config.identity_providers.length > 0) {
			this.providerSignUp();
		} else {
			this.register();
		}
	}
};