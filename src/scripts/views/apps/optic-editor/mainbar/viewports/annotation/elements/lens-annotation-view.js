/******************************************************************************\
|                                                                              |
|                              lens-annotation-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of lens elements.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../../../models/base-model.js';
import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import ElementAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/element-annotation-view.js';
import LineView from '../../../../../../../views/svg/shapes/line-view.js';
import AxisView from '../../../../../../../views/svg/shapes/axis-view.js';
import MarkerView from '../../../../../../../views/svg/shapes/marker-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import FocalPointAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/focal-point-annotation-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../utilities/math/units.js';

export default ElementAnnotationView.extend({

	//
	// attributes
	//

	className: 'lens annotation',

	//
	// getting methods
	//

	getModels: function() {
		if (this.model.isPlanar()) {
			return this.getPlanarModels();
		} else {
			return this.getNonPlanarModels();
		}
	},

	getPlanarModels: function() {
		let xOffset = this.getXOffset();

		// create models
		//
		return _.extend(ElementAnnotationView.prototype.getModels.call(this), {

			// lens geometry
			//
			thickness: new Line({
				point1: new Vector2(xOffset, 0),
				point2: new Vector2(xOffset + this.model.thickness, 0),
			})
		});
	},

	getNonPlanarModels: function() {
		let xOffset = this.getXOffset();
		let yOffset = this.getYOffset();

		// compute optical parameters
		//
		let principalObjectPlaneDistance = this.model.getPrincipalPlaneDistance('front');
		let principalImagePlaneDistance = this.model.getPrincipalPlaneDistance('back');
		let radius = this.model.getMinRadius();

		// check for degenerate cases
		//
		if (!principalObjectPlaneDistance) {
			principalObjectPlaneDistance = 0;
		}
		if (!principalImagePlaneDistance) {
			principalImagePlaneDistance = 0;
		}
		
		// create models
		//
		return _.extend(ElementAnnotationView.prototype.getModels.call(this), {

			// principal points
			//
			front_principal_point: new Point({
				location: new Vector2(xOffset - principalObjectPlaneDistance, 0)
			}),
			back_principal_point: new Point({
				location: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, 0)
			}),

			// focal points
			//
			front_focal_point: new BaseModel({
				surface: this.model.front,
				distance: -principalObjectPlaneDistance,
				offset: xOffset,
			}),
			back_focal_point: new BaseModel({
				surface: this.model.back,
				distance: principalImagePlaneDistance,
				offset: xOffset + this.model.thickness,
			}),

			// lens geometry
			//
			thickness: new Line({
				point1: new Vector2(xOffset, 0),
				point2: new Vector2(xOffset + this.model.thickness, 0),
			}),

			// lines
			//
			top_line: new Line({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, radius),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, radius)
			}),
			bottom_line: new Line({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, -radius),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, -radius)
			}),

			// hiatus
			//
			hiatus: new Line({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, yOffset),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, yOffset)
			})
		});
	},

	getViews: function() {
		if (this.model.isPlanar()) {
			return this.getPlanarViews();
		} else {
			return this.getNonPlanarViews();
		}
	},

	getPlanarViews: function() {

		// create views
		//
		return _.extend(ElementAnnotationView.prototype.getViews.call(this), {

			// lens geometry
			//
			thickness: new DimensioningLineView({
				model: this.models.thickness,
				className: 'thickness dimensioning double arrow',
				text: 'd=',
				length: this.model.get('thickness'),
				viewport: this.options.viewport
			})
		});
	},

	getNonPlanarViews: function() {
		let focusType = this.model.front.getFocusType();
		let elementIndex = this.model.getIndex() || 0;

		// compute offsets
		//
		let yOffset = this.getYOffset();

		// create views
		//
		let views = _.extend(ElementAnnotationView.prototype.getViews.call(this), {

			// lens geometry
			//
			thickness: new DimensioningLineView({
				model: this.models.thickness,
				className: 'thickness dimensioning double arrow',
				text: 't=',
				length: this.model.get('thickness'),
				viewport: this.options.viewport
			}),

			// markers
			//
			back: new MarkerView({
				icon: this.handle_icon,
				model: this.models.back,
				title: "Thickness" + (elementIndex + 1),
				viewport: this.options.viewport,
				draggable: true,
				direction: 'horizontal',

				// callbacks
				//
				ondrag: (point) => {
					let xOffset = this.getXOffset();
					let distance = point.x - xOffset;
					let minThickness = this.model.getMinThickness();

					// check if distance is greater than min thickness
					//
					if (Math.abs(distance - minThickness) > Math.epsilon) {
						this.set('thickness', new Units(distance, 'mm'));

					// snap to min thickness
					//
					} else if (this.model.thickness != minThickness) {
						this.set('thickness', new Units(minThickness, 'mm'));
						this.onSnap();
					}
				},
				constrain: (point) => {
					let xOffset = this.getXOffset();
					let minThickness = this.model.getMinThickness();

					// constrain point to right of thickness
					//
					if (point.x - xOffset < minThickness) {
						point.x = xOffset + minThickness;
					}
					return point;
				}
			}),
		});

		// add focal points
		//
		if (this.models.front_focal_point.get('distance')) {
			views.front_focal_point = new FocalPointAnnotationView({
				model: this.models.front_focal_point,
				className: 'image focal point annotation',
				viewport: this.options.viewport,
				parent: this
			});
			views.front_principal_point = new AxisView({
				model: this.models.front_principal_point,
				className: 'principal plane ' + focusType + ' ' + AxisView.prototype.className,
				orientation: 'vertical',
				viewport: this.options.viewport
			});
		}
		if (this.models.back_focal_point.get('distance')) {
			views.back_focal_point = new FocalPointAnnotationView({
				model: this.models.back_focal_point,
				className: 'object focal point annotation',
				viewport: this.options.viewport,
				parent: this
			});
			views.back_principal_point = new AxisView({
				model: this.models.back_principal_point,
				className: 'principal plane ' + focusType + ' ' + AxisView.prototype.className,
				orientation: 'vertical',
				viewport: this.options.viewport
			});
		}

		// add connecting lines
		//
		if (this.models.front_focal_point.get('distance') &&
			this.models.back_focal_point.get('distance')) {
			views.hiatus = new DimensioningLineView({
				model: this.models.hiatus,
				className: 'principal plane ' + focusType + ' ' + DimensioningLineView.prototype.className,
				text: 'h=',
				vTextOffsetDirection: yOffset < 0? 'top' : 'bottom',
				viewport: this.options.viewport
			});
			views.top_line = new LineView({
				model: this.models.top_line,
				className: 'focal point ' + focusType + ' dimensioning ' + LineView.prototype.className,
				viewport: this.options.viewport
			});
			views.bottom_line = new LineView({
				model: this.models.bottom_line,
				className: 'focal point ' + focusType + ' dimensioning ' + LineView.prototype.className,
				viewport: this.options.viewport
			});
		}

		return views;
	},

	//
	// setting methods
	//

	setOffset: function(offset) {

		// update annotation
		//
		let x = offset? offset.x : 0;
		if (this.model.front.isConcave()) {
			x += this.model.front.thickness;
		}

		this.models.thickness.set({
			point1: new Vector2(x, 0),
			point2: new Vector2(x + this.model.thickness, 0)
		});
		if (this.model.spacing) {
			this.models.spacing.set({
				point1: new Vector2(x + this.model.thickness, 0),
				point2: new Vector2(x + this.model.thickness + this.model.spacing, 0)
			});
		}
		this.models.front_focal_point.set({
			offset: x
		});
		this.models.back_focal_point.set({
			offset: x + this.model.thickness
		});
	},

	//
	// rendering methods
	//

	update: function() {

		// compute optical parameters
		//
		let principalObjectPlaneDistance = this.model.getPrincipalPlaneDistance('front');
		let principalImagePlaneDistance = this.model.getPrincipalPlaneDistance('back');
		let radius = this.model.getMinRadius();
		
		// compute offsets
		//
		let xOffset = this.getXOffset();
		let yOffset = this.getYOffset();

		// call superclass method
		//
		ElementAnnotationView.prototype.update.call(this);

		// check for degenerate cases
		//
		if (!principalObjectPlaneDistance) {
			principalObjectPlaneDistance = 0;
		}
		if (!principalImagePlaneDistance) {
			principalImagePlaneDistance = 0;
		}

		// update points
		//
		this.models.back.set({
			location: new Vector2(xOffset + this.model.thickness, 0)
		});
		this.models.next.set({
			location: new Vector2(xOffset + this.model.thickness + (this.model.spacing || 0), 0)
		});

		// update thickness
		//
		this.models.thickness.set({
			point1: new Vector2(xOffset, 0),
			point2: new Vector2(xOffset + this.model.thickness, 0),
		});
		this.views.thickness.options.length = this.model.get('thickness');
		this.views.thickness.update();

		// update focal points and lines
		//
		if (!this.model.isPlanar()) {

			// update focal points
			//
			this.models.front_focal_point.set({
				surface: this.model.front,
				distance: -principalObjectPlaneDistance,
				offset: xOffset,
			});
			this.models.back_focal_point.set({
				surface: this.model.back,
				distance: principalImagePlaneDistance,
				offset: xOffset + this.model.thickness,
			});

			// update principal points
			//
			this.models.front_principal_point.set({
				location: new Vector2(xOffset - principalObjectPlaneDistance, 0)
			});
			this.models.back_principal_point.set({
				location: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, 0)
			});

			// update lines
			//
			this.models.top_line.set({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, radius),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, radius)
			});
			this.models.bottom_line.set({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, -radius),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, -radius)
			});

			// update hiatus
			//
			this.models.hiatus.set({
				point1: new Vector2(xOffset - principalObjectPlaneDistance, yOffset),
				point2: new Vector2(xOffset + this.model.thickness + principalImagePlaneDistance, yOffset)
			});
		}
	}
});