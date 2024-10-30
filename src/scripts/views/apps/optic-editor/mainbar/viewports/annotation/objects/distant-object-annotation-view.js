/******************************************************************************\
|                                                                              |
|                       distant-object-annotation-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of distant objects.    |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Arc from '../../../../../../../models/shapes/arc.js';
import Line from '../../../../../../../models/shapes/line.js';
import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import DimensioningArcView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-arc-view.js';
import LineView from '../../../../../../../views/svg/shapes/line-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'distant object annotation',

	//
	// constructor
	//

	initialize: function() {
		let location = this.model.get('location');
		let points = this.getArcPoints(location);

		// create models
		//
		this.models = {
			line: new Line({
				point1: new Vector2(0, 0),
				point2: points.point1
			}),
			arrow: new Line({
				point1: new Vector2(0, 0),
				point2: location
			}),
			arc: new Arc({
				point1: points.point1,
				point2: points.point2,
				center: new Vector2(0, 0)
			})
		}

		// create subviews
		//
		this.views = {
			line: new LineView({
				model: this.models.line,
				viewport: this.options.viewport
			}),
			arrow: new LineView({
				model: this.models.arrow,
				className: 'reverse arrow',
				viewport: this.options.viewport
			}),
			arc: new DimensioningArcView({
				model: this.models.arc,
				text: '\u03B8' + '=',
				units: this.model.has('angle')? this.model.get('angle').targetUnits : undefined,
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
	// querying methods
	//

	getArcPoints: function(location) {

		// compute arc parameters
		//
		let distance = location.length();
		let x1 = -distance / 2;
		let y1 = 0;
		let x2 = location.x / 2;
		let y2 = location.y / 2;

		return {
			point1: new Vector2(x1, y1), 
			point2: new Vector2(x2, y2),
		}
	},

	//
	// svg rendering methods
	//

	update: function() {
		let location = this.model.get('location');
		let points = this.getArcPoints(location);

		// update units
		//
		if (this.model.has('angle') && this.views.arc.options.units != this.model.get('angle').targetUnits) {
			this.views.arc.options.units = this.model.get('angle').targetUnits;
			this.views.arc.update();
		}

		// update annotation models
		//
		this.models.line.set({
			point1: new Vector2(0, 0),
			point2: points.point1,
		});
		this.models.arrow.set({
			point1: new Vector2(0, 0),
			point2: location
		});
		this.models.arc.set({
			point1: points.point1,
			point2: points.point2,
			center: new Vector2(0, 0)
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