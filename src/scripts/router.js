/******************************************************************************\
|                                                                              |
|                                    router.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from './views/base-view.js';

export default Backbone.Router.extend({

	//
	// attributes
	//

	templates: 'templates',

	//
	// route definitions
	//

	routes: {

		// main routes
		//
		'': 'showMain',
		'_=_': 'showRedirect',
		'welcome': 'showWelcome',
		'home(?*query_string)': 'showHome',

		// sign in / sign up routes
		//
		'sign-in': 'showSignIn',
		'sign-up': 'showSignUp',
		
		// user registration routes
		//
		'register': 'showRegister',
		'register/:id': 'showRegisterByInvitation',
		'register/verify-email/:id': 'showVerifyEmail',

		// provider registration routes
		//
		'providers/:provider/register': 'showProviderRegistration',
		'providers/:provider/register/error/:type': 'showProviderRegistrationError',

		// provider authentication routes
		//
		'providers/:provider/sign-in/add': 'showAddProviderSignIn',
		'providers/:provider/sign-in/error/:type': 'showProviderSignInError',

		// email change verification
		//
		'verify-email/:id': 'showVerifyEmailChange',

		// password reset routes
		//
		'reset-password/:key/:id': 'showResetPassword',

		// user routes
		//
		'users/:id': 'showUser',
		'users/:id/:nav': 'showUser',

		// post routes
		//
		'posts/:id': 'showPost',
		'gallery': 'showGallery',
		'search': 'showSearch',

		// link access routes
		//
		'links/restricted': 'showLinkRestricted',
		'links/expired': 'showLinkExpired',
		'links/downloaded(?*query_string)': 'showLinkDownloaded',
		'links/:id/password': 'showEnterLinkPassword',
		'links/:id(?*query_string)': 'showLink',

		// contact routes
		//
		'contact': 'showContact',

		// help routes
		//
		'help': 'showHelp',
		'help/(*address)': 'showHelp',

		// info routes
		//
		'*address': 'showInfo'
	},

	//
	// main route handlers
	//

	showMain: function() {

		// check if user is logged in
		//
		if (application.isSignedIn()) {

			// go to home view
			//
			this.navigate('#home', {
				trigger: true
			});
		} else {

			// show welcome spash screen
			//
			this.showWelcome();
		}
	},

	showRedirect: function() {

		// play login sound
		//
		application.play('login');

		// show main view
		//
		this.showMain();
	},

	showWelcome: function(options) {
		import(
			'./views/welcome/welcome-view.js'
		).then((WelcomeView) => {

			// show welcome page
			//
			application.showPage(new WelcomeView.default(options), {
				nav: 'welcome',
				alignment: 'middle',
				background: 'none'
			});
		});
	},

	showHome: function(options) {

		// check if user is logged in
		//
		if (!application.session.user) {

			// go to welcome view
			//
			this.navigate('#', {
				trigger: true
			});
			return;
		}

		import(
			'./views/apps/desktop/desktop-view.js'
		).then((DesktopView) => {

			// show desktop
			//
			application.show(new DesktopView.default({
				settings: application.settings.desktop
			}), options);

			// show welcome dialog to first time users
			//
			if (config.welcome && application.session.user.get('is_new')) {
				window.setTimeout(() => {
					this.showWelcomeDialog();
				}, config.welcome.delay);
			}
		});
	},

	showSignIn: function() {
		this.showWelcome({
			signIn: true
		});
	},

	showSignUp: function() {
		this.showWelcome({
			signUp: true
		});
	},

	showWelcomeDialog: function() {
		import(
			'./views/welcome/dialogs/welcome-dialog-view.js'
		).then((WelcomeDialogView) => {

			// show welcome dialog
			//
			application.show(new WelcomeDialogView.default());
		});
	},

	//
	// user registration route handlers
	//

	showRegister: function() {
		import(
			'./views/users/registration/user-agreement-view.js'
		).then((UserAgreementView) => {

			// show agree to terms view
			//
			application.showPage(new UserAgreementView.default());
		});
	},

	showRegisterByInvitation: function(userInvitationId) {
		Promise.all([
			import('./models/users/account/user-invitation.js'),
			import('./views/users/registration/register-by-invitation-view.js')
		]).then(([UserInvitation, RegisterByInvitationView]) => {

			// fetch user invitation
			//
			new UserInvitation.default({
				id: userInvitationId
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show user register by invitation page
					//
					application.showPage(new RegisterByInvitationView.default({
						model: model
					}));
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "User invitation not found " + userInvitationId,
						response: response
					});
				}
			});
		});
	},

	showVerifyEmail: function(id) {
		Promise.all([
			import('./models/users/account/email-verification.js'),
			import('./views/users/registration/email/verify-email-view.js')
		]).then(([EmailVerification, VerifyEmailView]) => {

			// fetch email verification
			//
			new EmailVerification.default({
				id: id
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show verify email page
					//
					application.showPage(new VerifyEmailView.default({
						model: model
					}));
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "Email verification not found.  We could not verify this user.",
						response: response
					});
				}
			});
		});
	},

	showVerifyEmailChange: function(id) {
		Promise.all([
			import('./models/users/account/email-verification.js'),
			import('./views/users/registration/email/verify-email-changed-view.js')
		]).then(([EmailVerification, VerifyEmailChangedView]) => {

			// fetch email verification
			//
			new EmailVerification.default({
				id: id
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show verify email changed page
					//
					application.showPage(new VerifyEmailChangedView.default({
						model: model
					}));
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "Email verification not found.  We could not verify this email change.",
						response: response
					});
				}
			});
		});
	},

	//
	// provider registration routes
	//

	showProviderRegistration: function(provider) {
		import(
			'./views/users/registration/providers/provider-registration-view.js'
		).then((ProviderRegistrationView) => {

			// show provider registration page
			//
			application.showPage(new ProviderRegistrationView.default({
				provider: provider
			}));
		});
	},

	showProviderRegistrationError: function(provider, errorType) {
		import(
			'./views/users/registration/providers/provider-registration-error-view.js'
		).then((ProviderRegistrationErrorView) => {

			// show provider registration error page
			//
			application.showPage(new ProviderRegistrationErrorView.default({
				provider: provider,
				type: errorType
			}));
		});
	},

	//
	// provider authentication routes
	//

	showAddProviderSignIn: function(provider, errorType) {
		import(
			'./views/users/accounts/providers/add-provider-sign-in-view.js'
		).then((AddProviderSignInView) => {

			// show add provider sign in page
			//
			application.showPage(new AddProviderSignInView.default({
				provider: provider,
				type: errorType
			}));
		});
	},

	showProviderSignInError: function(provider, errorType) {
		import(
			'./views/users/authentication/providers/provider-sign-in-error-view.js'
		).then((ProviderSignInErrorView) => {

			// show provider sign in error page
			//
			application.showPage(new ProviderSignInErrorView.default({
				provider: provider,
				type: errorType
			}));
		});
	},

	//
	// password reset route handlers
	//

	showResetPassword: function(id, passwordResetNonce) {
		Promise.all([
			import('./models/users/account/password-reset.js'),
			import('./views/users/authentication/reset-password/reset-password-view.js'),
			import('./views/users/authentication/reset-password/invalid-reset-password-view.js')
		]).then(([PasswordReset, ResetPasswordView, InvalidResetPasswordView]) => {

			// fetch password reset
			//
			new PasswordReset.default({
				'id': id,
				'password_reset_nonce': passwordResetNonce
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show reset password page
					//
					application.showPage(new ResetPasswordView.default({
						model: model
					}));
				},

				error: () => {

					// show invalid reset password page
					//
					application.showPage(new InvalidResetPasswordView.default());
				}
			});
		});
	},

	//
	// user route handlers
	//

	showUser: function(username, nav, tab) {

		// fetch and show user
		//
		this.fetchUserByUsername(username, (user) => {
			Promise.all([
				import('./models/preferences/user-preferences.js'),
				import('./views/apps/profile-viewer/mainbar/user-info-view.js'),
				import('./utilities/web/address-bar.js')
			]).then(([UserPreferences, UserInfoView, AddressBar]) => {

				// show user info page
				//
				application.showPage(new UserInfoView.default({
					model: user,

					// options
					//
					nav: nav,
					tab: tab,
					editable: false,
					public: true,
					preferences: UserPreferences.default.create('profile_viewer'),

					// callbacks
					//
					onclicktab: (tab) => {

						// update url to reflect current tab
						//
						AddressBar.default.set('#users/' + username + (tab != 'profile'? '/' + tab : ''), {
							silent: true
						});
					}
				}), {
					nav: user.isCurrent()? 'self' : 'user'
				});

				// load user's system settings
				//
				application.loadUserSettings(user);
			});
		});
	},

	//
	// post route handlers
	//

	showPost: function(id) {
		import(
			'./views/apps/post-viewer/mainbar/post-info-view.js'
		).then((PostInfoView) => {
			this.fetchPost(id, (post) => {

				// show post info page
				//
				application.showPage(new PostInfoView.default({
					model: post
				}));
			});
		});
	},

	showGallery: function() {
		import(
			'./views/apps/post-viewer/mainbar/post-gallery-view.js'
		).then((PostGalleryView) => {

			// show post gallery page
			//
			application.showPage(new PostGalleryView.default(), {
				nav: 'gallery'
			});
		});
	},

	showSearch: function() {
		Promise.all([
			import('./views/apps/search-viewer/mainbar/results/search-page-view.js'),
		]).then(([SearchPageView]) => {

			// show search page
			//
			application.showPage(new SearchPageView.default(), {
				nav: 'search'
			});
		});
	},

	//
	// link access route handlers
	//

	showLink: function(id, queryString) {
		let query = queryString;
		Promise.all([
			import('./models/storage/sharing/link.js'),
			import('./utilities/web/query-string.js')
		]).then(([Link, QueryString]) => {

			// parse query string
			//
			let options = QueryString.default.decode(query);

			// create link
			//
			let link = new Link.default({
				'id': id
			});

			// set theme
			//
			if (options.theme) {
				application.settings.theme.set('day_theme', options.theme);
				application.settings.theme.set('night_theme', options.theme);
			}

			// get link
			//
			link.fetch({

				// callbacks
				//
				success: (model) => {
					this.showValidLink(model, options);
				},

				error: () => {
					this.showInvalidLink();
				}
			});
		});
	},

	showValidLink: function(link, options) {
		if (link.get('restricted')) {
			this.showLinkRestricted(options);
		} else if (link.get('expired')) {
			this.showLinkExpired(options);
		} else if (link.get('protected') && !link.get('authenticated')) {
			this.showEnterLinkPassword(link, options);
		} else {
			this.showLinkTarget(link, options);
		}
	},

	showInvalidLink: function() {
		import(
			'./views/apps/file-browser/sharing/links/status/link-invalid-view.js'
		).then((LinkInvalidView) => {

			// show link invalid page
			//
			application.showPage(new LinkInvalidView.default());
		});
	},

	showLinkRestricted: function() {
		import(
			'./views/apps/file-browser/sharing/links/status/link-restricted-view.js'
		).then((LinkRestrictedView) => {

			// show link restricted page
			//
			application.showPage(new LinkRestrictedView.default());
		});
	},

	showLinkExpired: function() {
		import(
			'./views/apps/file-browser/sharing/links/status/link-expired-view.js'
		).then((LinkExpiredView) => {

			// show link expired page
			//
			application.showPage(new LinkExpiredView.default());
		});
	},

	showFileDownloaded: function(filename) {
		import(
			'./views/apps/file-browser/sharing/links/status/file-downloaded-view.js'
		).then((FileDownloadedView) => {

			// show file downloaded page
			//
			application.showPage(new FileDownloadedView.default({
				filename: filename
			}));
		});
	},

	showFolderDownloaded: function(folderName) {
		import(
			'./views/apps/file-browser/sharing/links/status/folder-downloaded-view.js'
		).then((FolderDownloadedView) => {

			// show folder downloaded page
			//
			application.showPage(new FolderDownloadedView.default({
				folderName: folderName
			}));
		});
	},

	showLinkDownloaded: function(queryString) {
		import(
			'./utilities/web/query-string.js'
		).then((QueryString) => {
			if (QueryString.default.has('file')) {

				// show file downloaded page
				//
				this.showFileDownloaded(QueryString.default.value('file', {
					queryString: queryString
				}));
			} else if (QueryString.default.has('folder')) {

				// show folder downloaded page
				//
				this.showFolderDownloaded(QueryString.default.value('folder', {
					queryString: queryString
				}));
			}
		});
	},
	
	showEnterLinkPassword: function(link) {
		this.showWelcome();
		import(
			'./views/apps/file-browser/sharing/links/dialogs/link-password-dialog-view.js'
		).then((LinkPasswordDialogView) => {

			// show link password dialog
			//
			application.show(new LinkPasswordDialogView.default({
				model: link,

				// callbacks
				//
				success: () => this.showValidLink(link)
			}));
		});
	},

	//
	// link showing methods
	//

	showLinkTarget: function(link, options) {
		Promise.all([
			import('./models/storage/files/file.js'),
			import('./models/storage/directories/directory.js'),
			import('./models/storage/directories/volume.js'),
		]).then(([File, Directory, Volume]) => {
			let target = link.get('target');

			// folder links
			//
			if (target instanceof Directory.default) {
				if (target.isImageAlbum()) {
					this.showGalleryLink(link, options);
				} else if (target.isAudioAlbum()) {
					this.showAlbumLink(link, options);
				} else {
					this.showFolderLink(link, options);
				}

			// volume links
			//
			} else if (target instanceof Volume.default) {
				this.showVolumeLink(link, options);

			// file links
			//
			} else if (target instanceof File.default) {
				if (application.isEmbedded()) {
					this.showFile(link, options);
				} else {
					this.showFileLink(link, options);
				}
			}
		});
	},

	//
	// file methods
	//

	showFile: function(link, options) {
		let extension = link.getFileExtension().toLowerCase();
		let appName = application.settings.associations.get(extension);

		application.launch(appName, {
			model: link.getFile()
		}, options);
	},

	//
	// link viewing methods
	//

	showFileLink: function(link, options) {
		import(
			'./views/apps/file-browser/sharing/links/file-link-view.js'
		).then((FileLinkView) => {

			// show file link page
			//
			application.showPage(new FileLinkView.default({
				model: link
			}), options);
		});
	},

	showFolderLink: function(link, options) {
		import(
			'./views/apps/file-browser/sharing/links/folder-link-view.js'
		).then((FolderLinkView) => {

			// show folder link page
			//
			application.showPage(new FolderLinkView.default({
				model: link
			}), options);
		});
	},

	showGalleryLink: function(link, options) {
		import(
			'./views/apps/file-browser/sharing/links/gallery-link-view.js'
		).then((GalleryLinkView) => {

			// show gallery link page
			//
			application.showPage(new GalleryLinkView.default({
				model: link
			}), options);
		});
	},

	showAlbumLink: function(link, options) {
		import(
			'./views/apps/file-browser/sharing/links/album-link-view.js'
		).then((AlbumLinkView) => {

			// show album link page
			//
			application.showPage(new AlbumLinkView.default({
				model: link
			}), options);
		});
	},

	showVolumeLink: function(link, options) {
		import(
			'./views/apps/file-browser/sharing/links/volume-link-view.js'
		).then((VolumeLinkView) => {

			// show volume link page
			//
			application.showPage(new VolumeLinkView.default({
				model: link
			}), options);
		});
	},

	//
	// contact route methods
	//

	showContact: function() {
		import(
			'./views/contact/contact-view.js'
		).then((ContactView) => {

			// show contact page
			//
			application.showPage(new ContactView.default(), {
				nav: 'contact'
			});
		});
	},

	//
	// help route methods
	//

	showHelp: function(address) {
		import(
			'./views/apps/help-viewer/help-viewer-view.js'
		).then((HelpViewerView) => {
			application.show(new HelpViewerView.default({
				url: '#help' + (address? '/' + address : ''),
				show_header_bar: false,
				show_footer_bar: false
			}), {
				nav: 'help'
			})
		});
	},

	//
	// info route handlers
	//

	showInfo: function(address) {
		this.fetchTemplate(address, (text) => {
			let nav = address.contains('/')? address.split('/')[0] : address;
			if (nav == 'welcome') {
				nav = undefined;
			}

			// show info page
			//
			application.showPage(new BaseView({
				template: template(text)
			}), {
				nav: nav
			});
		});
	},

	//
	// error route handlers
	//

	showNotFound: function(options) {
		import(
			'./views/not-found-view.js'
		).then((NotFoundView) => {

			// show not found page
			//
			application.showPage(new NotFoundView.default(options));
		});
	},

	//
	// utility fetching methods
	//

	fetchTemplate(address, callback) {
		fetch(this.templates + '/' + address + '.tpl').then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.text();
		}).then(template => {
			callback(template);
			return;
		}).catch(error => {

			// show 404 page
			//
			this.showNotFound({
				title: "Page Not Found",
				message: "The page that you are looking for could not be found: " + address,
				error: error
			});
		});
	},

	fetchUser: function(id, done) {
		import(
			'./models/users/user.js'
		).then((User) => {
			new User.default({
				'id': id
			}).fetch({

				// callbacks
				//
				success: (model) => {
					done(model);
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "User not found: " + id,
						response: response				
					});
				}
			});	
		});
	},

	fetchUserByUsername: function(username, done) {
		import(
			'./models/users/user.js'
		).then((User) => {
			new User.default().fetchByUsername(username, {

				// callbacks
				//
				success: (model) => {
					done(model);
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "User not found: " + username,
						response: response				
					});
				}
			});	
		});
	},

	fetchPost: function(id, done) {
		import(
			'./models/topics/post.js'
		).then((Post) => {
			new Post.default({
				'id': id
			}).fetch({

				// callbacks
				//
				success: (model) => {
					done(model);
				},

				error: (model, response) => {

					// show 404 page
					//
					this.showNotFound({
						message: "Post not found: " + id,
						response: response				
					});
				}
			});	
		});
	}
});