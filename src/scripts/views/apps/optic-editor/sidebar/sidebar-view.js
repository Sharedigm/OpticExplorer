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
import OpticsPanelView from '../../../../views/apps/optic-editor/sidebar/panels/optics-panel-view.js';
import SharedPanelView from '../../../../views/apps/optic-editor/sidebar/panels/shared-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['optics', 'shared'],

	//
	// attribute methods
	//

	enabled: function() {
		let isUserSignedIn = application.isUserSignedIn();

		return {
			'optics': isUserSignedIn,
			'shared': true
		};
	},

	//
	// querying methods
	//

	hasSelectedItems: function() {
		if (this.hasChildView('optics')) {
			return this.getChildView('optics').hasSelected();
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

	getSelectedItems: function() {
		return this.getChildView('optics').getSelectedItems();
	},

	getSelectedModels: function() {
		return this.getChildView('optics').getSelectedModels();
	},

	//
	// setting methods
	//

	setPanelItemsSelected: function(panel, selected, filter, options) {
		if (selected) {
			if (this.hasChildView(panel) &&
				this.getChildView(panel).selectAll) {
				this.getChildView(panel).selectAll(filter, options);
			}
		} else {
			if (this.hasChildView(panel) &&
				this.getChildView(panel).deselectAll) {
				this.getChildView(panel).deselectAll(filter, options);
			}
		}
	},

	setItemsSelected: function(selected, filter, options) {
		let panels = this.getPanels();
		for (let i = 0; i < panels.length; i++) {
			this.setPanelItemsSelected(panels[i], selected, filter, options);
		}
	},

	//
	// panel rendering methods
	//

	showPanel: function(name) {
		switch (name) {
			case 'optics':
				this.showOpticsPanel();
				break;
			case 'shared':
				this.showSharedPanel();
				break;
		}
	},

	showOpticsPanel: function() {
		this.showChildView('optics', new OpticsPanelView({
			directory: this.options.optics,

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
		this.getChildView('optics').onRender();
	}
});