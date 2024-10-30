/******************************************************************************\
|                                                                              |
|                          light-ray-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of light rays.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import Arc from '../../../../../../../models/shapes/arc.js';
import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import LineView from '../../../../../../../views/svg/shapes/line-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import DimensioningArcView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-arc-view.js';
import MarkerView from '../../../../../../../views/svg/shapes/marker-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';
import Units from '../../../../../../../utilities/math/units.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'light ray annotation',

	//
	// getting methods
	//

	getModels: function() {
		let distance = this.model.has('distance')? this.model.get('distance').in('mm') : 0;
		let offset = this.model.has('offset')? this.model.get('offset').in('mm') : 0;
		let angle = this.model.has('angle')? this.model.get('angle').in('deg') : 0;
		let location = new Vector2(-distance, -offset);
		let length = -this.handleLength / this.options.viewport.scale;
		let direction = new Vector2(1, 0).rotatedBy(angle).scaledBy(length);

		// create models
		//
		return {
			distance: new Line({
				point1: new Vector2(0, 0),
				point2: new Vector2(location.x, 0)
			}),
			offset: new Line({
				point1: new Vector2(location.x, 0),
				point2: location
			}),
			point: new Point({
				location: location.plus(direction)
			}),
			line: new Line({
				point1: location,
				point2: location.plus(new Vector2(length, 0))
			}),
			arrow: new Line({
				point1: location.plus(direction),
				point2: location
			}),
			arc: new Arc({
				point1: location.plus(new Vector2(length, 0)),
				point2: location.plus(direction),
				center: location
			})
		}
	},

	getViews: function() {
		return {

			// arrows
			//
			line: new LineView({
				model: this.models.line,
				viewport: this.options.viewport
			}),
			arrow: new LineView({
				model: this.models.arrow,
				viewport: this.options.viewport
			}),
			arc: new DimensioningArcView({
				model: this.models.arc,
				text: '\u03B8' + '=',
				units: this.model.has('angle')? this.model.get('angle').targetUnits : undefined,
				viewport: this.options.viewport
			}),

			// dimensioning lines
			//
			distance: new DimensioningLineView({
				model: this.models.distance, 
				units: this.model.has('distance')? this.model.get('distance').targetUnits : undefined,
				vTextOffsetDirection: location.y < 0? 'bottom' : 'top',
				viewport: this.options.viewport
			}),
			offset: new DimensioningLineView({
				model: this.models.offset,
				units: this.model.has('offset')? this.model.get('offset').targetUnits : undefined,
				hTextOffsetDirection: 'left',
				viewport: this.options.viewport
			}),

			// markers
			//
			handle: new MarkerView({
				icon: this.handle_icon,
				model: this.models.point,
				title: "Direction",
				viewport: this.options.viewport,
				draggable: true,

				constrain: (point) => {
					let distance = this.model.has('distance')? this.model.get('distance').in('mm') : 0;
					let offset = this.model.has('offset')? this.model.get('offset').in('mm') : 0;	
					let location = new Vector2(-distance, -offset);
					let direction = location.minus(point);
					let length = -this.handleLength / this.options.viewport.scale;
					point = location.plus(direction.scaledTo(length));
					return point;
				},
				ondrag: (point) => {
					let location = this.model.get('location');
					let direction = location.minus(point);
					let angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
					this.model.set('angle', new Units(angle, 'deg'));
				}
			})
		}
	},

	//
	// updating methods
	//

	update: function() {
		let distance = this.model.has('distance')? this.model.get('distance').in('mm') : 0;
		let offset = this.model.has('offset')? this.model.get('offset').in('mm') : 0;
		let angle = this.model.has('angle')? this.model.get('angle').in('deg') : 0;
		let location = new Vector2(-distance, -offset);
		let length = -this.handleLength / this.options.viewport.scale;
		let direction = new Vector2(1, 0).rotatedBy(angle).scaledBy(length);

		// update text offset
		//
		let vTextOffsetDirection = location.y < 0? 'bottom' : 'top';
		if (vTextOffsetDirection != this.views.distance.options.vTextOffsetDirection) {
			this.views.distance.options.vTextOffsetDirection = vTextOffsetDirection;
			this.views.distance.onChange();
		}

		// update units
		//
		if (this.model.has('distance') && this.views.distance.options.units != this.model.get('distance').targetUnits) {
			this.views.distance.options.units = this.model.get('distance').targetUnits;
			this.views.distance.update();
		}
		if (this.model.has('offset') && this.views.offset.options.units != this.model.get('offset').targetUnits) {
			this.views.offset.options.units = this.model.get('offset').targetUnits;
			this.views.offset.update();
		}

		// update annotation models
		//
		this.models.distance.set({
			point1: new Vector2(0, 0),
			point2: new Vector2(location.x, 0)
		});
		this.models.offset.set({
			point1: new Vector2(location.x, 0),
			point2: location
		});
		this.models.point.set({
			location: location.plus(direction)
		});
		this.models.line.set({
			point1: location,
			point2: location.plus(new Vector2(length, 0))
		});
		this.models.arrow.set({
			point1: location.plus(direction),
			point2: location
		});
		this.models.arc.set({
			point1: location.plus(new Vector2(length, 0)),
			point2: location.plus(direction),
			center: location
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// on location change
		//
		if (this.model.hasChanged('location') || this.model.hasChanged('angle')) {
			this.update();
		}
	}
});