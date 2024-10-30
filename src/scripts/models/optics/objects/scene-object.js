/******************************************************************************\
|                                                                              |
|                               scene-object.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a light emitting object in the scene.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseObject from '../../../models/optics/objects/base-object.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Ray2 from '../../../utilities/math/ray2.js';
import Units from '../../../utilities/math/units.js';

export default BaseObject.extend({

	//
	// querying methods
	//

	hasChanged: function(attribute) {
		if (attribute == 'location') {

			// check location
			//
			return this.hasChanged('distance') || this.hasChanged('offset');
		} else {

			// call superclass method
			//
			return BaseObject.prototype.hasChanged.call(this, attribute); 			
		}
	},

	//
	// getting methods
	//

	get: function(attribute) {
		if (attribute == 'location') {

			// compute location
			//
			let distance = this.has('distance')? this.get('distance').in('mm') : 0;
			let offset = this.has('offset')? this.get('offset').in('mm') : 0;
			return new Vector2(-distance, -offset);
		} else {

			// call superclass method
			//
			return BaseObject.prototype.get.call(this, attribute); 
		}
	},

	getRays: function(point, points) {
		let rays = [];

		// create rays from point to points
		//
		for (let i = 0; i < points.length; i++) {
			let direction = points[i].minus(point).normalized();
			rays[i] = new Ray2(point, direction);
		}

		return rays;
	},

	//
	// setting methods
	//

	moveTo: function(location) {
		let distance = new Units(-location.x, 'mm');
		let offset = new Units(-location.y, 'mm');

		// update model
		//
		this.set({
			distance: distance.like(this.get('distance')),
			offset: offset.like(this.get('offset'))
		})
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditSceneObjectDialogView();
	},

	//
	// converting methods
	//

	toObject: function() {
		let object = {
			kind: this.get('kind'),
			distance: this.get('distance').toString(),
			height: this.get('height').toString()
		};

		// add optional attributes
		//
		if (this.has('offset')) {
			object.offset = this.get('offset').toString();
		}
		if (this.has('color')) {
			object.color = '"' + this.get('color') + '"';
		}

		return object;
	}
}, {

	//
	// static methods
	//

	parse: function(object) {
		return new this.prototype.constructor({
			kind: object.kind,
			distance: Units.parse(object.distance), 
			height: Units.parse(object.height), 
			offset: Units.parse(object.offset),
			color: object.color
		});
	}
});