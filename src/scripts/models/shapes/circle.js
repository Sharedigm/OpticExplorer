/******************************************************************************\
|                                                                              |
|                                 circle.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic circle shape.              |
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

	getWidth: function() {
		return this.get('radius') * 2;
	},

	getHeight: function() {
		return this.get('radius') * 2;
	},

	getMin: function() {
		let center = this.get('center');
		let radius = this.get('radius');
		return new Vector2(center.x - radius, center.y - radius);
	},

	getMax: function() {
		let center = this.get('center');
		let radius = this.get('radius');
		return new Vector2(center.x + radius, center.y + radius);
	},

	getBounds: function() {
		return new Bounds2(this.getMin(), this.getMax());
	}
});