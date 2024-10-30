/******************************************************************************\
|                                                                              |
|                            material-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying materials.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Material from '../../../../../../models/optics/materials/material.js';
import SplitView from '../../../../../../views/layout/split-view.js';
import MaterialChartsView from '../../../../../../views/apps/material-editor/mainbar/charts/material-charts-view.js';
import DataEditorView from '../../../../../../views/apps/material-editor/mainbar/data-editor/data-editor-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'vertical',
	flipped: true,
	sizes: [75, 25],

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		SplitView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.model) {
			this.model = new Material();
		}

		// set initial state
		//
		this.options.wavelengths = this.getWavelengths();
		this.options.show_sidebar = this.options.preferences.get('show_data_editor');
	},

	//
	// getting methods
	//

	getWavelengths: function() {
		let wavelengths = {};
		let keys = Object.keys(config.apps.material_editor.wavelengths);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let wavelength = config.apps.material_editor.wavelengths[key];
			wavelengths[key] = new Units(wavelength, 'nm');
		}
		return wavelengths;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'show_data_editor':
				this.setSideBarVisibility(value);
				break;
			case 'data_editor_bar_size':
				this.setSideBarSize(value);
				break;

			// view options
			//
			default:
				this.options.preferences.set(key, value);
				this.getChildView('sidebar').setOption(key, value);
				this.getChildView('mainbar').setOption(key, value);
				this.update();
				break;
		}
	},

	setModel: function(model) {

		// set attributes
		//
		this.model = model;

		// update child views
		//
		this.getChildView('sidebar').setModel(model);
		this.getChildView('mainbar').setModel(model);
	},

	setActive: function(active) {
		this.getChildView('mainbar').setActive(active);
		// this.update();
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new DataEditorView({
			model: this.model,

			// options
			//
			view_kind: this.options.preferences.get('view_kind'),
			wavelengths: this.options.wavelengths,
			selected: this.options.selected,
			parent: this,

			// callbacks
			//
			onchange: (attribute) => this.onChange(attribute)
		});
	},

	getContentView: function() {
		return new MaterialChartsView({
			model: this.model,

			// options
			//
			domain: this.options.domain,
			range: this.options.range,
			view_kind: this.options.preferences.get('view_kind'),
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			wavelengths: this.options.wavelengths,
			selected: this.options.selected,
			parent: this
		});
	},

	//
	// updating methods
	//

	update: function() {
		if (!this.hasChildView('sidebar data graphing')) {
			this.updateSheetAttributes();
		} else {
			this.updateChartAttributes();
			this.updateChart();
		}
	},

	updateSheetAttributes: function() {
		this.getChildView('sidebar data').setValue('selected', this.options.selected);
		this.getChildView('mainbar chart').setValue('selected', this.options.selected);
	},

	updateChartAttributes: function() {

		// get chart attributes
		//
		this.options.domain = this.getChildView('sidebar data graphing').getValue('domain');
		this.options.range = this.getChildView('sidebar data graphing').getValue('range');
		
		// update chart attributes
		//
		if (this.getChildView('mainbar chart').setValue) {
			this.getChildView('mainbar chart').setValue('domain', this.options.domain);
			this.getChildView('mainbar chart').setValue('range', this.options.range);
			this.getChildView('mainbar chart').setValue('selected', this.options.selected);
		}

		// propagate form values
		//
		switch (this.options.preferences.get('view_kind')) {
			case 'reflection': 
				this.getChildView('mainbar chart').interface = this.getChildView('sidebar data params').interface;
				this.getChildView('mainbar chart').medium = this.getChildView('sidebar data params').medium;
				break;
			case 'transmission':
				this.getChildView('mainbar chart').transmission = this.getChildView('sidebar data params').transmission;
				this.getChildView('mainbar chart').thickness = this.getChildView('sidebar data params').thickness;
				break;
		}
	},

	updateDataEditor: function() {
		if (this.hasChildView('sidebar data equation')) {
			this.getChildView('sidebar data equation').update();
		}
		if (this.hasChildView('sidebar data calculations')) {
			this.getChildView('sidebar data calculations').update();
		}
	},

	updateChart: function() {
		this.getChildView('mainbar chart').update();
	},

	updateWavelengths: function() {
		this.options.selected = this.getChildView('sidebar data wavelengths').getValues();
		this.getChildView('mainbar chart').setValue('selected', this.options.selected);
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		switch (attribute) {
			case 'wavelengths':
				this.updateWavelengths();
				break;
			default:
				this.update();
		}
	}
});