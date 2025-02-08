/******************************************************************************\
|                                                                              |
|                           settings-browser-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app for browsing settings and preferences.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppSplitView from '../../../views/apps/common/app-split-view.js';
import HeaderBarView from '../../../views/apps/settings-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/settings-browser/sidebar/sidebar-view.js';
import MainBarView from '../../../views/apps/settings-browser/mainbar/mainbar-view.js';
import FooterBarView from '../../../views/apps/settings-browser/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/settings-browser/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend({

	//
	// attributes
	//

	name: 'settings_browser',

	//
	// selection timeout
	//

	deselectDuration: 1000,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.collection = application.getVisibleApps((app)=> {
			return config.preferences[app.id] != undefined;
		});

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// querying methods
	//

	numApps: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// update
		//
		this.onLoad();
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

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) =>this.onSelect(item)
		});
	},

	getContentView: function() {
		return new MainBarView({
			collection: this.collection,

			// options
			//
			view_kind: this.preferences.get('view_kind'),

			// callbacks
			//
			onselect: (item) =>this.onSelect(item)
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
			'../../../views/apps/settings-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showSettings: function(nav) {
		application.launch('settings_manager', {
			nav: nav
		});
	},

	showPreferences: function(app) {
		application.launch('settings_manager', {
			app: app
		});
	},

	//
	// event handling methods
	//

	onSelect: function(item) {

		// launch settings manager
		//
		if (item.model) {
			if (!item.model.has('app')) {

				// show settings
				//
				this.showSettings(item.model.get('name'));
			} else {

				// show preferences
				//
				this.showPreferences(item.model);
			}
		}

		// deselect after a pause
		//
		window.setTimeout(() => {
			item.deselect();
		}, this.deselectDuration);
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