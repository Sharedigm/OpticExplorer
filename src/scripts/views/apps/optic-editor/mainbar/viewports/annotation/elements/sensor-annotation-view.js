/******************************************************************************\
|                                                                              |
|                             sensor-annotation-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of sensors.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Line from '../../../../../../../models/shapes/line.js';
import ElementAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/element-annotation-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default ElementAnnotationView.extend({

	//
	// attributes
	//

	className: 'sensor annotation',

	//
	// getting methods
	//

	getModels: function() {
		let xOffset = this.getXOffset();

		// create models
		//
		return _.extend(ElementAnnotationView.prototype.getModels.call(this), {
			width: new Line({
				point1: new Vector2(xOffset, this.model.width / 2),
				point2: new Vector2(xOffset, -this.model.width / 2),
			}),
			height: new Line({
				point1: new Vector2(xOffset, this.model.height / 2),
				point2: new Vector2(xOffset, -this.model.height / 2),
			})
		});
	},

	getViews: function() {

		// create views
		//
		return _.extend(ElementAnnotationView.prototype.getViews.call(this), {
			width: new DimensioningLineView({
				model: this.models.width,
				className: 'aperture dimensioning double arrow',
				text: 'w=',
				viewport: this.options.viewport,
				offset: true,
				hTextOffsetDirection: 'right'
			}),
			height: new DimensioningLineView({
				model: this.models.height,
				className: 'aperture dimensioning double arrow',
				text: 'h=',
				viewport: this.options.viewport,
				offset: true,
				hTextOffsetDirection: 'left'
			})
		});
	},

	//
	// setting methods
	//

	setOffset: function(offset) {
		this.models.width.set({
			offset: offset
		});
		this.models.height.set({
			offset: offset
		});
	},

	//
	// rendering methods
	//

	update: function() {
		let xOffset = this.getXOffset();

		// call superclass method
		//
		ElementAnnotationView.prototype.update.call(this);

		// update size
		//
		this.models.width.set({
			point1: new Vector2(xOffset, this.model.width / 2),
			point2: new Vector2(xOffset, -this.model.width / 2),
		});
		this.models.height.set({
			point1: new Vector2(xOffset, this.model.height / 2),
			point2: new Vector2(xOffset, -this.model.height / 2),
		});
	}
});