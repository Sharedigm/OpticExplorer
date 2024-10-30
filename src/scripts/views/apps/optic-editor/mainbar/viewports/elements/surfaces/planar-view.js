/******************************************************************************\
|                                                                              |
|                                  planar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the class definition of a view of of planar lens surface.     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SurfaceView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/surface-view.js';
import PlanarAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/surfaces/planar-annotation-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default SurfaceView.extend({

	//
	// attributes
	//

	tagName: 'path',
	className: 'planar surface',

	//
	// getting methods
	//

	getOffset: function() {
		let offset = new Vector2(0, 0);
		if (this.options.parent) {
			offset.add(this.options.parent.options.offset);
		}
		if (this.options.offset) {
			offset.add(this.options.offset);				
		}
		return offset;
	},

	getAnnotation: function() {
		return new PlanarAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// svg rendering methods
	//

	toDrawing: function(offset, clockwise, append) {
		let x1, y1, x2, y2;

		if (clockwise) {
			x1 = 0;
			y1 = -this.model.radius;
			x2 = 0;
			y2 = this.model.radius;
		} else {
			x1 = 0;
			y1 = this.model.radius;
			x2 = 0;
			y2 = -this.model.radius;
		}

		// add optional offset
		//
		if (offset) {
			x1 += offset.x;
			y1 += offset.y;
			x2 += offset.x;
			y2 += offset.y;
		}

		// convert values to strings
		//
		x1 = this.valueToString(x1);
		y1 = this.valueToString(y1);
		x2 = this.valueToString(x2);
		y2 = this.valueToString(y2);

		// create line
		//
		if (append) {
			return 'L ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
		} else {
			return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;			
		}
	}
});