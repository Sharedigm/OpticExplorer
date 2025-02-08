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
import GeneralPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/general-prefs-form-view.js';
import DisplayPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/display-prefs-form-view.js';
import WindowPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/window-prefs-form-view.js';
import SlideShowPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/slide-show-prefs-form-view.js';
import EffectsPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/effects-prefs-form-view.js';

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
			"name": "Slide Show",
			"icon": "fa fa-play"
		},
		{
			"name": "Effects",
			"icon": "fa fa-video"
		}
	],

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showAppIcon('image_viewer');
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
			case 'slide_show':
				this.showSlideShowPrefs();
				break;
			case 'effects':
				this.showEffectsPrefs();
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

	showEffectsPrefs: function() {
		this.showChildView('effects', new EffectsPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));	
	}
});