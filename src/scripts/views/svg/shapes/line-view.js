/******************************************************************************\
|                                                                              |
|                                   line-view.js                               |
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
	className: 'line',
	
	//
	// svg rendering methods
	//

	toDrawing: function() {
		let point1 = this.model.get('point1').scaledBy(this.options.viewport.pixelsPerMillimeter);
		let point2 = this.model.get('point2').scaledBy(this.options.viewport.pixelsPerMillimeter);
		if (!point1.equals(point2)) {

			// convert values to strings
			//
			let x1 = this.valueToString(point1.x);
			let y1 = this.valueToString(point1.y);
			let x2 = this.valueToString(point2.x);
			let y2 = this.valueToString(point2.y);

			return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
		} else {
			return '';
		}
	}
});