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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import MapsPanelView from '../../../../views/apps/material-map-viewer/sidebar/panels/maps-panel-view.js';
import SharedPanelView from '../../../../views/apps/material-map-viewer/sidebar/panels/shared-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['maps', 'shared'],

	//
	// attribute methods
	//

	enabled: function() {
		let isUserSignedIn = application.isUserSignedIn();

		return {
			'maps': isUserSignedIn,
			'shared': true
		};
	},

	//
	// querying methods
	//

	hasSelectedItems: function() {
		if (this.hasChildView('maps')) {
			return this.getChildView('maps').hasSelected();
		}
	},

	//
	// getting methods
	//

	getPanels: function() {
		return Object.keys(this.regions);
	},

	getPanelItemView: function(panel, model) {
		if (this.hasChildView(panel)) {
			return this.getChildView(panel).getChildView('items').getItemView(model);
		}
	},

	getItemView: function(model) {
		let panels = this.getPanels();
		for (let i = 0; i < panels.length; i++) {
			let view = this.getPanelItemView(panels[i], model);
			if (view) {
				return view;
			}
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('maps')) {
			return this.getChildView('maps').getSelectedModels();
		}
	},

	//
	// panel rendering methods
	//

	showPanel: function(name) {
		switch (name) {
			case 'maps':
				this.showMapsPanel();
				break;
			case 'shared':
				this.showSharedPanel();
				break;
		}
	},

	showMapsPanel: function() {
		this.showChildView('maps', new MapsPanelView({
			directory: this.options.maps,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},
	
	showSharedPanel: function() {
		this.showChildView('shared', new SharedPanelView({
			directory: this.options.shared,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	//
	// event handling methods
	//

	onSave: function() {
		this.getChildView('maps').onRender();
	}
});