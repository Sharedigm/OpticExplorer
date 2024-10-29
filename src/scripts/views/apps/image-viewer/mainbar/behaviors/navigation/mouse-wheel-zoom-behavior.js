/******************************************************************************\
|                                                                              |
|                           mouse-wheel-zoom-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewer's mouse interaction behavior.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseWheelBehavior from '../../../../../../views/behaviors/mouse/mouse-wheel-behavior.js';

export default class MouseWheelZoomBehavior extends MouseWheelBehavior {

	constructor(viewer, options) {

		// optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// call superclass constructor
		//
		super(viewer.$el.find('.image'), _.extend(options, {
			
			// callbacks
			//
			onmousewheel: (event) => {

				// zoom based upon direction of wheel movement
				//
				if (event.deltaY > 0) {
					this.onZoom(this.zoomFactor);
				} else {
					this.onZoom(1 / this.zoomFactor);
				}
			}
		}));

		// set attributes
		//
		this.viewer = viewer;
		this.zoomFactor = options.zoomFactor || 1.05;
	}
	
	//
	// event handling methods
	//

	onZoom(factor) {
		let zoom = this.viewer.getZoom();

		// update zoom
		//
		zoom *= factor;

		// set zoom
		//
		this.viewer.setZoom(zoom);
	}
}