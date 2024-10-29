/******************************************************************************\
|                                                                              |
|                     mouse-drag-circle-measure-behavior.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Line from '../../../../../../models/shapes/line.js';
import MouseDragCircleBehavior from '../../../../../../views/svg/viewports/behaviors/manipulation/mouse-drag-circle-behavior.js';
import DimensioningLineView from '../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';

export default class MouseDragCircleMeasureBehavior extends MouseDragCircleBehavior {

	//
	// activating methods
	//

	off() {

		// call superclass method
		//
		super.off();

		// remove associated views
		//
		if (this.dimensioningLineView) {
			this.dimensioningLineView.destroy();
			this.dimensioningLineView = null;
		}
	}

	//
	// rendering methods
	//

	showAnnotation() {

		// compute start point
		//
		let offset = this.viewport.$el.offset();
		let x = this.start.left - offset.left;
		let y = this.start.top - offset.top;
		let point = this.viewport.toPoint(x, y);
		let latLon = this.viewport.getLatLon();
		let factor = Math.cos(latLon.latitude * Math.PI / 180);
		let circumference = 40000 * factor;
		let units = 'km';
		if (this.options.preferences &&
			this.options.preferences.get('measuring_units') == 'imperial') {
			circumference *= 0.621371;
			units = 'miles';
		}

		// render dimensioning line
		//
		this.dimensioningLineView = new DimensioningLineView({
			model: new Line({
				point1: point, 
				point2: point
			}),
			units: units,
			scaleFactor: circumference / (2 * Math.PI) * 1.0e-6,
			viewport: this.viewport
		});

		// show view in annotation layer
		//
		this.viewport.show(this.dimensioningLineView);
	}

	updateAnnotation() {

		// compute end point
		//
		let offset = this.viewport.$el.offset();
		let x = this.current.left - offset.left;
		let y = this.current.top - offset.top;
		let point = this.viewport.toPoint(x, y);

		// update rect
		//
		this.dimensioningLineView.model.set({
			point2: point
		});	
	}

	clear() {

		// remove circle
		//
		super.clear();

		// remove annotation
		//
		if (this.dimensioningLineView) {
			this.dimensioningLineView.destroy();
			this.dimensioningLineView = null;
		}
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {
		
		// call superclass method
		//
		super.onMouseDown(event);

		// remove associated views
		//
		this.clear();
	}

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// show dimensioning line
		//
		if (!this.dimensioningLineView) {
			this.showAnnotation();
		}

		// update dimensioning line
		//
		this.updateAnnotation();
	}
}