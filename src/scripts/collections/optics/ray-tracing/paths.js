/******************************************************************************\
|                                                                              |
|                                    paths.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of an array of paths.                          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

//
// constructor
//

function Paths() {

	// extend array type
	//
	let array = [];
	array.push.apply(array, arguments);
	array.__proto__ = Paths.prototype;
	
	return array;
}

//
// extend prototype from "superclass"
//

Paths.prototype = _.extend(new Array(), {

	//
	// attributes
	//

	t_max: 1.0e6,

	//
	// querying methods
	//

	getObstructed: function() {
		return this.filter(function (element) {
			return element.obstructed
		});
	},

	getUnobstructed: function() {
		return this.filter(function (element) {
			return !element.obstructed;
		});
	},

	//
	// methods
	//

	extendBy: function(rays, extension1, extension2) {
		let reflectedPaths = [];

		for (let i = 0; i < this.length; i++) {
			let path = this[i];
			if (rays[i]) {

				// extend non-reflected paths
				//
				if (!path.reflected) {
					if (!path.obstructed && !path.projected) {
						let direction = rays[i].direction.scaledTo(extension1);
						let point1 = path[path.length - 1];
						let point2 = point1.plus(direction);
						this[i].push(point2);
					}

				// extend reflected paths
				//
				} else {
					let direction = rays[i].direction.scaledTo(extension2);
					let point1 = path[path.length - 1];
					let point2 = point1.plus(direction);
					let reflectedPath = [point1, point2];
					reflectedPath.reflected = true;
					reflectedPaths.push(reflectedPath);
				}
			}
		}

		// add in new reflected paths
		//
		if (reflectedPaths.length > 0) {
			for (let i = 0; i < reflectedPaths.length; i++) {
				this.push(reflectedPaths[i]);
			}
		}

		// flag paths as being extended past the focus point
		//
		this.extended = true;
	},

	next: function(i, filter) {
		if (!this.length) {
			return;
		}

		// get next path
		//
		while (!this[i] || (filter && !filter(this[i]))) {
			i++;
			if (i == this.length) {
				return null;
			}
		}
		return i;
	},

	prev: function(i, filter) {
		if (!this.length) {
			return;
		}

		// get prev path
		//
		while (!this[i] || (filter && !filter(this[i]))) {
			i--;
			if (i < 0) {
				return null;
			}
		}
		return i;
	},

	getFocii: function(rays, extension) {
		let focii = [];

		// find focus of rays
		//
		if (rays.length > 1) {
			let min = 0;
			let max = rays.length - 1;
			let lastT = undefined;
			while (min < max) {

				// move path min and max inward
				//
				min = this.next(min, function(path) {
					return path.transmitted && !path.obstructed && !path.reflected;
				});
				max = this.prev(max, function(path) {
					return path.transmitted && !path.obstructed && !path.reflected;
				});

				/*
				// extend reflected rays
				//
				while (min < max && this[min].reflected) {
					let ray = rays[min];
					if (ray) {
						ray.location = this[min][this[min].length - 1];

						// extend reflected ray paths
						//
						this[min].push(ray.location.plus(ray.direction.normalized().scaledBy(extension)));
					}
					min++;
				}
				while (max > min && this[max].reflected) {
					let ray = rays[max];
					if (ray) {
						ray.location = this[max][this[max].length - 1];

						// extend reflected ray paths
						//
						this[max].push(ray.location.plus(ray.direction.normalized().scaledBy(extension)));
					}
					max--;
				}
				*/

				if ((min != null) && (max != null) && (min < max)) {

					// find intersections of min and max
					//
					let ray1 = rays[min];
					let ray2 = rays[max];
					ray1.location = this[min][this[min].length - 1];
					ray2.location = this[max][this[max].length - 1];

					// compute focus
					//
					let t1 = ray1.intersect(ray2);
					let t2 = ray2.intersect(ray1);

					// extend ray paths
					//
					if (Math.abs(t1) < this.t_max & Math.abs(t2) < this.t_max) {
						let focus = ray1.location.plus(ray1.direction.scaledBy(t1));

						// add focus
						//
						focii.push(focus);

						if (t1 > 0 && t2 > 0) {

							// extend paths to focus
							//
							if (!this[min].projected) {
								this[min].push(focus);
							}
							if (!this[max].projected) {
								this[max].push(focus);
							}
							lastT = t1;
						} else {

							// extend diverging ray paths
							//
							if (!this[min].projected) {
								this[min].push(ray1.location.plus(ray1.direction.normalized().scaledBy(extension)));
							}
							if (!this[max].projected) {
								this[max].push(ray2.location.plus(ray2.direction.normalized().scaledBy(extension)));
							}
							lastT = extension;
						}
					}
				}

				min++;
				max--;
			}

			// push last odd focus point
			//
			if (min == max && lastT && rays[min]) {
				let ray = rays[min];
				ray.location = this[min][this[min].length - 1];
				if (!this[min].projected) {
					this[min].push(ray.location.plus(ray.direction.normalized().scaledBy(Math.abs(lastT))));
				}
			}
		}
		return focii;
	},

	getFocus: function(focii, which) {
		if (focii.length == 0) {
			return;
		}

		switch (which || 'marginal') {
			case 'marginal':
				return focii[0];
			case 'average': {
				let focus = this.focii[0].clone();
				for (let i = 1; i < this.focii.length; i++) {
					focus.add(this.focii[i]);
				}
				focus.scaleBy(1 / this.focii.length);
				return focus;
			}
			case 'paraxial':
			default:
				return focii[focii.length - 1];
		}
	},

	focusTo: function(rays, extension) {
		this.focii = this.getFocii(rays, extension);
		this.focus = this.getFocus(this.focii);
	}
});

export default Paths;