/******************************************************************************\
|                                                                              |
|                          spherical-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying annotations of a spherical surface.     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../../models/shapes/line.js';
import SurfaceAnnotationView from '../../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/surfaces/surface-annotation-view.js';
import AxisView from '../../../../../../../../views/svg/shapes/axis-view.js';
import ArrowView from '../../../../../../../../views/svg/shapes/arrow-view.js';
import DimensioningLineView from '../../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import MarkerView from '../../../../../../../../views/svg/shapes/marker-view.js';
import Vector2 from '../../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../../utilities/math/units.js';

export default SurfaceAnnotationView.extend({

	//
	// attributes
	//

	className: 'spherical surface annotation',

	//
	// rendering attributes
	//

	icons: {
		center_of_curvature: `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
				<circle class="filled" cx="5" cy="5" r="2" />
				<circle class="stroked" cx="5" cy="5" r="4" />
			</svg>`
	},

	// snap epsilon
	//
	epsilon: 0.001,

	//
	// getting methods
	//

	getModels: function() {

		// compute points
		//
		let points = this.options.parent.getPoints();

		// compute offsets
		//
		let xOffset = this.getXOffset();
		let surfaceOffset = this.options.parent.options.parent.getSurfaceOffset();
		if (surfaceOffset != 0) {
			points.top.x -= surfaceOffset;
			points.bottom.x -= surfaceOffset;
			points.curvature.x -= surfaceOffset;
			points.center_of_curvature.x -= surfaceOffset;
		}

		// create models
		//
		return {

			// points
			//
			vertex: new Point({
				location: new Vector2(xOffset, 0)
			}),
			center: new Point({
				location: new Vector2(xOffset + this.model.thickness * Math.sign(this.model.radius_of_curvature), 0)
			}),
			top: new Point({
				location: points.top
			}),
			bottom: new Point({
				location: points.bottom
			}),
			curvature_point: new Point({
				location: points.curvature,
				index: this.model.getIndex()
			}),
			center_of_curvature: new Point({
				location: points.center_of_curvature,
				index: this.model.getIndex()
			}),

			// lines
			//
			sag: new Line({
				point1: new Vector2(xOffset, -this.model.radius),
				point2: new Vector2(xOffset + this.model.thickness * Math.sign(this.model.radius_of_curvature), -this.model.radius)
			}),
			curvature: new Line({
				point1: points.curvature,
				point2: new Vector2(xOffset, 0)
			}),
			diameter: new Line({
				point1: points.top,
				point2: points.bottom
			}),
			curvature1: new Line({
				point1: points.center_of_curvature,
				point2: points.top
			}),
			curvature2: new Line({
				point1: points.center_of_curvature,
				point2: points.bottom
			})
		};
	},

	getViews: function() {
		return {

			// axes
			//
			vertex: new AxisView({
				model: this.models.vertex,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),
			center: new AxisView({
				model: this.models.center,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),

			// dimensioning lines
			//
			sag: new DimensioningLineView({
				model: this.models.sag,
				className: 'double dimensioning arrow',
				text: 'sag=',
				units: this.model.get('diameter').targetUnits,
				vTextOffsetDirection: 'top',
				viewport: this.options.viewport
			}),
			curvature: new ArrowView({
				model: this.models.curvature,
				viewport: this.options.viewport
			}),
			diameter: new DimensioningLineView({
				model: this.models.diameter,
				text: 'd=',
				units: this.model.get('diameter').targetUnits,
				hTextOffsetDirection: this.model.radius_of_curvature > 0? 'right' : 'left',
				viewport: this.options.viewport
			}),
			curvature1: new DimensioningLineView({
				model: this.models.curvature1,
				className: 'dimensioning arrow',
				text: 'R=',
				units: this.model.get('radius_of_curvature').targetUnits,
				hTextOffsetDirection: this.model.radius_of_curvature > 0? 'right' : 'left',
				viewport: this.options.viewport
			}),
			curvature2: new DimensioningLineView({
				model: this.models.curvature2,
				className: 'dimensioning arrow',
				text: 'R=',
				units: this.model.get('radius_of_curvature').targetUnits,
				hTextOffsetDirection: this.model.radius_of_curvature > 0? 'right' : 'left',
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

				// callbacks
				//
				constrain: (point) => {			
					let xOffset = this.getXOffset();
					let side = this.model.getSide();
					let thickness = this.model.parent.thickness;
					let offset = side == 'front'? thickness : -thickness;
					let point2 = point.minus(new Vector2(xOffset + offset, 0));

					// constrain by opposite surface
					//
					let oppositeSurface = this.model.getOpposite();

					// constrain by opposite spherical surface
					//
					if (oppositeSurface.center_of_curvature) {
						let distance = oppositeSurface.center_of_curvature.distanceTo(point2);
						let isInside = distance < Math.abs(oppositeSurface.radius_of_curvature);
						let isOutside = distance > Math.abs(oppositeSurface.radius_of_curvature);
						let isConstrained = false;
						
						switch (side) {
							case 'front': {
								isConstrained = oppositeSurface.isConcave()? isOutside : isInside;
								break;
							}
							case 'back': {
								isConstrained = oppositeSurface.isConcave()? isInside : isOutside;
								break;
							}
						}

						if (isConstrained) {
							point = this.constructor.constrainedBy(point2, oppositeSurface.center_of_curvature, oppositeSurface.radius_of_curvature);
							point.x += xOffset + offset;
						}

					// constrain by opposite planar surface
					//	
					} else {
						if (side == 'front' && point2.x > 0 || 
							side == 'back' && point2.x < 0) {
							point.x = xOffset + offset;
						}
					}

					// constrain point horizontally by curvature
					//
					let sag = point.x - xOffset;
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let radiusOfCurvature = hasFlatEdges? this.model.parent.getMinRadiusOfCurvature() : this.model.radius_of_curvature;
					if (Math.abs(sag) > Math.abs(radiusOfCurvature)) {
						point.x = xOffset + Math.sign(sag) * Math.abs(this.model.radius_of_curvature);
					}

					return point;
				},
				ondrag: (point) => {
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let xOffset = this.getXOffset();
					let sag = point.x - xOffset;
					let radius = Math.abs(point.y);
					let diameter = radius * 2;
					let radiusOfCurvature = this.model.constructor.getRadiusOfCurvature(sag, radius);

					// set diameter and radius of curvature to fit point
					//
					this.model.set('diameter', new Units(diameter, 'mm'));
					this.model.set('radius_of_curvature', new Units(radiusOfCurvature, 'mm'));
					
					// if front and back radii are equal, than keep them equal
					//
					if (hasFlatEdges) {
						let oppositeSurface = this.model.getOpposite();
						oppositeSurface.set('diameter', new Units(diameter, 'mm'));

						// check of opposite surface's radius of curvature is too small
						//
						if (Math.abs(oppositeSurface.radius_of_curvature) < radius) {
							oppositeSurface.set('radius_of_curvature', new Units(Math.sign(oppositeSurface.radius_of_curvature) * radius), 'mm');
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

				// callbacks
				//
				constrain: (point) => {			
					let xOffset = this.getXOffset();
					let side = this.model.getSide();
					let thickness = this.model.parent.thickness;
					let offset = side == 'front'? thickness : -thickness;
					let point2 = point.minus(new Vector2(xOffset + offset, 0));

					// constrain by opposite surface
					//
					let oppositeSurface = this.model.getOpposite();

					// constrain by opposite spherical surface
					//
					if (oppositeSurface.center_of_curvature) {

						let distance = oppositeSurface.center_of_curvature.distanceTo(point2);
						let isInside = distance < Math.abs(oppositeSurface.radius_of_curvature);
						let isOutside = distance > Math.abs(oppositeSurface.radius_of_curvature);
						let isConstrained = false;

						switch (side) {
							case 'front': {
								isConstrained = oppositeSurface.isConcave()? isOutside : isInside;
								break;
							}
							case 'back': {
								isConstrained = oppositeSurface.isConcave()? isInside : isOutside;
								break;
							}
						}

						if (isConstrained) {
							point = this.constructor.constrainedBy(point2, oppositeSurface.center_of_curvature, oppositeSurface.radius_of_curvature);
							point.x += xOffset + offset;
						}

					// constrain by opposite planar surface
					//	
					} else {
						if (side == 'front' && point2.x > 0 || 
							side == 'back' && point2.x < 0) {
							point.x = xOffset + offset;
						}
					}

					// constrain point horizontally by curvature
					//
					let sag = point.x - xOffset;
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let radiusOfCurvature = hasFlatEdges? this.model.parent.getMinRadiusOfCurvature() : this.model.radius_of_curvature;
					if (Math.abs(sag) > Math.abs(radiusOfCurvature)) {
						point.x = xOffset + Math.sign(sag) * Math.abs(this.model.radius_of_curvature);
					}

					return point;
				},
				ondrag: (point) => {
					let hasFlatEdges = this.model.parent.hasFlatEdges();
					let xOffset = this.getXOffset();
					let sag = point.x - xOffset;
					let radius = Math.abs(point.y);
					let diameter = radius * 2;
					let radiusOfCurvature = this.model.constructor.getRadiusOfCurvature(sag, radius);
					
					// set diameter and radius of curvature to fit point
					//
					this.model.set('diameter', new Units(diameter, 'mm'));
					this.model.set('radius_of_curvature', new Units(radiusOfCurvature, 'mm'));
					
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
			center_of_curvature: new MarkerView({
				className: 'center-of-curvature marker',
				icon: this.icons.center_of_curvature,
				model: this.models.center_of_curvature,
				title: "Center of Curvature",
				viewport: this.options.viewport,
				draggable: true,
				direction: 'horizontal',

				// callbacks
				//
				constrain: (point) => {
					let xOffset = this.getXOffset()
					let radiusOfCurvature = point.x - xOffset;
					let surface = this.model;
					let curvature = surface.rocToCurvature(radiusOfCurvature);
					let min = surface.getMinCurvature();
					let max = surface.getMaxCurvature();

					// constrain point by curvature
					//
					if (curvature < min) {
						let radiusOfCurvature = surface.curvatureToROC(min);
						point.x = radiusOfCurvature + xOffset;
					} else if (curvature > max) {
						let radiusOfCurvature = surface.curvatureToROC(max);
						point.x = radiusOfCurvature + xOffset;			
					}

					return point;
				},
				ondrag: (point) => {
					let xOffset = this.getXOffset();
					let radiusOfCurvature = point.x - xOffset;
					let surface = this.model;
					let curvature = surface.rocToCurvature(radiusOfCurvature);

					if (curvature != 0) {
						let min = surface.getMinCurvature();
						let max = surface.getMaxCurvature();

						if (curvature > min + this.epsilon && curvature < max - this.epsilon) {

							// set curvature from curvature point
							//
							surface.set('curvature', new Units(curvature, 'mm'));			
						} else if (curvature < min + this.epsilon && surface.curvature != min) {

							// snap to min curvature
							//
							surface.set('curvature', new Units(min, 'mm'));	
							this.onSnap();
						} else if (curvature > max - this.epsilon && surface.curvature != max) {

							// snap to max curvature
							//
							surface.set('curvature', new Units(max, 'mm'));	
							this.onSnap();
						}
					}
				}
			}),
			curvature_point: new MarkerView({
				icon: this.handle_icon,
				model: this.models.curvature_point,
				title: "Curvature",
				viewport: this.options.viewport,
				draggable: true,
				direction: 'horizontal',

				// callbacks
				//
				constrain: (point) => {
					let xOffset = this.getXOffset()
					let curvature = point.x - xOffset;

					// constrain curvature
					//
					if (curvature != 0) {
						let minCurvature = this.model.getMinCurvature();
						let maxCurvature = this.model.getMaxCurvature();

						if (curvature < minCurvature) {
							point.x = minCurvature + xOffset;
						} else if (curvature > maxCurvature) {
							point.x = maxCurvature + xOffset;
						}
					}
					return point;
				},
				ondrag: (point) => {
					let xOffset = this.getXOffset();
					let curvature = point.x - xOffset;

					if (curvature != 0) {
						let surface = this.model;
						let min = surface.getMinCurvature();
						let max = surface.getMaxCurvature();

						if (curvature > min + this.epsilon && curvature < max - this.epsilon) {

							// set curvature from curvature point
							//
							surface.set('curvature', new Units(curvature, 'mm'));			
						} else if (curvature < min + this.epsilon && surface.curvature != min) {

							// snap to min curvature
							//
							surface.set('curvature', new Units(min, 'mm'));	
							this.onSnap();
						} else if (curvature > max - this.epsilon && surface.curvature != max) {

							// snap to max curvature
							//
							surface.set('curvature', new Units(max, 'mm'));	
							this.onSnap();
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

		// compute points
		//
		let points = this.options.parent.getPoints();

		// compute offsets
		//
		let xOffset = this.getXOffset();
		let surfaceOffset = this.options.parent.options.parent.getSurfaceOffset();
		if (surfaceOffset != 0) {
			points.curvature.x -= surfaceOffset;
			points.center_of_curvature.x -= surfaceOffset;
			points.top.x -= surfaceOffset;
			points.bottom.x -= surfaceOffset;
		}

		if (!this.views) {
			return;
		}

		// update units
		//
		if (this.model.has('diameter') && this.views.sag.options.units != this.model.get('diameter').targetUnits) {
			this.views.sag.options.units = this.model.get('diameter').targetUnits;
			this.views.sag.update();
		}
		if (this.model.has('diameter') && this.views.diameter.options.units != this.model.get('diameter').targetUnits) {
			this.views.curvature.options.units = this.model.get('diameter').targetUnits;
			this.views.curvature.update();
		}
		if (this.model.has('diameter') && this.views.diameter.options.units != this.model.get('diameter').targetUnits) {
			this.views.diameter.options.units = this.model.get('diameter').targetUnits;
			this.views.diameter.update();
		}
		if (this.model.has('radius_of_curvature') && this.views.curvature1.options.units != this.model.get('radius_of_curvature').targetUnits) {
			this.views.curvature1.options.units = this.model.get('radius_of_curvature').targetUnits;
			this.views.curvature1.update();
		}
		if (this.model.has('radius_of_curvature') && this.views.curvature2.options.units != this.model.get('radius_of_curvature').targetUnits) {
			this.views.curvature2.options.units = this.model.get('radius_of_curvature').targetUnits;
			this.views.curvature2.update();
		}				

		// update vertices
		//
		this.models.vertex.set({
			location: new Vector2(xOffset, 0)
		});
		this.models.center.set({
			location: new Vector2(xOffset + this.model.thickness * Math.sign(this.model.radius_of_curvature), 0)
		});
		this.models.top.set({
			location: points.top
		});
		this.models.bottom.set({
			location: points.bottom
		});

		// update lines
		//
		this.models.sag.set({
			point1: new Vector2(xOffset, -this.model.radius),
			point2: new Vector2(xOffset + this.model.thickness * Math.sign(this.model.radius_of_curvature), -this.model.radius)
		});
		this.models.curvature.set({
			point1: points.curvature,
			point2: new Vector2(xOffset, 0)
		});
		this.models.diameter.set({
			point1: points.top,
			point2: points.bottom
		});
		this.models.curvature1.set({
			point1: points.center_of_curvature,
			point2: points.top
		});
		this.models.curvature2.set({
			point1: points.center_of_curvature,
			point2: points.bottom
		});

		// update markers
		//
		this.models.center_of_curvature.set({
			location: points.center_of_curvature,
			index: this.model.getIndex()
		});
		this.models.curvature_point.set({
			location: points.curvature,
			index: this.model.getIndex()
		});
	}
}, {

	//
	// static methods
	//

	constrainedBy: function(point1, point2, distance) {
		let direction = (point1.minus(point2)).normalized();
		let offset = direction.scaledBy(Math.abs(distance));
		return point2.plus(offset);
	}
});