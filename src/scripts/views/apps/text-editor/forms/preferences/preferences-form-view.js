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
import GeneralPrefsFormView from '../../../../../views/apps/text-editor/forms/preferences/general-prefs-form-view.js';
import WindowPrefsFormView from '../../../../../views/apps/text-editor/forms/preferences/window-prefs-form-view.js';

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
			"name": "Window",
			"icon": "fa fa-window-maximize"
		}
	],
	
	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showAppIcon('text_editor');
				break;
			case 'general':
				this.showGeneralPrefs();
				break;
			case 'window':
				this.showWindowPrefs();
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

	showWindowPrefs: function() {
		this.showChildView('window', new WindowPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));	
	}
});