/******************************************************************************\
|                                                                              |
|                         point-light-annotation-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of distant lights.     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Line from '../../../../../../../models/shapes/line.js';
import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'point light annotation',

	//
	// getting methods
	//

	getModels: function() {
		let location = this.model.get('location');

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
			})
		}
	},

	getViews: function() {
		return {
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
			})
		}
	},

	//
	// updating methods
	//

	update: function() {
		let location = this.model.get('location');

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
	},

	//
	// event handling methods
	//

	onChange: function() {

		// on location change
		//
		if (this.model.hasChanged('location')) {
			this.update();
		}
	}
});