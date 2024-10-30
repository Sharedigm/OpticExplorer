/******************************************************************************\
|                                                                              |
|                           material-charts-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a material charts.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import DataSheetView from '../../../../../views/apps/material-editor/mainbar/charts/data-sheet-view.js';
import RefractionChartView from '../../../../../views/apps/material-editor/mainbar/charts/refraction-chart-view.js';
import ReflectionChartView from '../../../../../views/apps/material-editor/mainbar/charts/reflection-chart-view.js';
import TransmissionChartView from '../../../../../views/apps/material-editor/mainbar/charts/transmission-chart-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'chart-container',

	template: _.template(`
		<div class="chart"></div>
	`),

	regions: {
		'chart': {
			el: '.chart',
			replaceElement: true
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'view_kind':

				// set attributes
				//
				this.options.view_kind = value;

				// re-render
				//
				this.showChart(value);
		}
	},

	setModel: function(model) {

		// update attributes
		//
		this.model = model;

		// update view
		//
		this.showChart(this.options.view_kind);
	},

	setActive: function(active) {
		if (this.hasChildView('chart') && this.getChildView('chart').setActive) {
			this.getChildView('chart').setActive(active);
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.showChart(this.options.view_kind);
	},

	showChart: function(viewKind) {

		// update view
		//
		switch (viewKind) {
			case 'data_sheet':
				this.showDataSheet();
				break;
			case 'refraction':
				this.showRefractionChart();
				break;
			case 'reflection':
				this.showReflectionChart();
				break;
			case 'transmission':
				this.showTransmissionChart();
				break;
		}
	},

	showDataSheet: function() {
		this.showChildView('chart', new DataSheetView({
			model: this.model,

			// options
			//
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			wavelengths: this.options.wavelengths,
			selected: this.options.selected
		}))
	},

	showRefractionChart: function() {
		this.showChildView('chart', new RefractionChartView({
			model: this.model,

			// options
			//
			domain: this.options.domain,
			range: this.options.range,
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			wavelengths: this.options.wavelengths,
			selected: this.options.selected
		}))
	},

	showReflectionChart: function() {
		this.showChildView('chart', new ReflectionChartView({
			model: this.model,

			// options
			//
			domain: this.options.domain,
			range: this.options.range,
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			wavelengths: this.options.wavelengths,
			selected: this.options.selected
		}))
	},

	showTransmissionChart: function() {
		this.showChildView('chart', new TransmissionChartView({
			model: this.model,

			// options
			//
			domain: this.options.domain,
			range: this.options.range,
			app_count: this.options.app_count,
			tab_count: this.options.tab_count,
			colors: this.options.colors,
			wavelengths: this.options.wavelengths,
			selected: this.options.selected
		}))
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		this.showChart(attribute);
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.hasChildView('chart') && this.getChildView('chart').onResize) {
			this.getChildView('chart').onResize();
		}
	}
});