/******************************************************************************\
|                                                                              |
|                                    rect.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic rectangle shape.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
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
		return (this.get('point1').plus(this.get('point2'))).scaledBy(0.5);
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

	getDiagonal: function() {
		return this.get('point2').minus(this.get('point1'));
	},
});