/******************************************************************************\
|                                                                              |
|                                  objects.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of optics objects.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseCollection from '../../../collections/base-collection.js';
import BaseObject from '../../../models/optics/objects/base-object.js';
import SceneObject from '../../../models/optics/objects/scene-object.js';
import DistantObject from '../../../models/optics/objects/distant-object.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: BaseObject
}, {

	//
	// static methods
	//

	parseObject: function(object) {
		let kind = object.angle? 'distant' : 'scene';
		switch (kind) {
			case 'scene':
				return SceneObject.parse(object);
			case 'distant':
				return DistantObject.parse(object);
		}
	},

	parse: function(objects) {
		let array = [];
		if (objects) {
			for (let i = 0; i < objects.length; i++) {
				array.push(this.parseObject(objects[i]));
			}
		}
		return new this.prototype.constructor(array);
	},
});