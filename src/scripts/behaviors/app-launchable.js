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
		this.loadAppView(appName.replace(/-/g, '_'), (AppView) => {

			// check if app was found
			//
			if (!AppView) {

				// show alert message dialog
				//
				this.alert({
					message: "Application " + appName +  " not found."
				});

				// perform callback
				//
				if (launchOptions && launchOptions.error) {
					launchOptions.error();
				}

			// launch app
			//
			} else {
				this.launchApp(appName, AppView, options, launchOptions);
			}
		});
	},

	launchApp(appName, AppView, options, launchOptions) {
		if (this.isEmbedded()) {

			// show app formatted for iframe
			//
			this.openEmbedded(AppView, options, launchOptions);

		// check if app is already open
		//
		} else if (AppView.current && AppView.current.dialog) {

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

		// open in desktop
		//
		} else if (this.desktop && this.desktop.isOpenableApp(appName, options) &&
			!(launchOptions && launchOptions.new_window)) {

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

		// open new app dialog
		//
		} else {
			this.openInDialog(appName, AppView, options, launchOptions);
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

		// add full screen option
		//
		if (config.apps && config.apps[appName]) {
			let preferences = config.apps[appName].preferences;
			if (preferences && preferences.full_screen) {
				launchOptions = _.extend({
					maximized: true,
					full_screen: true
				}, launchOptions);
			}
		}

		let appView = new AppView(options).launch(launchOptions);

		// perform callback
		//
		if (launchOptions && launchOptions.success) {
			launchOptions.success(appView);
		}
	}
};