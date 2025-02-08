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
import SpectraPanelView from '../../../../views/apps/spectrum-editor/sidebar/panels/spectra-panel-view.js';
import SharedPanelView from '../../../../views/apps/spectrum-editor/sidebar/panels/shared-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['spectra', 'shared'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'spectra': isSignedIn,
			'shared': true
		};
	},

	//
	// querying methods
	//

	hasSelectedItems: function() {
		if (this.hasChildView('spectra')) {
			return this.getChildView('spectra').hasSelected();
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
		return this.getChildView('spectra').getSelectedItems();
	},

	getSelectedModels: function() {
		return this.getChildView('spectra').getSelectedModels();
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
			case 'spectra':
				this.showSpectraPanel();
				break;
			case 'shared':
				this.showSharedPanel();
				break;
		}
	},

	showSpectraPanel: function() {
		this.showChildView('spectra', new SpectraPanelView({
			directory: this.options.wavelengths,

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
		this.getChildView('spectra').onRender();
	}
});