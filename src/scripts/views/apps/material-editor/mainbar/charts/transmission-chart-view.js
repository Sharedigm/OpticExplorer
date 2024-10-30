/******************************************************************************\
|                                                                              |
|                          transmission-chart-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a transmission chart.                          |
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
import LightUtils from '../../../../../utilities/optics/light-utils.js';
import Units from '../../../../../utilities/math/units.js';

export default MaterialChartView.extend({

	//
	// attributes
	//

	domain: {
		min: new Units(300, 'nm'),
		max: new Units(800, 'nm')	
	},

	range: {
		min: 99,
		max: 100
	},

	transmission: 'absorption',
	thickness: new Units('10', 'mm'),
	interface: 'external',

	//
	// querying methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'range':
				return this.options.range || this.defaultRange;
		}
	},

	getReflectance: function(wavelength) {
		let angle = 0;
		let n1 = 1;
		let n2 = this.model? this.model.getIndexOfRefraction(wavelength) : 1;
		let polarization = 'unpolarized';

		switch (this.interface) {
			case 'external':
				return LightUtils.fresnelReflectance(n1, n2, angle, polarization);
			case 'internal':
				return LightUtils.fresnelReflectance(n2, n1, angle, polarization);
		}
	},

	getData: function() {
		let coords = this.model? this.model.get('k') : undefined;

		let data = [];
		if (coords) {
			for (let i = 0; i < coords.length; i++) {
				let wavelength = coords? new Units(coords[i][0], 'um') : undefined;
				let k = coords? coords[i][1] : 0;
				let tau = LightUtils.beerLambertTransmission(k, this.thickness, wavelength);
			
				// add reflection effects to absorption
				//	
				switch (this.transmission) {
					case 'absorption-fresnel': {
						let R = this.getReflectance(wavelength);
						tau *= Math.sqr(1 - R);
						break;
					}
					case 'absorption-fresnel-reflection': {
						let R = this.getReflectance(wavelength);
						tau *= Math.sqr(1 - R) / Math.sqr(1 - R * tau);
						break;
					}
				}

				data.push([wavelength.as('nm').val(), tau * 100]);
			}
		} else {
			data.push([this.defaultDomain.min.in('nm'), 100]);
			data.push([this.defaultDomain.max.in('nm'), 100]);
		}
		return data;
	},

	//
	// rendering methods
	//

	plot: function() {

		// set colors and shading
		//
		let color = this.model? this.model.getColor() : this.options.colors['primary'];
		let spanColor = ColorUtils.lighten(ColorUtils.namedColorToRgbColor(color), 0.1);
		let spanOpacity = 0.25;

		// get plot data
		//
		let data = this.getData() || [[]];

		// set chart id
		//
		this.id = 'transmission-chart' + this.options.app_count + '-' + this.options.tab_count;
		this.$el.attr('id', this.id);

		// destroy any previous chart
		//
		if (this.chart) {
			this.chart.destroy();
		}

		// plot new chart
		//
		this.chart = $.jqplot(this.id, [data], {

			//
			// options
			//

			title: 'Transmission (%)',

			//
			// series attributes
			//

			series: [{
				label: 'Thickness = ' + this.thickness.toString(),
			}],

			seriesDefaults: {
				showMarker: true,
				rendererOptions: {
					smooth: true
				}
			},

			seriesColors: [
				spanColor
			],

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
					tickOptions: {
						formatString: '%#.1f%'
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