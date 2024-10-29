/******************************************************************************\
|                                                                              |
|                                    line.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic line shape.                |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';
import Vector2 from '../../utilities/math/vector2.js';
import Bounds2 from '../../utilities/bounds/bounds2.js';

export default BaseModel.extend({

	//
	// getting methods
	//

	getCenter: function() {
		return (this.get('point1').plus(this.get('point2'))).scaledBy(0.5);
	},

	getLength: function() {
		return this.get('point2').minus(this.get('point1')).length();
	},

	getWidth: function() {
		return Math.abs(this.get('point2').x - this.get('point1').x);
	},

	getHeight: function() {
		return Math.abs(this.get('point2').y - this.get('point1').y);
	},

	getMin: function() {
		let point1 = this.get('point1');
		let point2 = this.get('point2');
		return new Vector2(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
	},

	getMax: function() {
		let point1 = this.get('point1');
		let point2 = this.get('point2');
		return new Vector2(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
	},

	getBounds: function() {
		return new Bounds2(this.getMin(), this.getMax());
	},

	getAngle: function(options) {

		// get model attributes
		//
		let point1 = this.get('point1');
		let point2 = this.get('point2');

		// compute angle
		//
		let vector = point2.minus(point1);
		let angle = Math.atan2(vector.y, vector.x);

		// convert angle to -90 to 90
		//
		if (angle < Math.PI / 2) {
			angle += Math.PI;
		}
		if (angle > Math.PI / 2) {
			angle -= Math.PI;
		}

		// convert to degrees
		//
		if (!options || options && options.units == 'degrees') {
			angle *= 180 / Math.PI;
		}

		return angle;
	}
});