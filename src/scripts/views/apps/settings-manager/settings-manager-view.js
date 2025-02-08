/******************************************************************************\
|                                                                              |
|                           settings-manager-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app for viewing and editing settings.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAccount from '../../../models/users/account/user-account.js';
import UserPreferences from '../../../models/preferences/user-preferences.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import HeaderBarView from '../../../views/apps/settings-manager/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/settings-manager/sidebar/sidebar-view.js';
import FooterBarView from '../../../views/apps/settings-manager/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/settings-manager/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend( {

	//
	// attributes
	//

	name: 'settings_manager',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (this.options.app) {
			this.options.prefs = this.options.app.preferences;
		}

		// make a copy of settings
		//
		this.settings = {};
		this.settings.system = application.settings.system.clone();
		this.settings.desktop = application.settings.desktop.clone();
		this.settings.notifications = application.settings.notifications.clone();
		this.settings.sound = application.settings.sound.clone();

		// listen to models for changes
		//
		this.listenTo(application.settings.system, 'change', this.onChangeSettings, this);
		this.listenTo(application.settings.desktop, 'change', this.onChangeSettings, this);
		this.listenTo(application.settings.notifications, 'change', this.onChangeSettings, this);
		this.listenTo(application.settings.sound, 'change', this.onChangeSettings, this);

		// set attributes
		//
		this.model = new UserAccount();
		this.collection = application.getVisibleApps();
		this.category = this.options.app? 'preferences' : 'settings';
		this.changed = false;

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// attribute methods
	//

	icon: function() {
		return this.category == 'settings'? 'fa fa-cog' : 'fa fa-snowflake';
	},

	title: function() {
		return this.hasSelected()? this.getSelecctedModel().getName() : this.getDefaultName();
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	numApps: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getDefaultName: function() {
		switch (this.category) {
			case 'settings':
				return (this.options.nav || 'Account') + ' Settings';
			case 'preferences':
				return this.options.app.getName() + ' Preferences';
		}
	},

	getSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getSelected();
		} else {
			return [];
		}
	},

	getAppDefaults: function(key, value) {
		let keys = Object.keys(config.apps);
		for (let i = 0; i < keys.length; i++) {
			let app = config.apps[keys[i]];
			if (app[key] == value) {
				return app;
			}
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	getSelectedChildView: function(which) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getSelectedChildView(which);
		}
	},

	//
	// setting methods
	//

	setSelected: function(name, category) {

		// set attributes
		//
		this.title = name;
		this.category = category;

		// close settings
		//
		this.closeSettings(() => {
			this.changed = false;

			switch (category) {
				case 'settings':
					this.showSettings(name);
					break;
				case 'preferences':
					this.showPreferences(name);
					break;
			}
		});

		this.onChange();
	},

	setSelectedItem: function(item) {
		this.setSelected(item.model.get('name'), this.category);
	},

	//
	// navigating methods
	//

	select: function(which) {
		this.setSelectedItem(this.getSelectedChildView(which, {
			wraparound: true
		}));
	},

	setSelectedIndex: function(index) {
		this.getChildView('sidebar').setSelectedIndex(index);
	},

	//
	// ajax methods
	//

	fetchUserAccount: function(callback) {
		this.model.fetchByUser(application.session.user, {

			// callbacks
			//
			success: (model) => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				callback(model);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's account.",
					response: response
				});
			}
		});
	},

	//
	// saving methods
	//

	save: function(options) {
		if (!this.options.prefs) {
			this.saveSettings(options);
		} else {
			this.savePreferences(options);
		}
	},

	saveSettings: function(options) {
		let count = 0;
		let number = Object.keys(application.settings).length;

		function saveSetting(manager, setting) {
			setting.save(undefined, {

				// callbacks
				//
				success: () => {
					count++;
					if (count == number) {

						// reset changed flag
						//
						manager.changed = false;

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					}
				}
			});
		}

		// save settings
		//
		for (let key in application.settings) {
			if (application.settings[key]) {
				saveSetting(this, application.settings[key]);
			} else {
				count++;
			}
		}
	},

	clearAll: function() {

		// confirm delete
		//
		application.confirm({
			icon: '<i class="fa fa-trash-alt"></i>',
			title: "Delete",
			message: "Are you sure you want to clear your preferences?",

			// callbacks
			//
			accept: () => {
				this.clearPreferences({

					// callbacks
					//
					success: () => {

						// notify user
						//
						application.alert({
							message: "Your preferences have been cleared."
						});
					}
				});
			}
		});
	},

	savePreferences: function(options) {

		// save preferences
		//
		if (this.options.prefs) {
			this.options.prefs.save(undefined, {

				// callbacks
				//
				success: () => {

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				}
			});
		}
	},

	clearPreferences: function(options) {

		// clear preferences
		//
		if (this.options.prefs) {
			this.options.prefs.delete({

				// callbacks
				//
				success: () => {
					this.options.prefs.clear();

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				}
			});
		}
	},

	//
	// reverting methods
	//

	revertSettings: function() {

		// revert to previous settings
		//
		for (let key in this.settings) {
			if (this.settings[key]) {
				application.settings[key].set(this.settings[key].attributes);
				if (application.settings[key].apply) {
					application.settings[key].apply();
				}
			}
		}
	},
	
	revert: function() {
		if (this.options.app && this.options.app.setOptions) {

			// revert app to previous preferences
			//
			this.options.app.setOptions(this.getChildView('content').getOriginalValues());
		} else if (!this.prefs) {

			// revert to previous settings
			//
			this.revertSettings();
		}
	},

	//
	// closing methods
	//

	close: function() {

		// close current file
		//
		this.closeSettings(() => {

			// update desktop
			//
			if (application.settings.desktop.hasChanged()) {
				application.desktop.showDesktopSpaces();
			}

			// close parent dialog
			//
			this.dialog.close();
		});
	},
	
	closeSettings: function(done) {
		if (this.changed) {

			// show prompt
			//
			application.prompt({
				icon: '<i class="fa fa-save"></i>',
				title: "Save Settings",
				message: "Settings have been changed. Would you like to keep your new settings?",

				// callbacks
				//
				accept: () => {
					this.save({

						// callbacks
						//
						success: () => {

							// perform callback
							//
							if (done) {
								done(true);
							}
						}
					});
				},

				decline: () => {
					this.revert();

					// perform callback
					//
					if (done) {
						done(false);
					}
				}
			});
		} else {

			// perform callback
			//
			if (done) {
				done(false);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// show user settings
		//
		this.fetchUserAccount(() => {

			// fetch user account
			//
			if (this.options.app) {
				this.setSelected(this.options.app.getName(), 'preferences');
			} else {
				this.setSelected(this.options.nav || 'Account', 'settings');
			}

			// activate menus
			//
			this.onLoad();
		});

		// set loading message
		//
		if (!this.options.app) {
			this.showMessage("Loading settings...", {
				icon: '<i class="fa fa-spin fa-cog"></i>',
			});
		} else {
			this.showMessage("Loading preferences...", {
				icon: '<i class="fa fa-spin fa-snowflake"></i>',
			});				
		}
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			collection: this.collection,

			// options
			//
			app: this.options.app,
			nav: this.options.nav,
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onchange: (name, category) => this.setSelected(name, category)
		});
	},

	showSettings: function(name) {

		// reset prefs copy
		//
		this.prefs = null;

		// set title
		//
		this.setTitle(name + ' Settings', 'fa fa-cog');

		// show child view
		//
		//
		this.showSettingsForm(name);

		// set sidebar selection
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').setSelected(name, 'settings');
		}
	},

	loadSettings: function(name, done) {
		switch (name.toLowerCase()) {

			case 'account':
				import(
					'../../../views/apps/settings-manager/forms/settings/account-settings-form-view.js'
				).then((AccountSettingsFormView) => {
					done(AccountSettingsFormView.default);
				});	
				break;

			case 'desktop':
				import(
					'../../../views/apps/settings-manager/forms/settings/desktop-settings-form-view.js'
				).then((DesktopSettingsFormView) => {
					done(DesktopSettingsFormView.default);
				});	
				break;

			case 'notifications':
				import(
					'../../../views/apps/settings-manager/forms/settings/notifications-settings-form-view.js'
				).then((NotificationsSettingsFormView) => {
					done(NotificationsSettingsFormView.default);
				});	
				break;

			case 'sign-ins':
				import(
					'../../../views/apps/settings-manager/forms/settings/sign-ins-settings-form-view.js'
				).then((SignInsSettingsFormView) => {
					done(SignInsSettingsFormView.default);
				});	
				break;

			case 'sound':
				import(
					'../../../views/apps/settings-manager/forms/settings/sound-settings-form-view.js'
				).then((SoundSettingsFormView) => {
					done(SoundSettingsFormView.default);
				});	
				break;

			case 'storage':
				import(
					'../../../views/apps/settings-manager/forms/settings/storage-settings-form-view.js'
				).then((StorageSettingsFormView) => {
					done(StorageSettingsFormView.default);
				});	
				break;
		}
	},

	showSettingsForm: function(name) {
		this.loadSettings(name, (SettingsFormView) => {

			// show child view
			//
			this.showChildView('content', new SettingsFormView({
				model: this.model,
				settings: this.settings,

				// callbacks
				//
				onchange: (key, value) => this.onChangeSettings(key, value)
			}));
		});
	},

	showPreferences: function(name) {
		let appDefaults = this.getAppDefaults('name', name);

		// load new user preferences
		//			
		this.options.prefs = UserPreferences.create(appDefaults.id);
		this.options.prefs.load({

			// callbacks
			//
			success: (model) => {
				this.showPreferencesForm(appDefaults.app.replace(/-/g, '_'), model);
			},

			error: () => {

				// show error message
				//
				application.error({
					message: "Could not fetch application preferences."
				});
			}
		});

		// set title
		//
		this.setTitle(appDefaults.name + ' Preferences', 'fa fa-snowflake');

		// set sidebar selection
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').setSelected(appDefaults.name, 'preferences');
		}
	},

	showPreferencesForm: function(app, preferences) {
		application.loadApp(app, {

			// callbacks
			//
			success: (AppView) => {

				// check for preferences form
				//
				if (!AppView.getPreferencesFormView) {
					application.alert({
						message: 'Preferences form view not found.'
					});
					return;
				}

				// make a copy of preferences
				//
				this.prefs = this.options.prefs.clone();

				// show child view
				//
				this.showChildView('content', AppView.getPreferencesFormView({
					model: preferences,

					// callbacks
					//
					onchange: (key, value) => this.onChangePreferences(key, value)
				}));
			}
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/settings-manager/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}
	},

	onChangeSettings: function() {
		this.changed = true;
	},

	onChangePreferences: function(key, value) {
		if (this.options.app && this.options.app.setOption) {
			this.options.app.setOption(key, value);
		}
		if (this.options.prefs) {
			this.options.prefs.set(key, value);
		}
		this.changed = true;
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// clear static attributes
		//
		this.constructor.current = null;
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});