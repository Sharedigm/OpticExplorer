/******************************************************************************\
|                                                                              |
|                             theme-picker-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app for picking a theme.                              |
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
import Items from '../../../collections/storage/items.js';
import AppView from '../../../views/apps/common/app-view.js';
import FilesView from '../../../views/apps/file-browser/mainbar/files/files-view.js';
import PreferencesFormView from '../../../views/apps/theme-picker/forms/preferences/preferences-form-view.js'

export default AppView.extend({

	//
	// attributes
	//

	name: 'theme_picker',

	template: template(`
		<div class="body">
			<div class="contents">
				<label>Select a theme:</label>
				<div class="items"></div>
				<% if (!config.apps.theme_manager.hidden) { %>
				<div class="well">You can also create your own customized theme using the Theme Manager app.</div>
				<% } %>
			</div>
		</div>
		
		<div class="footer-bar">
			<div class="theme-info hidden-xs"></div>
		</div>
	`),

	regions: {
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	events: _.extend({}, AppView.prototype.events, {
		'click .ok': 'onClickOk',
		'click .cancel': 'onClickCancel'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// make a copy of settings
		//
		this.settings = {};
		this.settings.theme = application.settings.theme.clone();
		this.settings.desktop = application.settings.desktop.clone();
		this.settings.dialogs = application.settings.dialogs.clone();

		// create theme files
		//
		let files = [];
		let themes = config.apps.theme_picker.themes;
		if (themes) {
			for (let i = 0; i < themes.length; i++) {
				files.push(new File({
					path: themes[i]
				}));
			}
		}

		// set attributes
		//
		this.collection = new Items(files, {
			comparator: null
		});

		// set window size
		//
		if (themes && themes.length <= 6) {
			if (config.apps.theme_manager.hidden) {
				this.size = [undefined, 300];
			} else {
				this.size = [undefined, 400];
			}
		}

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// theme methods
	//

	loadTheme: function(theme) {
		import(
			'../../../views/apps/theme-manager/theme-manager-view.js'
		).then((ThemeManagerView) => {
			ThemeManagerView.default.loadTheme(theme, {

				// callbacks
				//
				success: () => {
					this.onLoad();
				}
			});
		});
	},

	save: function(options) {
		import(
			'../../../views/apps/theme-manager/theme-manager-view.js'
		).then((ThemeManagerView) => {
			ThemeManagerView.default.saveSettings({
				theme: application.settings.theme,
				desktop: application.settings.desktop,
				dialogs: application.settings.dialogs
			}, options);
		});
	},

	revert: function() {

		// revert to previous settings
		//
		for (let key in this.settings) {
			if (this.settings[key]) {

				// revert settings
				//
				application.settings[key].set(this.settings[key].attributes);
				this.settings[key].apply();
			}
		}

		// update view
		//
		if (application.desktop) {
			application.desktop.update();
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.ok').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showItems();
	},

	showItems: function() {
		this.showChildView('items', new FilesView({
			collection: this.collection,

			// callbacks
			//
			onselect: (item) => this.onSelect(item)
		}));
	},

	//
	// dialog rendering methods
	//

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/theme-picker/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
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
		if (this.hasChanged) {

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
					this.save({

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
	// event handling methods
	//

	onLoad: function() {
		this.hasChanged = true;
		this.setDisabled(false);
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.loadTheme(item.model);
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.save();
	},

	onClickCancel: function() {
		this.revert();
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