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
import GeneralPrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/general-prefs-form-view.js';
import DisplayPrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/display-prefs-form-view.js';
import MapPrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/map-prefs-form-view.js';
import EffectsPrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/effects-prefs-form-view.js';
import MeasuringPrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/measuring-prefs-form-view.js';
import StoragePrefsFormView from '../../../../../views/apps/map-viewer/forms/preferences/storage-prefs-form-view.js';

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
		
			<li role="presentation" class="maps-tab<% if (tab == 'maps') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".map-prefs">
					<i class="fa fa-map"></i>
					<label>Maps</label>
				</a>
			</li>
		
			<li role="presentation" class="effects-tab<% if (tab == 'effects') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".effects-prefs">
					<i class="fa fa-video"></i>
					<label>Effects</label>
				</a>
			</li>
		
			<li role="presentation" class="measuring-tab<% if (tab == 'measuring') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".measuring-prefs">
					<i class="fa fa-ruler-horizontal"></i>
					<label>Measuring</label>
				</a>
			</li>
		
			<li role="presentation" class="storage-tab<% if (tab == 'storage') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".storage-prefs">
					<i class="fa fa-database"></i>
					<label>Storage</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" class="general-prefs tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="display-prefs tab-pane<% if (tab == 'display') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="map-prefs tab-pane<% if (tab == 'maps') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="effects-prefs tab-pane<% if (tab == 'effects') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="measuring-prefs tab-pane<% if (tab == 'measuring') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="storage-prefs tab-pane<% if (tab == 'storage') { %> active<% } %>">
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
		map: '.map-prefs',
		effects: '.effects-prefs',
		measuring: '.measuring-prefs',
		storage: '.storage-prefs'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showAppIcon('map_viewer');
				break;
			case 'general':
				this.showGeneralPrefs();
				break;
			case 'display':
				this.showDisplayPrefs();
				break;
			case 'map':
				this.showMapPrefs();
				break;
			case 'effects':
				this.showEffectsPrefs();
				break;
			case 'measuring':
				this.showMeasuringPrefs();
				break;
			case 'storage':
				this.showStoragePrefs();
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

	showMapPrefs: function() {
		this.showChildView('map', new MapPrefsFormView({
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
	},

	showMeasuringPrefs: function() {
		this.showChildView('measuring', new MeasuringPrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));	
	},

	showStoragePrefs: function() {
		this.showChildView('storage', new StoragePrefsFormView({
			model: this.model,

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));	
	}
});