/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import SettingsPanelView from '../../../../views/apps/settings-browser/sidebar/panels/settings-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['settings'],

	//
	// constructor
	//

	initialize: function() {
		this.category = 'settings';
	},

	//
	// querying methods
	//

	hasSelected: function() {
		switch (this.category) {
			case 'settings':
				return this.hasChildView('setttings') && this.getChildView('settings').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		switch (this.category) {
			case 'settings':
				return this.getChildView('settings').getSelected();
		}
	},

	getSelectedChildView: function(which) {
		switch (this.category) {
			case 'settings':
				return this.getChildView('settings').getSelectedChildView(which);
		}
	},

	//
	// setting methods
	//

	setSelectedIndex: function(index) {
		switch (this.category) {
			case 'settings':
				this.getChildView('settings').setSelectedIndex(index);
				break;
		}
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'settings':
				this.showSettingsPanel();
				break;
		}
	},

	showSettingsPanel: function() {
		this.showChildView('settings', new SettingsPanelView({

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onselect: this.options.onselect
		}));
	}
});