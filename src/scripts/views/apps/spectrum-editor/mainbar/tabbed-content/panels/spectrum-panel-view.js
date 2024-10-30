/******************************************************************************\
|                                                                              |
|                            spectrum-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying an emissions spectrum.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SplitView from '../../../../../../views/layout/split-view.js';
import SpectrumChartView from '../../../../../../views/apps/spectrum-editor/mainbar/charts/spectrum-chart-view.js';
import DataEditorView from '../../../../../../views/apps/spectrum-editor/mainbar/data-editor/data-editor-view.js';

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

		// set initial state
		//
		this.options.show_sidebar = this.options.preferences.get('show_data_editor');
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
		this.spectrum = model;

		// update child views
		//
		this.getChildView('sidebar').setSpectrum(model);
		this.getChildView('mainbar').setSpectrum(model);
	},

	setActive: function(active) {
		this.getChildView('mainbar').setActive(active);
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
			parent: this,

			// callbacks
			//
			onchange: (attribute) => this.onChange(attribute)
		});
	},

	getContentView: function() {
		return new SpectrumChartView({
			model: this.model,

			// options
			//
			domain: this.options.domain,
			range: this.options.range,
			view_kind: this.options.preferences.get('view_kind'),
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			parent: this
		});
	},

	update: function() {

		// get chart attributes
		//
		this.options.domain = this.getChildView('sidebar graphing').getValue('domain');
		this.options.range = this.getChildView('sidebar graphing').getValue('range');

		// update chart attributes
		//
		if (this.getChildView('mainbar').setValue) {
			this.getChildView('mainbar').setValue('domain', this.options.domain);
			this.getChildView('mainbar').setValue('range', this.options.range);
		}

		// update chart
		//
		this.getChildView('mainbar').update();
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
});