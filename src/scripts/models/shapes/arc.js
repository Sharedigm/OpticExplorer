/******************************************************************************\
|                                                                              |
|                                    arc.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic arc shape.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// getting methods
	//

	getAngle: function(options) {

		// get model attributes
		//
		let point1 = this.get('point1');
		let point2 = this.get('point2');
		let center = this.get('center');

		if (options && options.center) {
			center = options.center;
		}

		if (!point1 || !point2 || !center) {
			return;
		}

		// find direction vectors
		//
		let vector1 = point1.minus(center);
		let vector2 = point2.minus(center);

		// compute angle
		//
		return vector1.angleTo(vector2, options);
	},

	getRadius: function() {
		return (this.get('point1').minus(this.get('center'))).length();
	},


	getMidpoint: function() {
		let point1 = this.get('point1');
		let point2 = this.get('point2');
		
		if (!point1 || !point2) {
			return;
		}

		let direction = point2.minus(point1);
		return point1.plus(direction.scaledBy(0.5));
	},

	getCenterOfCurvature: function() {
		let center = this.get('center');
		let point1 = this.get('point1');
		let point2 = this.get('point2');

		if (!center || !point1 || !point2) {
			return;
		}

		let chord = point2.minus(point1);
		let midpoint = point1.plus(chord.scaledBy(0.5));
		let chordLength = chord.length();
		let radius = Math.max(this.getRadius(), chordLength / 2);
		let perpendicular;
		
		if (chordLength != 0) {
			perpendicular = chord.toPerpendicular().towards(midpoint.minus(center));
		} else {
			perpendicular = midpoint.minus(center);
		}

		if (perpendicular.length() != 0) {
			perpendicular.normalize();
		}

		let distance = Math.sqrt(radius ** 2  - (chordLength / 2) ** 2);
		return midpoint.minus(perpendicular.scaledBy(distance));
	},

	getMiddle: function() {
		let center = this.get('center');
		let point1 = this.get('point1');
		let point2 = this.get('point2');

		if (!center|| !point1 || !point2) {
			return;
		}

		let chord = point2.minus(point1);
		let midpoint = point1.plus(chord.scaledBy(0.5));
		let chordLength = chord.length();
		let radius = Math.max(this.getRadius(), chordLength / 2);
		let perpendicular;
		
		if (chordLength != 0) {
			perpendicular = chord.toPerpendicular().towards(midpoint.minus(center));
		} else {
			perpendicular = midpoint.minus(center);
		}

		if (perpendicular.length() != 0) {
			perpendicular.normalize();
		}

		let distance = radius - Math.sqrt(radius ** 2 - (chordLength / 2) ** 2);
		return midpoint.plus(perpendicular.scaledBy(distance));
	},

	getLength: function() {
		return this.get('point2').minus(this.get('point1')).length();
	},

	getWidth: function() {
		return Math.abs(this.get('point2').x - this.get('point1').x);
	},

	getHeight: function() {
		return Math.abs(this.get('point2').y - this.get('point1').y);
	}
});