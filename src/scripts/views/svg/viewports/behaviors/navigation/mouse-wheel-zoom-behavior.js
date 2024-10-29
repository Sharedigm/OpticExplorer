/******************************************************************************\
|                                                                              |
|                           mouse-wheel-zoom-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseWheelBehavior from '../../../../../views/behaviors/mouse/mouse-wheel-behavior.js';

export default class MouseWheelZoomBehavior extends MouseWheelBehavior {

	constructor(viewport, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		
		// call superclass constructor
		//
		super(options.el || (viewport? viewport.el : null), _.extend(options || {}, {
			
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
		this.viewport = viewport;
		this.zoomFactor = options.zoomFactor || MouseWheelZoomBehavior.zoomFactor;
		this.minScale = options.minScale;
		this.maxScale = options.maxScale;
	}

	//
	// event handling methods
	//

	onZoom(zoom) {
		let scale = this.viewport.scale * zoom;

		// check bounds on scale
		//
		if (this.minScale && scale < this.minScale) {
			scale = this.minScale;
		}
		if (this.maxScale && scale > this.maxScale) {
			scale = this.maxScale;
		}
		this.viewport.setScale(scale);
	}

	//
	// static attributes
	//

	static zoomFactor = 1.05;
}