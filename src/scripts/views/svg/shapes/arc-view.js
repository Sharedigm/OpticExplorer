/******************************************************************************\
|                                                                              |
|                                 arc-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an annotation and markup element.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
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
	className: 'arc',

	//
	// svg rendering methods
	//
	
	toDrawing: function() {

		// get attributes
		//
		let point1 = this.model.get('point1');
		let point2 = this.model.get('point2');

		if (point1 && point2 && !point1.equals(point2)) {
			let angle = this.model.getAngle();
			let radius = this.model.getRadius();

			// compute arc parameters
			//
			let rx = radius * this.options.viewport.pixelsPerMillimeter;
			let ry = rx;
			let x1 = point1.x * this.options.viewport.pixelsPerMillimeter;
			let y1 = point1.y * this.options.viewport.pixelsPerMillimeter;
			let x2 = point2.x * this.options.viewport.pixelsPerMillimeter;
			let y2 = point2.y * this.options.viewport.pixelsPerMillimeter;
			let sweepFlag = angle < 0? 0 : 1;
			let xAxisRotation = 0;
			let largeArcFlag = 0;

			// convert values to strings
			//
			rx = this.valueToString(rx);
			ry = this.valueToString(ry);
			x1 = this.valueToString(x1);
			y1 = this.valueToString(y1);
			x2 = this.valueToString(x2);
			y2 = this.valueToString(y2);

			return 'M ' + x1 + ' ' + y1 + ' A ' + rx + ' ' + ry + ' ' +
				xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
				x2 + ' ' + y2;
		} else {
			return null;
		}
	}
});