/******************************************************************************\
|                                                                              |
|                           material-chart-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a material chart.                              |
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

// vendor imports
//
import '../../../../../../vendor/jqplot/jquery.jqplot.js';
import '../../../../../../vendor/jqplot/plugins/jqplot.highlighter.js';
import '../../../../../../vendor/jqplot/plugins/jqplot.canvasOverlay.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'chart',

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.divisions = 100;
		this.defaultDomain = this.domain;
		this.defaultRange = this.range;

		// set attributes from options
		//
		if (this.options.domain) {
			this.domain = this.options.domain;
		}
		if (this.options.range) {
			this.range = this.options.range;
		}
		if (this.options.selected) {
			this.selected = this.options.selected;
		}
	},

	//
	// getting methods
	//

	getWavelengths: function(wavelengths) {
		let array = [];
		if (wavelengths) {
			for (let i = 0; i < wavelengths.length; i++) {
				if (wavelengths[i].checked) {
					array.push(wavelengths[i].wavelength);
				}
			}
		}
		return array;
	},

	getOverlays: function() {
		let overlays = [];
		let wavelengths = this.selected? this.getWavelengths(this.selected) : undefined;

		for (let key in this.options.wavelengths) {
			if (!wavelengths || wavelengths.includes(key)) {
				let wavelength = this.options.wavelengths[key].as('nm').val();

				overlays.push({
					verticalLine: {
						name: key,
						x: wavelength,
						yOffset: 0,
						lineWidth: 3,
						color: LightUtils.wavelengthToColor(wavelength),
						shadow: true
					}
				});
			}
		}

		return overlays;
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
			case 'selected':
				this.selected = value;
				break;
		}
	},

	setActive: function(active) {
		if (active && this.$el.width() > 0 && this.$el.height() > 0) {
			this.plot();
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

	showLabels: function() {
		for (let key in this.options.wavelengths) {
			this.applyChartHLabel(key, this.options.wavelengths[key].as('nm').val());
		}
	},

	applyChartHLabel: function(text, lineValue) {
		let maxVal = this.chart.axes.xaxis.max;
		let minVal = this.chart.axes.xaxis.min;
		let domain = maxVal - minVal; 
		let axisWidth = this.chart.axes.yaxis.getWidth();
		let width = this.chart._width - axisWidth - 10;

		// calculate how many pixels make up each point in the y-axis
		//
		let pixelsPerPoint = width / domain;

		// calculate horizontal position
		//
		let valueWidth = axisWidth + ((lineValue - minVal) * pixelsPerPoint);

		// insert the label div as a child of the jqPlot parent
		//
		let titleSelector = this.$el.find('.jqplot-overlayCanvas-canvas');
		$('<div class="jqplot-point-label vertical-line-label" style="left:' + valueWidth + 'px;">' + text + '</div>').insertAfter(titleSelector);
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