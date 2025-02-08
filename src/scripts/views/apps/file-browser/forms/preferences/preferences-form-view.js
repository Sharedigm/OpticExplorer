/******************************************************************************\
|                                                                              |
|                           preferences-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesGroupView from '../../../../../views/apps/common/forms/preferences-group-view.js';
import GeneralPrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/general-prefs-form-view.js';
import FilePrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/file-prefs-form-view.js';
import DisplayPrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/display-prefs-form-view.js';
import WindowPrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/window-prefs-form-view.js';
import SlideShowPrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/slide-show-prefs-form-view.js';
import FileAssociationsListView from '../../../../../views/apps/file-browser/lists/file-associations-list/file-associations-list-view.js';

export default PreferencesGroupView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-check"
		},
		{
			"name": "Display",
			"icon": "fa fa-desktop"
		},
		{
			"name": "Window",
			"icon": "fa fa-window-maximize"
		},
		{
			"name": "Files",
			"icon": "fa fa-file"
		},
		{
			"name": "Slide Show",
			"icon": "fa fa-play"
		},
		{
			"name": "Apps",
			"icon": "fa fa-rocket"
		}
	],

	//
	// constructor
	//

	initialize: function() {
		if (this.options.associations == undefined) {
			this.options.associations = application.settings.associations;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showAppIcon('file_browser');
				break;
			case 'general':
				this.showGeneralPrefs();
				break;
			case 'display':
				this.showDisplayPrefs();
				break;
			case 'window':
				this.showWindowPrefs();
				break;
			case 'files':
				this.showFilePrefs();
				break;
			case 'slide_show':
				this.showSlideShowPrefs();
				break;
			case 'apps':
				this.showFileAssociations();
				break;
		}
	},

	showGeneralPrefs: function() {
		this.showChildView('general', new GeneralPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));		
	},

	showDisplayPrefs: function() {
		this.showChildView('display', new DisplayPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));
	},

	showWindowPrefs: function() {
		this.showChildView('window', new WindowPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));
	},

	showFilePrefs: function() {
		this.showChildView('files', new FilePrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));		
	},

	showSlideShowPrefs: function() {
		this.showChildView('slide_show', new SlideShowPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));	
	},

	showFileAssociations: function() {
		this.showChildView('apps', new FileAssociationsListView({
			collection: this.options.associations.toCollection('extension', 'application'),

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));
	}
});