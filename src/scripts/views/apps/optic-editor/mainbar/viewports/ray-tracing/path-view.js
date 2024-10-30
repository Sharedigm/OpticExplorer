/******************************************************************************\
|                                                                              |
|                                  path-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a path (array of points).         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import SVGRenderable from '../../../../../../views/svg/behaviors/svg-renderable.js';

export default BaseView.extend(_.extend({}, SVGRenderable, {

	//
	// attributes
	//

	className: 'path',
	layer: 'normal',

	//
	// svg rendering methods
	//

	toDrawing: function() {
		if (this.collection.length > 0) {
			let first = this.collection[0];
			let x = first.x * this.options.viewport.pixelsPerMillimeter;
			let y = first.y * this.options.viewport.pixelsPerMillimeter;

			// convert values to strings
			//
			x = this.valueToString(x);
			y = this.valueToString(y);

			let d = 'M ' + x + ' ' + y;
			for (let i = 1; i < this.collection.length; i++) {
				let point = this.collection[i];
				x = point.x * this.options.viewport.pixelsPerMillimeter;
				y = point.y * this.options.viewport.pixelsPerMillimeter;

				// convert values to strings
				//
				x = this.valueToString(x);
				y = this.valueToString(y);

				d += ' L ' + x + ' ' + y;
			}
			return d;
		} else {
			return null;
		}
	},

	toElement: function() {
		let d = this.toDrawing();

		// extend path if path only has start point
		//
		if (this.collection.length == 1) {	
			let point = this.collection[0];
			let x = (point.x + this.options.direction.x * 4) * this.options.viewport.pixelsPerMillimeter;
			let y = (point.y + this.options.direction.y * 4) * this.options.viewport.pixelsPerMillimeter;

			// convert values to strings
			//
			x = this.valueToString(x);
			y = this.valueToString(y);

			d += ' L ' + x + ' ' + y;
		}

		// check if drawing exists
		//
		if (!d) {
			return null;
		}

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		// set attributes
		//
		$(el).attr('d', d);

		return el;
	},

	update: function() {

		// update attributes
		//
		this.$el.attr('d', this.toDrawing());
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
}));