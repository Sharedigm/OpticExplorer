/******************************************************************************\
|                                                                              |
|                                     path.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic path shape.                |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';
import Vector2 from '../../utilities/math/vector2.js';
import Bounds2 from '../../utilities/bounds/bounds2.js';

export default BaseModel.extend({

	//
	// querying methods
	//

	getCenter: function() {
		return (this.getMin().plus(this.getMax())).scaledBy(0.5);
	},

	getLength: function() {
		let vertices = this.get('vertices');
		let length = 0;
		for (let i = 0; i < vertices.length - 1; i++) {
			length += (vertices[i + 1].minus(vertices[i])).length();
		}
		return length;
	},

	getWidth: function() {
		let vertices = this.get('vertices');
		let xmin, xmax;
		for (let i = 0; i < vertices.length; i++) {
			let x = vertices[i].x;
			if (xmin == undefined) {
				xmin = x;
			} else if (x < xmin) {
				xmin = x;
			}
			if (xmax == undefined) {
				xmax = x;
			} else if (x > xmax) {
				xmax = x;
			}
		}
		return xmax - xmin;
	},

	getHeight: function() {
		let vertices = this.get('vertices');
		let ymin, ymax;
		for (let i = 0; i < vertices.length; i++) {
			let y = vertices[i].y;
			if (ymin == undefined) {
				ymin = y;
			} else if (y < ymin) {
				ymin = y;
			}
			if (ymax == undefined) {
				ymax = y;
			} else if (y > ymax) {
				ymax = y;
			}
		}
		return ymax - ymin;		
	},

	getMin: function() {
		let vertices = this.get('vertices');
		let xmin, ymin;
		for (let i = 0; i < vertices.length; i++) {
			let x = vertices[i].x;
			let y = vertices[i].y;
			if (xmin == undefined) {
				xmin = x;
			} else if (x < xmin) {
				xmin = x;
			}
			if (ymin == undefined) {
				ymin = y;
			} else if (y < ymin) {
				ymin = y;
			}
		}
		return new Vector2(xmin, ymin);
	},

	getMax: function() {
		let vertices = this.get('vertices');
		let xmax, ymax;
		for (let i = 0; i < vertices.length; i++) {
			let x = vertices[i].x;
			let y = vertices[i].y;
			if (xmax == undefined) {
				xmax = x;
			} else if (x > xmax) {
				xmax = x;
			}
			if (ymax == undefined) {
				ymax = y;
			} else if (y < ymax) {
				ymax = y;
			}
		}
		return new Vector2(xmax, ymax);
	},

	getBounds: function() {
		return new Bounds2(this.getMin(), this.getMax());
	}
});