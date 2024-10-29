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
import GeneralPrefsFormView from '../../../../../views/apps/audio-player/forms/preferences/general-prefs-form-view.js';
import DisplayPrefsFormView from '../../../../../views/apps/audio-player/forms/preferences/display-prefs-form-view.js';

export default PreferencesGroupView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="app-icons"></div>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general-tab<% if (tab == 'general' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general-prefs">
					<i class="fa fa-check"></i>
					<label>General</label>
				</a>
			</li>
		
			<li role="presentation" class="display-tab<% if (tab == 'display') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".display-prefs">
					<i class="fa fa-desktop"></i>
					<label>Display</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general-prefs tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="display-prefs tab-pane<% if (tab == 'display') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: {
			el: '.app-icons',
			replaceElement: true
		},
		general: '.general-prefs',
		display: '.display-prefs'
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showAppIcon('audio_player');
				break;
			case 'general':
				this.showGeneralPrefs();
				break;
			case 'display':
				this.showDisplayPrefs();
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
	}
});
