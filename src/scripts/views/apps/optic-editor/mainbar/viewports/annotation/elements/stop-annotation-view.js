/******************************************************************************\
|                                                                              |
|                              stop-annotation-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of lens elements.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import ElementAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/element-annotation-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import MarkerView from '../../../../../../../views/svg/shapes/marker-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../utilities/math/units.js';

export default ElementAnnotationView.extend({

	//
	// attributes
	//

	className: 'stop annotation',

	//
	// getting methods
	//

	getModels: function() {
		let xOffset = this.getXOffset();

		// create models
		//
		return _.extend(ElementAnnotationView.prototype.getModels.call(this), {

			// stop geometry
			//
			aperture: new Line({
				point1: new Vector2(xOffset, this.model.aperture / 2),
				point2: new Vector2(xOffset, -this.model.aperture / 2),
			}),

			// markers
			//
			top_diameter: new Point({
				location: new Vector2(xOffset, -this.model.diameter / 2)
			}),
			top_aperture: new Point({
				location: new Vector2(xOffset, -this.model.aperture / 2)
			}),
			bottom_aperture: new Point({
				location: new Vector2(xOffset, this.model.aperture / 2)
			}),
			bottom_diameter: new Point({
				location: new Vector2(xOffset, this.model.diameter / 2)
			})
		});
	},

	getViews: function() {

		// create views
		//
		return _.extend(ElementAnnotationView.prototype.getViews.call(this), {

			// stop geometry
			//
			aperture: new DimensioningLineView({
				model: this.models.aperture,
				className: 'aperture dimensioning double arrow',
				text: 'd=',
				viewport: this.options.viewport,
				offset: true
			}),

			// stop markers
			//
			top_diameter: new MarkerView({
				title: _.result(this, 'title'),
				icon: this.handle_icon,
				model: this.models.top_diameter,
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				ondrag: (point) => {
					let radius = Math.max(0, -point.y);

					// check if diameter is greater than aperture
					//
					if (radius > this.model.aperture / 2) {
						this.model.set('diameter', new Units(radius * 2, 'mm'));

					// snap diameter to aperture
					//
					} else if (this.model.diameter != this.model.aperture) {
						this.model.set('diameter', new Units(this.model.aperture, 'mm'));
						this.onSnap();
					}
				},
				constrain: (point) => {

					// make sure that diameter is larger than aperture
					//
					if (point.y > -this.model.aperture / 2) {
						point.y = -this.model.aperture / 2;
					}
					return point;
				}
			}),
			top_aperture: new MarkerView({
				title: _.result(this, 'title'),
				icon: this.handle_icon,
				model: this.models.top_aperture,
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				ondrag: (point) => {
					let radius = Math.max(0, -point.y);

					// check if aperture is less than diameter
					//
					if (radius > 0 && radius < this.model.radius) {
						this.model.set('aperture', new Units(radius * 2, 'mm'));

					// snap aperture to zero
					//
					} else if (radius == 0 && this.model.aperture != 0) {
						this.model.set('aperture', new Units(0, 'mm'));
						this.onSnap();

					// snap aperture to diameter
					//
					} else if (radius != 0 && this.model.aperture != this.model.diameter) {
						this.model.set('aperture', new Units(this.model.diameter, 'mm'));
						this.onSnap();
					}
				},
				constrain: (point) => {
					if (point.y > 0) {
						point.y = 0;
					}

					// constrain point to radius
					//
					if (point.y < -this.model.radius) {
						point.y = -this.model.radius;
					}
					return point;
				}
			}),
			bottom_aperture: new MarkerView({
				title: _.result(this, 'title'),
				icon: this.handle_icon,
				model: this.models.bottom_aperture,
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				ondrag: (point) => {
					let radius = Math.max(0, point.y);

					// check if aperture is less than diameter
					//
					if (radius > 0 && radius < this.model.radius) {
						this.model.set('aperture', new Units(radius * 2, 'mm'));

					// snap aperture to zero
					//
					} else if (radius == 0 && this.model.aperture != 0) {
						this.model.set('aperture', new Units(0, 'mm'));
						this.onSnap();

					// snap aperture to diameter
					//
					} else if (radius != 0 && this.model.aperture != this.model.diameter) {
						this.model.set('aperture', new Units(this.model.diameter, 'mm'));
						this.onSnap();
					}
				},
				constrain: (point) => {
					if (point.y < 0) {
						point.y = 0;
					}

					// constrain point to radius
					//
					if (point.y > this.model.radius) {
						point.y = this.model.radius;
					}
					return point;
				}
			}),
			bottom_diameter: new MarkerView({
				title: _.result(this, 'title'),
				icon: this.handle_icon,
				model: this.models.bottom_diameter,
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				ondrag: (point) => {
					let radius = Math.max(0, point.y);

					// check if diameter is greater than aperture
					//
					if (radius > this.model.aperture / 2) {
						this.model.set('diameter', new Units(radius * 2, 'mm'));

					// snap diameter to aperture
					//
					} else if (this.model.diameter != this.model.aperture) {
						this.model.set('diameter', new Units(this.model.aperture, 'mm'));
						this.onSnap();
					}
				},
				constrain: (point) => {

					// make sure that diameter is larger than aperture
					//
					if (point.y < this.model.aperture / 2) {
						point.y = this.model.aperture / 2;
					}
					return point;
				}
			})
		});
	},

	//
	// setting methods
	//

	setOffset: function(offset) {
		this.models.aperture.set({
			offset: offset
		});
	},

	setAperture: function(aperture) {

		// compute offsets
		//
		let xOffset = this.getXOffset();

		// update aperture
		//
		this.models.aperture.set({
			point1: new Vector2(xOffset, aperture / 2),
			point2: new Vector2(xOffset, -aperture / 2),
		});

		// update markers
		//
		this.models.top_aperture.set('location', new Vector2(xOffset, aperture / 2));
		this.models.bottom_aperture.set('location', new Vector2(xOffset, -aperture / 2));
	},

	setDiameter: function(diameter) {

		// compute offsets
		//
		let xOffset = this.getXOffset();

		// update diameter
		//
		this.models.diameter.set({
			point1: new Vector2(xOffset, diameter / 2),
			point2: new Vector2(xOffset, -diameter / 2),
		});

		// update markers
		//
		this.models.top_diameter.set('location', new Vector2(xOffset, diameter / 2));
		this.models.bottom_diameter.set('location', new Vector2(xOffset, -diameter / 2));
	},

	//
	// rendering methods
	//

	update: function() {
		let xOffset = this.getXOffset();

		// call superclass method
		//
		ElementAnnotationView.prototype.update.call(this);

		// update aperture
		//
		this.models.aperture.set({
			point1: new Vector2(xOffset, this.model.aperture / 2),
			point2: new Vector2(xOffset, -this.model.aperture / 2),
		});

		// update markers
		//
		this.models.top_diameter.set({
			location: new Vector2(xOffset, -this.model.diameter / 2)
		});
		this.models.top_aperture.set({
			location: new Vector2(xOffset, -this.model.aperture / 2)
		});
		this.models.bottom_aperture.set({
			location: new Vector2(xOffset, this.model.aperture / 2)
		});
		this.models.bottom_diameter.set({
			location: new Vector2(xOffset, this.model.diameter / 2)
		});
	}
});