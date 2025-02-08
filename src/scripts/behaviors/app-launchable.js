/******************************************************************************\
|                                                                              |
|                              app-launchable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for launching apps.                           |
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
	// launching methods
	//

	launch: function(appName, options, launchOptions) {
		if (application.hasApp(appName)) {

			// load app
			//
			this.loadApp(appName.replace(/-/g, '_'), {

				// callbacks
				//
				success: (AppView) => {
					if (AppView) {
						this.launchApp(appName, AppView, options, launchOptions);
					} else {

						// show alert message dialog
						//
						this.alert({
							title: "App Loading Error",
							message: "App Not Found."
						});
					}
				},

				error: (error) => {

					// show alert message dialog
					//
					this.alert({
						title: "App Loading Error",
						message: error.stack
					});

					// perform callback
					//
					if (launchOptions && launchOptions.error) {
						launchOptions.error(error);
					}
				}
			});
		} else {

			// show alert message dialog
			//
			this.alert({
				title: "Application Error",
				message: appName.replace(/_/g, ' ').toTitleCase() +  " not installed."
			});

			// perform callback
			//
			if (launchOptions && launchOptions.error) {
				launchOptions.error();
			}
		}
	},

	launchApp: function(appName, AppView, options, launchOptions) {

		// open in iframe
		//
		if (this.isEmbedded()) {
			this.openEmbedded(AppView, options, launchOptions);

		// open already open app
		//
		} else if (AppView.current && AppView.current.dialog) {
			this.openExistingApp(AppView, options, launchOptions);

		// open in desktop
		//
		} else if (this.desktop && this.desktop.isOpenableApp(appName, options) &&
			!(launchOptions && launchOptions.new_window)) {
			this.openDesktopApp(appName, AppView, options, launchOptions);

		// open new app dialog
		//
		} else {
			this.openInDialog(appName, AppView, options, launchOptions);
		}
	},

	openExistingApp: function(AppView, options, launchOptions) {

		// activate current app dialog
		//
		this.activateDialog(AppView.current, options);

		// open items
		//
		if (options) {
			this.activateApp(AppView.current, options);
		}

		// perform callback
		//
		if (launchOptions && launchOptions.success) {
			launchOptions.success();
		}
	},

	openDesktopApp: function(appName, AppView, options, launchOptions) {
		if (!this.desktop.isCurrentApp(appName)) {

			// switch to desktop app
			//
			this.openInDesktop(appName, options, launchOptions);
		} else if (options && (options.model || options.collection)) {
			let appView = this.desktop.getAppView(appName);

			// open items in current desktop app
			//
			if (options.collection) {
				appView.openItems(options.collection.models);
			} else {
				appView.openItem(options.model);
			}

			// perform callback
			//
			if (launchOptions && launchOptions.success) {
				launchOptions.success();
			}
		} else {

			// show notify message
			//
			let name = config.apps[appName].name;
			this.notify({
				message: "The " + name + " app is already open on your desktop."
			});

			// perform callback
			//
			if (launchOptions && launchOptions.success) {
				launchOptions.success();
			}
		}
	},

	//
	// activating methods
	//

	activateApp: function(appView, options) {
		if (appView.openItem) {
			appView.openItem(options.model, options);
		} else if (appView.addItem && options.model) {
			appView.addItem(options.model, options);
		} else if (options.collection) {
			appView.openItems(options.collection.models, options);
		}
	},

	//
	// opening methods
	//

	openEmbedded: function(AppView, options, launchOptions) {
		$('#header').remove();

		// display app in app region
		//
		this.show(new AppView(_.extend({}, options, launchOptions, {
			show_sidebar: false,
			show_tabs: false
		})));

		// format for iframe
		//
		$('.header-bar').css({
			'display': 'flex',
			'justify-content': 'center'
		});
		$('.menu-bar').hide();
		$('.footer-bar').hide();
	},

	openInDesktop: function(appName, options, launchOptions) {
		let appView = this.desktop.getAppView(appName);

		// slide to this app
		//
		this.desktop.setApp(appName);

		window.setTimeout(() => {

			// open items
			//
			if (options) {
				this.activateApp(appView, options);
			}

			// perform callback
			//
			if (launchOptions && launchOptions.success) {
				launchOptions.success(appView);
			}
		}, 500);
	},

	openInDialog: function(appName, AppView, options, launchOptions) {

		// create new app
		//
		let appView = new AppView(options);

		// launch app
		//
		appView.launch(launchOptions);

		// perform callback
		//
		if (launchOptions && launchOptions.success) {
			launchOptions.success(appView);
		}
	}
};