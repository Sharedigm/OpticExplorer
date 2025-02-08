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
import SettingsPanelView from '../../../../views/apps/settings-manager/sidebar/panels/settings-panel-view.js';
import PreferencesPanelView from '../../../../views/apps/settings-manager/sidebar/panels/preferences-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['settings', 'preferences'],

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
			case 'preferences':
				return this.hasChildView('preferences') && this.getChildView('preferences').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		switch (this.category) {
			case 'settings':
				return this.getChildView('settings').getSelected();
			case 'preferences':
				return this.getChildView('preferences').getSelected();
		}
	},

	getSelectedChildView: function(which) {
		switch (this.category) {
			case 'settings':
				return this.getChildView('settings').getSelectedChildView(which);
			case 'preferences':
				return this.getChildView('preferences').getSelectedChildView(which);
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
			case 'preferences':
				this.getChildView('preferences').setSelectedIndex(index);
				break;
		}
	},

	setSelected: function(name, category) {
		let selectedView;

		switch (category) {
			case 'settings':
				this.getChildView('preferences').deselectAll();
				selectedView = this.getChildView('settings').selectByName(name);
				break;
			case 'preferences':
				this.getChildView('settings').deselectAll();
				selectedView = this.getChildView('preferences').selectByName(name);	
				break;
		}

		// set selected category
		//
		this.category = category;

		if (selectedView) {
			this.scrollToView(selectedView);
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// set initial selection
		//
		if (this.options.app) {
			this.setSelected(this.options.app.getName(), 'preferences');
		} else {
			this.setSelected(this.options.nav || 'Account', 'settings');
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
			case 'preferences':
				this.showPreferencesPanel();
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
			onselect: (name) => {
				
				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(name, 'settings');
					this.category = 'settings';
				}
			}
		}));
	},
	
	showPreferencesPanel: function() {
		this.showChildView('preferences', new PreferencesPanelView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onselect: (name) => {
				
				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(name, 'preferences');
					this.category = 'preferences';
				}
			}
		}));		
	}
});