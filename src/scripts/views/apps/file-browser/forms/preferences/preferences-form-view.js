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
import SlideShowPrefsFormView from '../../../../../views/apps/file-browser/forms/preferences/slide-show-prefs-form-view.js';
import FileAssociationsListView from '../../../../../views/apps/file-browser/lists/file-associations-list/file-associations-list-view.js';

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
		
			<li role="presentation" class="files-tab<% if (tab == 'files') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".file-prefs">
					<i class="fa fa-file"></i>
					<label>Files</label>
				</a>
			</li>
		
			<li role="presentation" class="display-tab<% if (tab == 'display') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".display-prefs">
					<i class="fa fa-desktop"></i>
					<label>Display</label>
				</a>
			</li>
		
			<li role="presentation" class="slide-show-tab<% if (tab == 'slide_show') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".slide-show-prefs">
					<i class="fa fa-play"></i>
					<label>Slide Show</label>
				</a>
			</li>
		
			<li role="presentation" class="behavior-tab<% if (tab == 'associations') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".associations">
					<i class="fa fa-rocket"></i>
					<label>Associations</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general-prefs tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="file-prefs tab-pane<% if (tab == 'files') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="display-prefs tab-pane<% if (tab == 'display') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="slide-show-prefs tab-pane<% if (tab == 'slide_show') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="associations tab-pane<% if (tab == 'associations') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: {
			el: '.app-icons',
			replaceElement: true
		},
		general: '.general-prefs',
		files: '.file-prefs',
		display: '.display-prefs',
		slide_show: '.slide-show-prefs',
		associations: '.associations',
	},

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
			case 'files':
				this.showFilePrefs();
				break;
			case 'display':
				this.showDisplayPrefs();
				break;
			case 'slide_show':
				this.showSlideShowPrefs();
				break;
			case 'associations':
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

	showFileAssociations: function() {
		this.showChildView('associations', new FileAssociationsListView({
			collection: this.options.associations.toCollection('extension', 'application'),

			// callbacks
			//
			onchange: (key, value) => {
				this.setOption(key, value);
			}
		}));
	}
});
