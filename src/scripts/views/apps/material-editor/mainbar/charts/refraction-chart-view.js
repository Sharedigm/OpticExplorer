/******************************************************************************\
|                                                                              |
|                          refraction-chart-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a refraction chart.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import MaterialChartView from '../../../../../views/apps/material-editor/mainbar/charts/material-chart-view.js';
import ColorUtils from '../../../../../utilities/multimedia/color-utils.js';
import Units from '../../../../../utilities/math/units.js';

export default MaterialChartView.extend({

	//
	// attributes
	//

	domain: {
		min: new Units(300, 'nm'),
		max: new Units(800, 'nm')	
	},

	//
	// querying methods
	//

	getData: function(material, domain, options) {

		// get optional parameters
		//
		let divisions = options && options.divisions? options.divisions : 100;
		let min = domain.min.as('nm').val();
		let max = domain.max.as('nm').val();

		let data = [];
		for (let i = 0; i < divisions; i++) {
			let t = i / (divisions - 1);
			let x = min + (max - min) * t;
			let y = material? material.getIndexOfRefraction(new Units(x, 'nm')) : 1;
			data.push([x, y]);
		}
		return data;
	},

	getDefaultRange: function(data) {
		let min = undefined, max = undefined;
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].length; j++) {
				let y = data[i][j][1];
				if (!min || y < min) {
					min = y;
				}
				if (!max || y > max) {
					max = y;
				}
			}
		}

		if (min == 1 && max == 1) {
			max = 2;
		} else {
			let factor = 0.001;
			min = Math.floor(min / factor) * factor;
			max = Math.ceil(max / factor) * factor;		
		}

		return {
			min: min, 
			max: max
		};
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

	//
	// rendering methods
	//

	plot: function() {
		let name = this.model? this.model.getName() : 'Untitled';

		// set colors and shading
		//
		let color = this.model? this.model.getColor() : this.options.colors['primary'];
		let spanColor = ColorUtils.lighten(ColorUtils.namedColorToRgbColor(color), 0.1);
		let spanOpacity = 0.25;

		// get plot data
		//
		let data = [];
		let materials = [
			this.model
		];
		for (let i = 0; i < materials.length; i++) {
			data[i] = this.getData(materials[i], this.domain, this.divisions);
		}

		// find min and max
		//
		this.range = this.getRange(data);

		// set chart id
		//
		this.id = 'refraction-chart' + this.options.app_count + '-' + this.options.tab_count;
		this.$el.attr('id', this.id);

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

			title: 'Index of Refraction (n)',

			//
			// series attributes
			//

			series: [{
				label: name
			}],

			seriesDefaults: {
				showMarker: false,
			},

			seriesColors: [ spanColor ],

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
						formatString: '%#.4f'
					},
					pad: 0
				}
			},

			//
			// overlay attributes
			//

			canvasOverlay: {
				show: true,
				objects: this.getOverlays()
			},

			legend: {
				show: true,
				location: 'ne'
			},

			highlighter: {
				show: true,
				sizeAdjust: 1
			},

			cursor: { 
				show: true,
				zoom: true, 
				showTooltip: false
			},

			fillBetween: {
				fill: true,
				fillToZero: true,
				color: ColorUtils.fadeRgbColor(spanColor, spanOpacity * 100)
			}
		});

		// this.showLabels();
	}
});