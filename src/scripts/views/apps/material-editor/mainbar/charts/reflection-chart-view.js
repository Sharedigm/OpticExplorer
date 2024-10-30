/******************************************************************************\
|                                                                              |
|                           reflection-chart-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a reflection chart.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import Material from '../../../../../models/optics/materials/material.js';
import MaterialChartView from '../../../../../views/apps/material-editor/mainbar/charts/material-chart-view.js';
import SpectralLines from '../../../../../utilities/optics/spectral-lines.js';
import ColorUtils from '../../../../../utilities/multimedia/color-utils.js';
import Units from '../../../../../utilities/math/units.js';

export default MaterialChartView.extend({

	//
	// attributes
	//

	domain: {
		min: new Units(0, 'deg'),
		max: new Units(90, 'deg')
	},

	range: {
		min: 0,
		max: 100
	},

	interface: 'external',

	medium: new Material({
		index_of_refraction: 1,
		abbe_number: 50
	}),

	wavelength: SpectralLines.sodium.D,

	//
	// querying methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'brewsters_angle':
				return this.getBrewstersAngle();
			case 'critical_angle':
				return this.getCriticalAngle();
		}
	},

	getBrewstersAngle: function() {
		if (this.model) {
			return this.model.getBrewstersAngle(this.medium, {
				wavelength: this.getWavelength()
			});
		}
	},

	getCriticalAngle: function() {
		if (this.model) {
			return this.model.getCriticalAngle(this.medium, {
				wavelength: this.getWavelength()
			});
		}
	},

	getTicks: function(domain, divisions) {
		let ticks = [];

		// get optional parameters
		//
		let min = domain.min.as('deg').val();
		let max = domain.max.as('deg').val();

		// compute ticks
		//
		for (let i = 0; i < divisions; i++) {
			let t = i / (divisions - 1);
			let x = min + (max - min) * t;
			ticks.push(x);			
		}
		return ticks;
	},

	getData: function(domain, divisions, polarization) {

		// compute reflectances at ticks
		//
		let data = [];
		let ticks = this.getTicks(domain, divisions);
		for (let i = 0; i < divisions; i++) {
			let x = ticks[i];
			let y = this.model? this.model.getReflectance(new Units(x, 'deg'), this.medium, {
				polarization: polarization,
				interface: this.interface,
				wavelength: this.wavelength
			}) * 100 : 0;

			data.push([x, y]);
		}

		return data;
	},

	//
	// rendering methods
	//

	plot: function() {
		let data = [];
		let overlays = [];

		// get data for each polarization state
		//
		data[0] = this.getData(this.domain, this.divisions, 's-polarized');
		data[1] = this.getData(this.domain, this.divisions, 'unpolarized');
		data[2] = this.getData(this.domain, this.divisions, 'p-polarized');

		// set colors and shading
		//
		let color = this.model? this.model.getColor() : this.options.colors['primary'];
		let spanColor = ColorUtils.lighten(ColorUtils.namedColorToRgbColor(color), 0.1);
		let spanOpacity = 0.25;

		// add overlays
		//
		switch (this.interface) {

			case 'external':
				if (this.model) {
					let brewstersAngle = this.model.getBrewstersAngle(this.medium, {
						wavelength: this.wavelength
					});
					overlays.push({
						verticalLine: {
							name: "brewsters_angle",
							x: brewstersAngle,
							yOffset: 0,
							lineWidth: 3,
							color: application.options.theme == 'dark'? 'white' : 'black',
							shadow: true
						}
					});
				}
				break;

			case 'internal':
				if (this.model) {
					let criticalAngle = this.model.getCriticalAngle(this.medium, {
						wavelength: this.wavelength
					});
					overlays.push({
						verticalLine: {
							name: 'critical_angle',
							x: criticalAngle,
							yOffset: 0,
							lineWidth: 3,
							color: application.options.theme == 'dark'? 'white' : 'black',
							shadow: true
						}
					});
				}
				break;
		}

		// set chart id
		//
		this.id = 'reflection-chart' + this.options.app_count + '-' + this.options.tab_count;
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

			title: 'Reflectance (%)',

			//
			// series attributes
			//

			series: [
				{
					label: 's-polarized'
				},
				{
					label: 'unpolarized'
				},
				{
					label: 'p-polarized'
				}
			],

			seriesDefaults: {
				showMarker: false,
				rendererOptions: {
					smooth: data.length < 50
				}
			},

			seriesColors: [
				this.options.colors['primary'],
				spanColor,
				this.options.colors['secondary']
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
					label: "Angle of Incidence",
					min: this.domain.min.in('deg'),
					max: this.domain.max.in('deg'),
					numberTicks: 10,
					tickOptions: {
						formatString:'%#d&deg;'
					},
					pad: 0
				},

				yaxis: {
					min: this.range.min,
					max: this.range.max,
					numberTicks: 5,
					tickOptions: {
						formatString: '%#d%'
					},
					pad: 0
				}
			},

			//
			// overlay attributes
			//

			canvasOverlay: {
				show: true,
				objects: overlays
			},

			legend: {
				show: true,
				location: 'nw'
			},

			cursor: {
				show: true,
				zoom: true,
				clickReset: true,
				style: 'crosshair',
				tooltipLocation:'sw',
				showVerticalLine: true,
				showTooltipUnitPosition: false,
				showTooltipDataPosition: true,
				tooltipFormatString: '%s:%0d%s',
				followMouse: true,
				color: '#404060'
			},

			fillBetween: {
				fill: true,
				series1: 0,
				series2: 2,
				color: ColorUtils.fadeRgbColor(spanColor, spanOpacity * 100)
			}
		});

		this.showLabels();
	},

	showLabels: function() {
		if (!this.model) {
			return;
		}

		// show angles
		//
		switch (this.interface) {
			case 'external': {
				let brewstersAngle = this.model.getBrewstersAngle(this.medium, {
					wavelength: this.wavelength
				});
				let label = "Brewster's angle: " + brewstersAngle.toPrecision(3) + '&deg';
				this.applyChartHLabel(label, brewstersAngle);
				break;
			}
			case 'internal': {
				let criticalAngle = this.model.getCriticalAngle(this.medium, {
					wavelength: this.wavelength
				});
				let label = 'Critical angle: ' + criticalAngle.toPrecision(3) + '&deg';
				this.applyChartHLabel(label, criticalAngle);
				break;
			}
		}
	}
});