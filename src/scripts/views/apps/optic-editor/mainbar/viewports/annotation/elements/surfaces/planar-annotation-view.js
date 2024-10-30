/******************************************************************************\
|                                                                              |
|                             planar-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying annotations of a planar surface.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../../models/shapes/line.js';
import SurfaceAnnotationView from '../../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/surfaces/surface-annotation-view.js';
import DimensioningLineView from '../../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import MarkerView from '../../../../../../../../views/svg/shapes/marker-view.js';
import Vector2 from '../../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../../utilities/math/units.js';

export default SurfaceAnnotationView.extend({

	//
	// attributes
	//

	className: 'planar surface annotation',

	//
	// getting methods
	//

	getModels: function() {
		let xOffset = this.getXOffset();

		return {
			top: new Point({
				location: new Vector2(xOffset, this.model.radius)
			}),
			bottom: new Point({
				location: new Vector2(xOffset, -this.model.radius)
			}),
			line: new Line({
				point1: new Vector2(xOffset, this.model.radius),
				point2: new Vector2(xOffset, -this.model.radius)
			})
		};
	},

	getViews: function() {
		return {

			// dimensioning lines
			//
			line: new DimensioningLineView({
				model: this.models.line,
				viewport: this.options.viewport
			}),

			// markers
			//
			top: new MarkerView({
				icon: this.handle_icon,
				model: this.models.top,
				title: "Edge",
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				constrain: (point) => {
					let oppositeSurface = this.model.getOpposite();

					// limit by opposite surface's radius
					//
					if (oppositeSurface.radius_of_curvature) {
						let side = this.model.getSide();

						if (side == 'front' && oppositeSurface.isConcave() ||
							side == 'back' && oppositeSurface.isConvex()) {
							let maxRadius = oppositeSurface.getMaxRadius();
							if (Math.abs(point.y) > maxRadius) {
								point.y = Math.sign(point.y) * maxRadius;
							}
						}
					}

					return point;
				},
				ondrag: (point) => {
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let radius = Math.abs(point.y);
					let diameter = radius * 2;

					// set diameter and radius of curvature to fit point
					//
					this.model.set('diameter', new Units(diameter, 'mm'));
					
					// if front and back radii are equal, than keep them equal
					//
					if (hasFlatEdges) {
						let oppositeSurface = this.model.getOpposite();
						oppositeSurface.set('diameter', new Units(diameter, 'mm'));

						// check of opposite surface's radius of curvature is too small
						//
						if (Math.abs(oppositeSurface.radius_of_curvature) < radius) {
							oppositeSurface.set('radius_of_curvature', new Units(Math.sign(oppositeSurface.radius_of_curvature) * radius, 'mm'));
						}
					}
				}
			}),
			bottom: new MarkerView({
				icon: this.handle_icon,
				model: this.models.bottom,
				title: "Edge",
				viewport: this.options.viewport,
				draggable: true,
				direction: 'vertical',

				// callbacks
				//
				constrain: (point) => {
					let oppositeSurface = this.model.getOpposite();

					// limit by opposite surface's radius
					//
					if (oppositeSurface.radius_of_curvature) {
						let side = this.model.getSide();

						if (side == 'front' && oppositeSurface.isConcave() ||
							side == 'back' && oppositeSurface.isConvex()) {
							let maxRadius = oppositeSurface.getMaxRadius();
							if (Math.abs(point.y) > maxRadius) {
								point.y = Math.sign(point.y) * maxRadius;
							}
						}
					}

					return point;
				},
				ondrag: (point) => {
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let radius = Math.abs(point.y);
					let diameter = radius * 2;

					// set diameter and radius of curvature to fit point
					//
					this.model.set('diameter', new Units(diameter, 'mm'));
					
					// if front and back radii are equal, than keep them equal
					//
					if (hasFlatEdges) {
						let oppositeSurface = this.model.getOpposite();
						oppositeSurface.set('diameter', new Units(diameter, 'mm'));

						// check of opposite surface's radius of curvature is too small
						//
						if (Math.abs(oppositeSurface.radius_of_curvature) < radius) {
							oppositeSurface.set('radius_of_curvature', new Units(Math.sign(oppositeSurface.radius_of_curvature) * radius, 'mm'));
						}
					}
				}
			})
		};
	},

	//
	// svg rendering methods
	//

	update: function() {
		let xOffset = this.getXOffset();

		// update annotation models
		//
		this.models.top.set({
			location: new Vector2(xOffset, this.model.radius)
		});
		this.models.bottom.set({
			location: new Vector2(xOffset, -this.model.radius)
		});
		this.models.line.set({
			point1: new Vector2(xOffset, this.model.radius),
			point2: new Vector2(xOffset, -this.model.radius)
		});
	}
});