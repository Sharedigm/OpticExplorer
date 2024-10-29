/******************************************************************************\
|                                                                              |
|                                   svg-scalable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for scaling (and unscaling) svg elements.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// constructor
	//

	initialize: function() {
		this.listenTo(this.options.viewport, 'change:scale', this.onChangeScale);
	},

	//
	// setting methods
	//

	setElementScale: function(element, scale) {
		let $element = $(element);

		// get attributes
		//
		let x = $element.attr('x');
		let y = $element.attr('y');

		if (x) {
			if (x.contains('mm')) {
				x = parseFloat(x.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				x = parseFloat(x);
			}
		} else {
			x = 0;
		}

		if (y) {
			if (y.contains('mm')) {
				y = parseFloat(y.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				y = parseFloat(y);
			}
		} else {
			y = 0;
		}

		$element.attr('transform', [
			'translate(' + (x) + ',' + (y) + ')',
			'scale(' + scale + ')',
			'translate(' + (-x) + ',' + (-y) + ')'
		].join(','));
	},

	setLineElementScale: function(element, scale) {
		let $element = $(element);

		// get attributes
		//
		let x1 = $element.attr('x1');
		let y1 = $element.attr('y1');
		let x2 = $element.attr('x2');
		let y2 = $element.attr('y2');

		if (x1) {
			if (x1.contains('mm')) {
				x1 = parseFloat(x1.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				x1 = parseFloat(x1);
			}
		} else {
			x1 = 0;
		}

		if (y1) {
			if (y1.contains('mm')) {
				y1 = parseFloat(y1.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				y1 = parseFloat(y1);
			}
		} else {
			y1 = 0;
		}

		if (x2) {
			if (x2.contains('mm')) {
				x2 = parseFloat(x2.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				x2 = parseFloat(x2);
			}
		} else {
			x2 = 0;
		}

		if (y2) {
			if (y2.contains('mm')) {
				y2 = parseFloat(y2.replace('mm', '')) * this.options.viewport.pixelsPerMillimeter;
			} else {
				y2 = parseFloat(y2);
			}
		} else {
			y2 = 0;
		}

		$element.attr({
			x1: x1 * scale,
			y1: y1 * scale,
			x2: x2 * scale,
			y2: y2 * scale
		});
	},

	setScale: function(scale) {
		this.setElementScale(this.$el, scale);
	},

	//
	// event handling methods
	//

	onChangeScale: function() {
		this.setElementScale(this.$el.find('.unscaled'), 1 / this.options.viewport.scale);
	}
};
