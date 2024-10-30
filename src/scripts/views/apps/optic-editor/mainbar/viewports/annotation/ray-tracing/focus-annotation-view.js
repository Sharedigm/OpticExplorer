/******************************************************************************\
|                                                                              |
|                            focus-annotation-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of focus points.       |
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

	className: 'focus annotation',

	//
	// constructor
	//

	initialize: function() {
		let optics = this.options.parent.options.optics;
		let location = this.model.get('location');

		// create models
		//
		this.models = {
			hLine: new Line({
				point1: new Vector2(optics.getValue('optical_length'), 0), 
				point2: new Vector2(location.x, 0)
			}),
			vLine: new Line({
				point1: new Vector2(location.x, 0), 
				point2: location
			})
		}

		// create subviews
		//
		this.views = {
			hLine: new DimensioningLineView({
				model: this.models.hLine,
				text: 'bf=',
				viewport: this.options.viewport
			}),
			vLine: new DimensioningLineView({
				model: this.models.vLine,
				hTextOffsetDirection: 'right',
				viewport: this.options.viewport
			})
		};

		// create children
		//
		for (let item in this.views) {
			this.children._add(this.views[item]);
		} 

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	update: function() {
		let optics = this.options.parent.options.optics;
		let location = this.model.get('location');

		// update annotation models
		//
		this.models.hLine.set({
			point1: new Vector2(optics.getValue('optical_length'), 0), 
			point2: new Vector2(location.x, 0)
		});
		this.models.vLine.set({
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