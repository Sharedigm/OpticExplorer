/******************************************************************************\
|                                                                              |
|                                  surfaces.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a collection of optical surfaces.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Surface from '../../../../models/optics/elements/surfaces/surface.js';
import BaseCollection from '../../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Surface,

	//
	// querying methods
	//

	getAperture: function() {
		return this.at(0).radius * 2;
	},

	getLength: function() {

		// compute length of elements
		//
		let length = 0;
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);

			switch (model.getKind()) {
				case 'front':
					length += this.parent.thickness;
					break;
				case 'back':
					if (this.parent.spacing) {
						length += this.parent.spacing;
					}
					break;
			}
		}

		return length;
	},

	getRadius: function() {
		let radius = 0;

		// find max element radius
		//
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).radius > radius) {
				radius = this.at(i).radius;
			}
		}

		return radius;
	},

	next: function(surface) {
		return this.at(this.indexOf(surface) + 1);
	}
});