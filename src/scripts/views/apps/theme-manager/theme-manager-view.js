/******************************************************************************\
|                                                                              |
|                            theme-manager-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app for viewing and editing themes.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import UserSettings from '../../../models/settings/user-settings.js';
import DesktopSettings from '../../../models/settings/desktop-settings.js';
import ThemeSettings from '../../../models/settings/theme-settings.js';
import ControlSettings from '../../../models/settings/control-settings.js';
import DialogSettings from '../../../models/settings/dialog-settings.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import HeaderBarView from '../../../views/apps/theme-manager/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/theme-manager/sidebar/sidebar-view.js';
import ThemeSettingsView from '../../../views/apps/theme-manager/mainbar/theme-settings-view.js';
import FooterBarView from '../../../views/apps/theme-manager/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/theme-manager/forms/preferences/preferences-form-view.js';
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend({

	//
	// attributes
	//

	name: 'theme_manager',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.initSettings();
		this.directory = new Directory({
			path: this.preferences.get('home_directory')
		});

		// set static attributes
		//
		this.constructor.current = this;
	},

	initSettings: function() {

		// set optional parameter defaults
		//
		this.options.settings = {
			general: application.settings.theme,
			desktop: application.settings.desktop,
			controls: application.settings.controls,
			dialogs: application.settings.dialogs
		};

		// make a copy of settings
		//
		this.settings = this.cloneSettings(this.options.settings);
	},

	//
	// converting methods
	//

	toString: function() {
		return JSON.stringify(this.getData(), null, "\t");
	},

	//
	// cloning methods
	//

	cloneSettings: function(settings) {
		let clone = {};
		clone.general = settings.general.clone();
		clone.desktop = settings.desktop.clone();
		clone.controls = settings.controls.clone();
		clone.dialogs = settings.dialogs.clone();
		return clone;
	},

	//
	// querying methods
	//

	hasChanged: function() {
		return (
			!this.settings.general.equals(this.options.settings.general) ||
			!this.settings.desktop.equals(this.options.settings.desktop) ||
			!this.settings.controls.equals(this.options.settings.controls) ||
			!this.settings.dialogs.equals(this.options.settings.dialogs));
	},

	hasSelected: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelected();
		}
	},

	//
	// counting methods
	//

	numThemes: function() {
		return this.directory.numItems((model) => {
			return application.settings.associations.getFileExtensions('theme_manager').contains(model.getFileExtension());
		});
	},

	//
	// getting methods
	//

	getHomeDirectory: function() {
		return application.getDirectory('Profile');
	},

	getDefaultDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return application.getDirectory(this.preferences.get('home_directory'));
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getDefaultSettings: function() {
		return {
			general: new ThemeSettings(),
			desktop: new DesktopSettings(),
			controls: new ControlSettings(),
			dialogs: new DialogSettings()	
		}
	},

	getFileName: function() {
		return File.defaultName + '.thme';
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// theme getting methods
	//

	getThemes: function() {
		let extensions = application.settings.associations.getFileExtensions('theme_manager');
		return this.directory.contents.filter((model) => {
			return model instanceof Directory && !model.isHidden() || 
				extensions.contains(model.getFileExtension());
		});
	},

	getThemeIndex: function(which, options) {
		if (this.directory.contents) {
			let themeIndex;

			switch (which) {
				case 'first':
					return 0;
				case 'prev': {
					themeIndex = this.getThemeIndex();
					if (themeIndex > 0) {
						return themeIndex - 1;
					} else if (options && options.wraparound) {
						return this.numThemes() - 1;
					} else {
						return 0;
					}
				}
				case 'next': {
					themeIndex = this.getThemeIndex();
					if (themeIndex < this.numThemes() - 1) {
						return themeIndex + 1;
					} else if (options && options.wraparound) {
						return 0;
					} else {
						return this.numThemes() - 1;
					}
				}
				case 'last':
					return this.numThemes() - 1;
				default:
					return this.directory.contents.indexOf(this.model) - 1;
			}
		}
	},

	//
	// data getting methods
	//

	getGeneralData: function() {
		return application.settings.theme.attributes;
	},

	getDesktopData: function() {
		let attributes = application.settings.desktop.attributes;
		return {
			desktop_theme: attributes.desktop_theme,
			launcher_style: attributes.launcher_style,
			background_image: attributes.background_image,
			background_size: attributes.background_size,
			background_color: attributes.background_color,
			background_repeats: attributes.background_repeats,
			show_led_time: attributes.show_led_time
		};
	},

	getControlsData: function() {
		return application.settings.controls.attributes;
	},

	getDialogsData: function() {
		return application.settings.dialogs.attributes;
	},

	getData: function() {
		return {
			general: this.getGeneralData(),
			desktop: this.getDesktopData(),
			controls: this.getControlsData(),
			dialogs: this.getDialogsData()
		};
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// set attributes
		//
		this.model = model;

		// set selected item in sidebar
		//
		this.setSelected(this.model);
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set sidebar
		//
		this.getChildView('sidebar').getChildView('themes').setDirectory(directory);
	},

	setSelected: function(model) {

		// select sidebar item
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').setSelected(model, {
				silent: true
			});
		}
	},

	setThemeIndex: function(index, options) {

		// clamp to range
		//
		if (index < 1) {
			index = 0;
		}
		if (index > this.directory.contents.length - 1) {
			index = this.directory.contents.length - 1;
		}

		// load theme
		//
		if (this.directory.contents) {
			let theme = this.getThemes()[index];
			if (theme) {
				this.loadFile(theme, options);
			}
		}
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {
		this.getChildView('header nav').pushDirectory(directory);
	},
	
	//
	// selecting methods
	//

	select: function(which) {
		this.setThemeIndex(this.getThemeIndex(which, {
			wraparound: true
		}));
	},

	//
	// file opening methods
	//

	openTheme: function(options) {

		// close current file
		//
		this.closeFile(() => {

			// open new file
			//
			this.showOpenDialog(options && options.local? this.getHomeDirectory() : this.getDefaultDirectory());
		});
	},
	
	openItem: function(item, options) {

		// set attributes
		//
		this.model = item;

		// load item
		//
		if (this.model) {
			this.loadFile(this.model, options);
		}
	},

	loadFile: function(model, options) {

		// set attributes
		//
		this.setModel(model);

		// read text file contents
		//
		this.constructor.loadTheme(model, {

			// callbacks
			//
			success: () => {
				this.onLoad();

				// perform callback
				//
				if (options && options.success) {
					options.success(this.model);
				}
			}
		});
	},

	//
	// file saving methods
	//

	saveNew: function(directory, filename, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(this.toString(), {

					// callbacks
					//
					success: () => {
						this.setModel(model);

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					}, 

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not save contact file.",
							response: response
						});
					}
				});
			}
		});
	},

	saveAs: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				filename: this.getFileName(),

				// callbacks
				//
				save: (directory, filename) => {

					// check if item exists
					//
					if (directory.hasItemNamed(filename)) {

						// show confirm
						//
						application.confirm({

							// options
							//
							title: "Overwrite File",
							message: "A file already exists with this name.  Would you like to overwrite it?",

							// callbacks
							//
							accept: () => {
								let item = directory.getItemNamed(filename);

								// update existing file
								//
								item.update(this.toString(), {

									// callbacks
									//
									success: () => {
										this.setModel(item);
										this.onSave(item);

										// perform callback
										//
										if (options && options.success) {
											options.success();
										}
									}
								});
							}
						});
					} else {
						this.saveNew(directory, filename, {

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
				}
			}));
		});
	},

	//
	// reverting methods
	//

	revert: function() {

		// revert to previous settings
		//
		for (let key in this.options.settings) {
			if (this.options.settings[key]) {

				// revert settings
				//
				this.options.settings[key].set(this.settings[key].attributes);
				this.options.settings[key].apply();
			}
		}

		// update view
		//
		if (application.desktop) {
			application.desktop.update();
		}
	},

	reset: function(options) {
		if (!options || options.confirm) {
			application.confirm({
				title: "Reset Theme",
				message: "Are you sure you want to reset your theme settings?",

				// callbacks
				//
				accept: () => {
					this.reset({
						confirm: false
					})
				}
			});
		} else {
			new UserSettings().delete({

				// update view
				//
				success: () => {
					let settings = this.getDefaultSettings();

					// apply default settings
					//
					this.constructor.applyTheme({
						general: settings.general.attributes,
						desktop: settings.desktop.attributes,
						controls: settings.controls.attributes,
						dialogs: settings.dialogs.attributes
					});

					this.initSettings();
				}
			});
		}
	},
	
	//
	// closing methods
	//

	close: function() {

		// close current file
		//
		this.closeFile(() => {

			// close parent dialog
			//
			this.dialog.close();
		});
	},
	
	closeFile: function(done) {

		// check if changed
		//
		if (this.hasChanged()) {

			// show prompt
			//
			application.prompt({

				// options
				//
				icon: '<i class="fa fa-save"></i>',
				title: "Save Settings",
				message: "Settings have been changed. Would you like to keep your new settings?",

				// callbacks
				//
				accept: () => {
					this.constructor.saveSettings(this.options.settings, {

						// callbacks
						//
						success: () => {
							done();
						}
					});
				},

				decline: () => {
					this.revert();

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		} else {

			// perform callback
			//
			if (done) {
				done();
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

		// show child views
		//
		this.showHeaderBar();
		this.showFooterBar();

		// load initial file
		//
		if (this.model) {
			this.loadFile(this.model);
		} else {
			this.showContents();
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
			model: this.directory,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onload: () => {
				this.onLoad();
			}
		});
	},

	getContentView: function() {
		return new ThemeSettingsView({
			model: this.model,

			// options
			//
			tab: this.options.tab,
			tab2: this.options.tab2,
			settings: this.options.settings
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
	
	showOpenDialog: function(directory) {
		import(
			'../../../views/apps/theme-manager/dialogs/themes/open-theme-dialog-view.js'
		).then((OpenThemeDialogView) => {

			// show open dialog
			//
			this.show(new OpenThemeDialogView.default({
				model: directory,

				// callbacks
				//
				onopen: (items) => {
					this.openItem(items[0]);
				}
			}));
		});
	},
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/theme-manager/dialogs/preferences/preferences-dialog-view.js'
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

	onLoad: function() {

		// close sidebar
		//
		/*
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}
		*/
		
		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// update view
		//
		if (this.hasChildView('contents')) {
			this.showContent();
		} else {
			this.showContents();
		}
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
	},

	//
	// static theming methods
	//

	loadTheme: function(file, options) {
		file.read({

			// callbacks
			//
			success: (data) => {
				data = JSON.parse(data);

				// apply loaded theme
				//
				this.applyTheme(data);

				// perform callbacks
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not read theme file.",
					response: response
				});
			}
		});
	},

	applyTheme: function(settings) {

		// make sure that launcher style isn't run menu for mobile
		//
		if (settings.desktop && settings.desktop.launcher_style == 'menu' && Browser.is_mobile) {
			settings.desktop.launcher_style = 'dock';
		}

		// parse settings
		//
		application.settings.theme.set(settings.general);
		application.settings.desktop.set(settings.desktop);
		application.settings.controls.set(settings.controls);
		application.settings.dialogs.set(settings.dialogs);

		// apply settings
		//
		application.settings.theme.apply();
		application.settings.desktop.apply();
		application.settings.controls.apply();
		application.settings.dialogs.apply();
	},

	saveSettings: function(settings, options) {
		let count = 0;
		let number = Object.keys(settings).length;

		function saveSetting(setting) {
			setting.save(undefined, {

				// callbacks
				//
				success: () => {
					count++;
					if (count == number) {

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
		for (let key in settings) {
			if (settings[key]) {
				saveSetting(settings[key]);
			} else {
				count++;
			}
		}
	}
});