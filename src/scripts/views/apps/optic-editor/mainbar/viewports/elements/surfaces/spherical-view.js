/******************************************************************************\
|                                                                              |
|                                spherical-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the class definition of a view of spherical lens surface.     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SurfaceView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/surface-view.js';
import SphericalAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/surfaces/spherical-annotation-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default SurfaceView.extend({

	//
	// attributes
	//

	tagName: 'path',
	className: 'spherical surface',

	//
	// constructor
	//

	initialize: function(options) {

		// set optional parameter defaults
		//
		if (this.options.highAccuracy == undefined) {
			this.options.highAccuracy = true;
		}

		// call superclass method
		//
		SurfaceView.prototype.initialize.call(this, options);
	},

	//
	// getting methods
	//
	
	getSurfaceOffset: function() {
		switch (this.model.index) {

			// first surface
			//
			case 0:
				return 0;

			// second surface
			//
			case 1:
				if (this.model.isConcave()) {
					if (this.options.parent.model.front.isConvex()) {
						return -this.model.thickness;
					} else {
						return this.options.parent.model.getMaxThickness() - this.options.parent.model.getCenterThickness() - this.model.thickness;
					}
				} else {
					return this.options.parent.model.getMaxThickness() - this.options.parent.model.getCenterThickness() - this.model.thickness;
				}
		}
	},

	getOffset: function() {
		let offset = new Vector2(this.getSurfaceOffset(), 0);
		if (this.options.parent) {
			offset.add(this.options.parent.options.offset);
		}
		if (this.options.offset) {
			offset.add(this.options.offset);				
		}
		return offset;
	},

	getCurvature: function() {
		return this.model.radius * this.model.radius / this.model.radius_of_curvature;
	},

	getCenterOfCurvature: function() {
		let offset = this.getOffset();
		let centerOfCurvature;

		if (this.model.radius_of_curvature > 0) {
			centerOfCurvature = new Vector2(this.model.radius_of_curvature, 0);
		} else {
			centerOfCurvature = new Vector2(this.model.radius_of_curvature + this.model.thickness, 0);
		}

		return centerOfCurvature.plus(offset);
	},

	getPoints: function() {
		let offset = this.getOffset();
		let curvature = this.getCurvature();
		let top, bottom, center_of_curvature;

		if (this.model.radius_of_curvature > 0) {
			top = new Vector2(this.model.thickness, this.model.radius);
			bottom = new Vector2(this.model.thickness, -this.model.radius);
			curvature = new Vector2(curvature, 0);
			center_of_curvature = new Vector2(this.model.radius_of_curvature, 0);
		} else {
			top = new Vector2(0, this.model.radius);
			bottom = new Vector2(0, -this.model.radius);
			curvature = new Vector2(curvature + this.model.thickness, 0);
			center_of_curvature = new Vector2(this.model.radius_of_curvature + this.model.thickness, 0);
		}
		
		return {
			top: top.plus(offset),
			bottom: bottom.plus(offset),
			curvature: curvature.plus(offset),
			center_of_curvature: center_of_curvature.plus(offset)
		}
	},

	getAnnotation: function() {
		return new SphericalAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// svg rendering methods
	//

	toDrawing: function(offset, clockwise, append) {

		// set arc parameters
		//
		let rx = this.model.radius_of_curvature;
		let ry = this.model.radius_of_curvature;
		let xAxisRotation = 0;
		let largeArcFlag = 0;
		let highAccuracy = this.options && this.options.highAccuracy;

		// find arc endpoints and sweep
		//
		let sign = (clockwise? 1 : -1);
		let x1, y1, x2, y2, sweepFlag;
		if (this.model.isConvex()) {
			x1 = this.model.thickness;
			y1 = -this.model.radius * sign;
			x2 = x1;
			y2 = this.model.radius * sign;
			sweepFlag = clockwise? 0 : 1;
		} else {
			x1 = -this.model.thickness;
			y1 = -this.model.radius * sign;
			x2 = x1;
			y2 = this.model.radius * sign;
			sweepFlag = clockwise? 1 : 0;
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
		rx = this.valueToString(rx);
		ry = this.valueToString(ry);
		x2 = this.valueToString(x2);
		y2 = this.valueToString(y2);

		if (!highAccuracy) {

			// create one arc
			//
			if (append) {
				return 'L ' + x1 + ' ' + y1 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x2 + ' ' + y2;
			} else {
				return 'M ' + x1 + ' ' + y1 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x2 + ' ' + y2;			
			}
		} else {

			// find center of arc
			//
			let x3 = x2;
			let y3 = y2;
			x2 = offset? offset.x : 0;
			y2 = 0;

			// convert to strings
			//
			x2 = this.valueToString(x2);

			// create two arcs
			//
			if (append) {					
				return 'L ' + x1 + ' ' + y1 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x2 + ' ' + y2 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x3 + ' ' + y3;
				
			} else {
				return 'M ' + x1 + ' ' + y1 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x2 + ' ' + y2 + ' A ' + rx + ' ' + ry + ' ' +
					xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' +
					x3 + ' ' + y3;	
			}	
		}
	},

	toEdge: function(offset, clockwise, append) {

		// find line endpoints
		//
		let sign = (clockwise? 1 : -1);
		let x1, y1, x2, y2;
		if (this.model.isConvex()) {
			x1 = this.model.thickness;
			y1 = -this.model.radius * sign;
			x2 = x1;
			y2 = this.model.radius * sign;
		} else {
			x1 = -this.model.thickness;
			y1 = -this.model.radius * sign;
			x2 = x1;
			y2 = this.model.radius * sign;
		}

		// add optional offset
		//
		if (offset) {
			x1 += offset.x;
			y1 += offset.y;
			x2 += offset.x;
			y2 += offset.y;
		}

		// convert to strings
		//
		x1 = this.valueToString(x1);
		y1 = this.valueToString(y1);
		x2 = this.valueToString(x2);
		y2 = this.valueToString(y2);

		if (append) {
			return 'L ' + x1 + ' ' + y1  + ' L ' + x2 + ' ' + y2;
		} else {
			return 'M ' + x1 + ' ' + y1  + ' L ' + x2 + ' ' + y2;			
		}	
	}
});