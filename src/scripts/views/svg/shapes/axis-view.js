/******************************************************************************\
|                                                                              |
|                                 axis-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw an infinite line denoting an axis.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShapeView from '../../../views/svg/shapes/shape-view.js';

export default ShapeView.extend({

	//
	// attributes
	//

	tagName: 'path',
	className: 'axis',
	layer: 'background',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		ShapeView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (!this.options.orientation) {
			this.options.orientation = 'horizontal';
		}

		// listen to viewport
		//
		if (this.options.viewport) {
			this.listenTo(this.options.viewport, 'resize', this.onResize);
			this.listenTo(this.options.viewport, 'change:scale', this.onChange);
			this.listenTo(this.options.viewport, 'change:offset', this.onChange);
		}
	},

	//
	// attribute methods
	//

	attributes: function() {
		return {
			'class': this.className,
			'stroke-dashoffset': this.getDashOffset() * this.options.viewport.scale,
			'd': this.toDrawing()
		};
	},

	//
	// getting methods
	//

	getDashOffset: function() {
		if (this.options.viewport.bounds) {
			switch (this.options.orientation) {
				case 'horizontal':
					return this.options.viewport.bounds.left;
				case 'vertical':
					return -this.options.viewport.bounds.top;
			}
		}
	},

	//
	// svg rendering methods
	//

	toDrawing: function() {
		let origin = this.model.get('location').scaledBy(this.options.viewport.pixelsPerMillimeter);

		if (this.options.viewport.bounds) {
			switch (this.options.orientation) {
				case 'horizontal':
					return 'M ' + this.options.viewport.bounds.left + ' ' + origin.y + ' L ' + this.options.viewport.bounds.right + ' ' + origin.y;
				case 'vertical':
					return 'M ' + origin.x + ' ' + this.options.viewport.bounds.top + ' L ' + origin.x + ' ' + this.options.viewport.bounds.bottom;
			}
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.update();
	},
});