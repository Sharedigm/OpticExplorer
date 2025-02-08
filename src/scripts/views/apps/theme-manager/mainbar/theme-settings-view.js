/******************************************************************************\
|                                                                              |
|                          theme-settings-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedFormView from '../../../../views/forms/tabbed-form-view.js';
import AppearanceSettingsFormView from '../../../../views/apps/theme-manager/mainbar/appearance/appearance-settings-form-view.js';
import DesktopSettingsFormView from '../../../../views/apps/theme-manager/mainbar/desktop/desktop-settings-form-view.js';
import ControlSettingsFormView from '../../../../views/apps/theme-manager/mainbar/controls/control-settings-form-view.js';
import DialogSettingsFormView from '../../../../views/apps/theme-manager/mainbar/dialogs/dialog-settings-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	className: 'content',

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-eye"
		},
		{
			"name": "Desktop",
			"icon": "fa fa-desktop"
		},
		{
			"name": "Controls",
			"icon": "fa fa-sliders-h"
		},
		{
			"name": "Dialogs",
			"icon": "far fa-window-maximize"
		}
	],

	//
	// constructor
	//

	initialize: function() {

		// listen to models for changes
		//
		this.listenTo(this.options.settings.theme, 'change', this.onChange, this);
		this.listenTo(this.options.settings.controls, 'change', this.onChange, this);
		this.listenTo(this.options.settings.desktop, 'change', this.onChange, this);	
	},

	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'general':
				this.showGeneralSettings();
				break;
			case 'desktop':
				this.showDesktopSettings();
				break;
			case 'controls':
				this.showControlsSettings();
				break;
			case 'dialogs':
				this.showDialogsSettings();
				break;
		}
	},

	showGeneralSettings: function() {
		this.showChildView('general', new AppearanceSettingsFormView({
			tab: this.options.tab == 'appearance'? this.options.tab2 : undefined
		}));
	},

	showDesktopSettings: function() {
		this.showChildView('desktop', new DesktopSettingsFormView({
			tab: this.options.tab == 'desktop'? this.options.tab2 : undefined
		}));
	},

	showControlsSettings: function() {
		this.showChildView('controls', new ControlSettingsFormView({
			tab: this.options.tab == 'controls'? this.options.tab2 : undefined
		}));
	},

	showDialogsSettings: function() {
		this.showChildView('dialogs', new DialogSettingsFormView({
			tab: this.options.tab == 'dialogs'? this.options.tab2 : undefined
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});