/******************************************************************************\
|                                                                              |
|                                   rect-view.js                               |
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

	tagName: 'rect',
	className: 'rect',

	//
	// svg rendering methods
	//

	attributes: function() {
		let point1 = this.model.getMin();
		let point2 = this.model.getMax();
		return {
			'x': point1.x * this.options.viewport.pixelsPerMillimeter,
			'y': point1.y * this.options.viewport.pixelsPerMillimeter,
			'width': (point2.x - point1.x) * this.options.viewport.pixelsPerMillimeter,
			'height': (point2.y - point1.y) * this.options.viewport.pixelsPerMillimeter	
		};
	}
});