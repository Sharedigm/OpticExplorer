/******************************************************************************\
|                                                                              |
|                      mouse-drag-rect-measure-behavior.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Line from '../../../../../../models/shapes/line.js';
import MouseDragRectBehavior from '../../../../../../views/svg/viewports/behaviors/manipulation/mouse-drag-rect-behavior.js';
import DimensioningLineView from '../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';

export default class MouseDragRectMeasureBehavior extends MouseDragRectBehavior {

	constructor(viewport, options) {
		
		// call superclass constructor
		//
		super(viewport, options);

		// set attributes
		//
		this.viewport = viewport;
		this.show_diagonal = this.options.show_diagonal;
	}

	//
	// rendering methods
	//

	showAnnotation() {

		// compute start point
		//
		let offset = this.viewport.$el.offset();
		let left = this.start.left - offset.left;
		let top = this.start.top - offset.top;
		let point = this.viewport.toPoint(left, top);
		this.point = point;

		// get circumference at current latitude
		//
		let units = 'km';
		if (this.options.preferences &&
			this.options.preferences.get('measuring_units') == 'imperial') {
			units = 'miles';
		}
		let circumference = this.viewport.getCircumference(units);
		this.scaleFactor = circumference / (2 * Math.PI) * 1.0e-6;

		// render dimensioning lines
		//
		this.dimensioningLineViews = [
			new DimensioningLineView({
				model: new Line({
					point1: point, 
					point2: point
				}),
				units: units,
				scaleFactor: this.scaleFactor,
				viewport: this.viewport
			}),
			new DimensioningLineView({
				model: new Line({
					point1: point, 
					point2: point
				}),
				units: units,
				scaleFactor: this.scaleFactor,
				viewport: this.viewport
			}),
		];

		if (this.show_diagonal) {
			this.dimensioningLineViews.push(new DimensioningLineView({
				model: new Line({
					point1: point, 
					point2: point
				}),
				units: units,
				scaleFactor: this.scaleFactor,
				viewport: this.viewport
			}));
		}

		// show view in annotation layer
		//
		for (let i = 0; i < this.dimensioningLineViews.length; i++) {
			this.viewport.show(this.dimensioningLineViews[i]);
		}
	}

	updateAnnotation() {

		// compute end point
		//
		let offset = this.viewport.$el.offset();
		let left1 = this.start.left - offset.left;
		let top1 = this.start.top - offset.top;
		let left2 = this.current.left - offset.left;
		let top2 = this.current.top - offset.top;
		
		this.point1 = this.viewport.toPoint(left1, top2);
		this.point2 = this.viewport.toPoint(left2, top1)
		this.point3 = this.viewport.toPoint(left2, top2);

		// update views
		//
		this.dimensioningLineViews[0].model.set({
			point2: this.point1
		});
		this.dimensioningLineViews[1].model.set({
			point2: this.point2
		});
		if (this.show_diagonal) {
			this.dimensioningLineViews[2].model.set({
				point2: this.point3
			});
		}
	}

	clear() {

		// remove circle
		//
		super.clear();

		// remove annotation
		//
		if (this.dimensioningLineViews) {
			for (let i = 0; i < this.dimensioningLineViews.length; i++) {
				this.dimensioningLineViews[i].destroy();
			}
			this.dimensioningLineViews = null;
		}
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {
		
		// call "superclass" method
		//
		MouseDragRectBehavior.prototype.onMouseDown.call(this, event);

		// remove associated views
		//
		this.clear();
	}

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// show dimensioning lines
		//
		if (!this.dimensioningLineViews) {
			this.showAnnotation();
		}

		// update dimensioning lines
		//
		this.updateAnnotation();
	}

	onMouseUp() {

		// call superclass method
		//
		super.onMouseUp(event);

		// remove dimensioning lines
		//
		this.clear();

		// perform callback
		//
		if (this.options.ondragend) {
			this.options.ondragend();
		}
	}
}