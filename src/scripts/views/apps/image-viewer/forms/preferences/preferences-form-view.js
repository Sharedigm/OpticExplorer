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
import SlideShowPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/slide-show-prefs-form-view.js';
import EffectsPrefsFormView from '../../../../../views/apps/image-viewer/forms/preferences/effects-prefs-form-view.js';

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
		
			<li role="presentation" class="slide-show-tab<% if (tab == 'effects') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".slide-show-prefs">
					<i class="fa fa-play"></i>
					<label>Slide Show</label>
				</a>
			</li>
		
			<li role="presentation" class="effects-tab<% if (tab == 'effects') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".effects-prefs">
					<i class="fa fa-video"></i>
					<label>Effects</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general-prefs tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="display-prefs tab-pane<% if (tab == 'display') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="slide-show-prefs tab-pane<% if (tab == 'slide_show') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="effects-prefs tab-pane<% if (tab == 'effects') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: {
			el: '.app-icons',
			replaceElement: true
		},
		general: '.general-prefs',
		display: '.display-prefs',
		slide_show: '.slide-show-prefs',
		effects: '.effects-prefs'
	},

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
