/******************************************************************************\
|                                                                              |
|                           spectrum-chart-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light emissions spectrum chart.              |
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
import LightUtils from '../../../../../utilities/optics/light-utils.js';
import Units from '../../../../../utilities/math/units.js';

// vendor imports
//
import '../../../../../../vendor/jqplot/jquery.jqplot.js';
import '../../../../../../vendor/jqplot/plugins/jqplot.highlighter.js';
import '../../../../../../vendor/jqplot/plugins/jqplot.canvasOverlay.js';

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
			replaceElement: false
		}
	},

	domain: {
		min: new Units(300, 'nm'),
		max: new Units(800, 'nm')	
	},

	range: {
		min: 0,
		max: 100
	},

	//
	// getting methods
	//

	getTitle: function() {
		let name = this.model? this.model.getName().replace('.spct', '') : 'Untitled';
		return name + ' Spectrum';
	},

	getDomain: function() {
		let domain = this.domain;

		if (!domain) {
			domain = [];
		}

		// check to see if min domain is unspecified
		//
		if (!domain[0]) {
			if (this.model && this.model.has('range')) {
				domain[0] = new Units(this.model.get('range')[0], 'um');
			} else {
				domain[0] = this.defaultDomain[0];
			}
		}

		// check to see if max domain is unspecified
		//
		if (!domain[1]) {
			if (this.model && this.model.has('range')) {
				domain[1] = new Units(this.model.get('range')[1], 'um');
			} else {
				domain[1] = this.defaultDomain[1];
			}
		}

		return domain;
	},

	getDefaultRange: function() {
		return {
			min: 0, 
			max: 100
		};
	},

	getRange: function(data) {
		let range = this.range;

		// check if range is unspecified
		//
		if (!range) {
			range = this.getDefaultRange(data);

		// check if range min or max is unspecified
		//
		} else if (!range.min || !range.max) {
			let defaultRange = this.getDefaultRange(data);

			if (!range.min) {
				range.min = defaultRange.min;
			}
			if (!range.max) {
				range.max = defaultRange.max;
			}
		}

		return range;
	},

	getData: function() {
		let data = [];
		let wavelengths = this.spectrum? this.spectrum.get('wavelengths') : [];
		let weights = this.spectrum? this.spectrum.get('weights') : undefined;

		if (wavelengths.length > 0) {
			for (let i = 0; i < wavelengths.length; i++) {
				let wavelength = wavelengths[i];
				let weight = weights? weights[i] : 1;
				let value = wavelength.in('nm');

				data.push([
					[value, 0],
					[value, weight * 100]
				]);
			}
		} else {
			data = [
				[[0, 0], [0, 0]],
			]
		}

		return data;
	},

	getLabels: function() {
		let labels = [];
		let wavelengths = this.spectrum? this.spectrum.get('wavelengths') : [];

		if (wavelengths.length > 0) {
			for (let i = 0; i < wavelengths.length; i++) {
				labels.push({
					label: wavelengths[i].in('nm') + ' nm'
				});
			}
		} else {
			labels = [{
				label: ' '
			}];
		}

		return labels;
	},

	getColors: function() {
		let colors = [];
		let wavelengths = this.spectrum? this.spectrum.get('wavelengths') : [];

		if (wavelengths.length > 0) {
			for (let i = 0; i < wavelengths.length; i++) {
				let wavelength = wavelengths[i].in('nm');
				let color = LightUtils.wavelengthToColor(wavelength);
				colors.push(color);
			}
		}

		return colors;
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'domain':
				this.domain = value;
				break;
			case 'range':
				this.range = value;
				break;
		}
	},

	setSpectrum: function(spectrum) {

		// update attributes
		//
		this.spectrum = spectrum;

		// update view
		//
		this.plot();
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
		this.plot();
	},

	replot: function() {
		this.chart.replot();
	},

	//
	// rendering methods
	//

	plot: function() {

		// get plot data
		//
		let data = this.getData();

		// find min and max
		//
		this.range = this.getRange(data);

		// set chart id
		//
		this.id = 'wavelengths-chart' + this.options.app_count + '-' + this.options.tab_count;
		this.$el.find('.chart').attr('id', this.id);

		// destroy any previous chart
		//
		if (this.chart) {
			this.chart.destroy();
		}

		// plot new chart
		//
		this.chart = $.jqplot(this.id, data, {

			//
			// options
			//

			title: this.getTitle(),

			//
			// series attributes
			//

			series: this.getLabels(),

			seriesDefaults: {
				showMarker: false
			},

			seriesColors: this.getColors(),

			//
			// background attributes
			//

			grid: {
				gridLineColor: '#e0e0f0',
				background: 'white'
			},

			axes: {
				xaxis: {
					label: 'Wavelength λ (nm)',
					min: this.domain.min.in('nm'),
					max: this.domain.max.in('nm'),
					tickOptions: {
						formatString: '%#d'
					},
					pad: 0
				},

				yaxis: {
					min: this.range.min,
					max: this.range.max,
					tickInterval: (this.range.max - this.range.min) / 4,
					tickOptions: {
						formatString: '%#d%'
					},
					pad: 0
				}
			},

			//
			// overlay attributes
			//

			legend: {
				show: true,
				location: 'ne'
			}
		});
	},

	update: function() {
		this.plot();
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.getParentView('tab-pane').isActive()) {
			this.plot();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		if (this.chart) {
			this.chart.destroy();
		}
	}
});