/******************************************************************************\
|                                                                              |
|                            element-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying annotations of optical elements.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import MarkerView from '../../../../../../../views/svg/shapes/marker-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../utilities/math/units.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'element annotation',

	//
	// getting methods
	//

	getXOffset: function() {
		return this.options.parent.options.offset? this.options.parent.options.offset.x : 0;
	},

	getYOffset: function() {
		return -this.model.getRadius() - 5 / this.options.viewport.scale;
	},

	//
	// model getting methods
	//

	getModels: function() {
		let index = this.model.getIndex() || 0;
		let thickness = this.model.thickness || 0;
		let spacing = this.model.spacing || 0;

		// compute offsets
		//
		let xOffset = this.getXOffset();

		let models = {
			front: new Point({
				location: new Vector2(xOffset, 0)
			}),
			back: new Point({
				location: new Vector2(xOffset + thickness, 0)
			}),
			next: new Point({
				location: new Vector2(xOffset + thickness + spacing, 0)
			}),
			spacing: new Line({
				point1: new Vector2(xOffset + thickness, 0),
				point2: new Vector2(xOffset + thickness + spacing, 0),
			})
		};

		// add prev spacing if not first element
		//
		if (index != 0) {
			let prev = this.model.prev();
			let prevSpacing = prev.spacing || 0;

			models.prev = new Point({
				location: new Vector2(xOffset - prevSpacing, 0)
			});
			models.prev_spacing = new Line({
				point1: new Vector2(xOffset - prevSpacing, 0),
				point2: new Vector2(xOffset, 0)
			});
		}

		return models;
	},

	getViews: function() {
		let index = this.model.getIndex() || 0;

		let views = {
			spacing: new DimensioningLineView({
				model: this.models.spacing,
				className: 'spacing dimensioning double arrow',
				text: 's=',
				length: this.model.get('spacing'),
				viewport: this.options.viewport
			}),
			next: new MarkerView({
				icon: this.handle_icon,
				model: this.models.next,
				title: "Spacing" + (index + 1),
				viewport: this.options.viewport,
				draggable: true,
				direction: 'horizontal',

				// callbacks
				//
				ondrag: (point) => {
					let xOffset = this.getXOffset();
					let thickness = this.model.thickness || 0;
					let distance = point.x - xOffset;
					let spacing = distance - thickness;

					// check if spacing is greater than zero
					//
					if (Math.abs(spacing) > Math.epsilon) {
						this.set('spacing', new Units(spacing, 'mm'));

					// snap to no spacing
					//
					} else if (this.model.spacing != 0) {
						this.set('spacing', new Units(0, 'mm'));
						this.onContact();
					}
				},
				constrain: (point) => {
					let xOffset = this.getXOffset();
					let thickness = this.model.thickness || 0;

					// constrain point to right of spacing
					//
					if (point.x - xOffset < thickness) {
						point.x = xOffset + thickness;
					}
					return point;
				}
			})
		};

		// add prev spacing
		//
		if (index != 0) {
			let prev = this.model.prev();

			views.prev_spacing = new DimensioningLineView({
				model: this.models.prev_spacing,
				className: 'spacing dimensioning double arrow',
				text: 's=',
				length: prev.get('spacing'),
				viewport: this.options.viewport
			});
			views.front = new MarkerView({
				icon: this.handle_icon,
				model: this.models.front,
				title: "Spacing" + index,
				viewport: this.options.viewport,
				draggable: true,
				direction: 'horizontal',

				// callbacks
				//
				ondrag: (point) => {
					let prev = this.model.prev();
					let xOffset = this.getXOffset();
					let prevSpacing = prev.spacing || 0;
					let distance = point.x - xOffset + prevSpacing;

					// check if distance is greater than zero
					//
					if (Math.abs(distance) > Math.epsilon) {
						this.setPrev('spacing', new Units(distance, 'mm'));

					// snap to no spacing
					//
					} else if (prev.spacing != 0) {
						this.setPrev('spacing', new Units(0, 'mm'));
						this.onContact();
					}
				},
				constrain: (point) => {
					let prev = this.model.prev();
					let xOffset = this.getXOffset();
					let prevSpacing = prev.spacing || 0;

					// constrain point to right
					//
					if (point.x < xOffset - prevSpacing) {
						point.x = xOffset - prevSpacing;
					}

					return point;
				}
			});
		}

		return views;
	},

	//
	// setting methods
	//

	set: function(key, value) {
		let elementsView = this.options.parent.options.parent;
		elementsView.animated = false;
		this.model.set(key, value);
		elementsView.animated = true;
	},

	setPrev: function(key, value) {
		let elementsView = this.options.parent.options.parent;
		elementsView.animated = false;
		this.model.prev().set(key, value);
		elementsView.animated = true;
		this.update();
	},

	//
	// updating methods
	//

	update: function() {
		let index = this.model.getIndex() || 0;
		let thickness = this.model.thickness || 0;
		let spacing = this.model.spacing || 0;
		let xOffset = this.getXOffset();

		// update prev point
		//
		if (index > 0 && this.models.prev) {
			let prev = this.model.prev();
			let prevSpacing = prev.spacing || 0;

			this.models.prev.set({
				location: new Vector2(xOffset - prevSpacing, 0)
			});	
		}

		// update points
		//
		this.models.front.set({
			location: new Vector2(xOffset, 0)
		});
		this.models.back.set({
			location: new Vector2(xOffset + this.model.thickness, 0)
		});
		this.models.next.set({
			location: new Vector2(xOffset + thickness + spacing, 0)
		});

		// update prev spacing
		//
		if (this.models.prev_spacing) {
			let prev = this.model.prev();
			let prevSpacing = prev? prev.spacing : 0;

			this.models.prev_spacing.set({
				point1: new Vector2(xOffset - prevSpacing, 0),
				point2: new Vector2(xOffset, 0)
			});
			this.views.prev_spacing.options.length = prev? prev.get('spacing') : 0;
			this.views.prev_spacing.update();
		}

		// update spacing
		//
		this.models.spacing.set({
			point1: new Vector2(xOffset + thickness, 0),
			point2: new Vector2(xOffset + thickness + spacing, 0),
		});
		this.views.spacing.options.length = this.model.get('spacing');
		this.views.spacing.update();

		// update visibility
		//
		if (this.model.get('hidden')) {
			this.hide();
		} else {
			this.show();
		}
	},

	//
	// event handling methods
	//

	onContact: function() {

		// play reorder sound
		//
		application.play('reorder');
	},

	onSnap: function() {

		// play tap sound
		//
		application.play('tap');
	}
});