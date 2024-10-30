/******************************************************************************\
|                                                                              |
|                         scene-object-annotation-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of scene objects.      |
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

	className: 'object annotation',

	//
	// constructor
	//

	initialize: function() {
		let location = this.getLocation() || new Vector2(0, 0);

		// set vertical offsets
		//
		let height = this.model.get('height').in('mm');
		let top = location.y + height / 2;
		let bottom = location.y - height / 2;
		let offset = location.y < 0? top : bottom;

		// don't show offset if less than half height
		//
		if (Math.abs(location.y) < height / 2) {
			offset = 0;
		}

		// create models
		//
		this.models = {
			distance: new Line({
				point1: new Vector2(0, 0),
				point2: new Vector2(location.x, 0)
			}),
			offset: new Line({
				point1: new Vector2(location.x, 0),
				point2: new Vector2(location.x, offset)
			}),
			height: new Line({
				point1: new Vector2(location.x, top),
				point2: new Vector2(location.x, bottom)
			})
		}

		// create subviews
		//
		this.views = {
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
			height: new DimensioningLineView({
				model: this.models.height,
				units: this.model.has('offset')? this.model.get('offset').targetUnits : undefined,
				hTextOffsetDirection: 'left',
				viewport: this.options.viewport
			})
		}

		// create children
		//
		for (let item in this.views) {
			this.children._add(this.views[item]);
		} 

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// getting methods
	//

	getLocation: function() {
		return this.model.get('location');
	},

	//
	// svg rendering methods
	//

	update: function() {
		let location = this.getLocation();

		if (!location) {
			return;
		}

		// set vertical offsets
		//
		let height = this.model.get('height').in('mm');
		let top = location.y + height / 2;
		let bottom = location.y - height / 2;
		let offset = location.y < 0? top : bottom;

		// don't show offset if less than half height
		//
		if (Math.abs(location.y) < height / 2) {
			offset = 0;
		}

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
		if (this.model.get('height') && this.views.height.options.units != this.model.get('height').targetUnits) {
			this.views.height.options.units = this.model.get('height').targetUnits;
			this.views.height.update();
		}

		// update annotation models
		//
		this.models.distance.set({
			point1: new Vector2(0, 0),
			point2: new Vector2(location.x, 0)
		});
		this.models.offset.set({
			point1: new Vector2(location.x, 0),
			point2: new Vector2(location.x, offset)
		});
		this.models.height.set({
			point1: new Vector2(location.x, top),
			point2: new Vector2(location.x, bottom)
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