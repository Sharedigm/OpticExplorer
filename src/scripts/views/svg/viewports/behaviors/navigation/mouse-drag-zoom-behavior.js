/******************************************************************************\
|                                                                              |
|                            mouse-drag-zoom-behavior.js                       |
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

import MouseDragBehavior from '../../../../../views/svg/viewports/behaviors/mouse/mouse-drag-behavior.js';

export default class MouseDragZoomBehavior extends MouseDragBehavior {

	//
	// constructor
	//

	constructor(viewport, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// call superclass constructor
		//
		super(viewport, options);

		// set attributes
		//
		this.zoomFactor = options.zoomFactor || MouseDragZoomBehavior.zoomFactor;
		this.minScale = options.minScale;
		this.maxScale = options.maxScale;
		this.mode = options.mode;
		this.cursor = 'ns-resize';
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// reset drag
		//
		this.drag = this.getOffset(this.start, this.current);
		this.sign = Math.sign(this.drag.top) || 1;
	}

	onMouseDrag(event) {

		// find change in drag
		//
		let drag = this.getOffset(this.start, this.current);
		let delta = (this.drag.top - drag.top) * this.sign;

		// call superclass method
		//
		MouseDragBehavior.prototype.onMouseDrag.call(this, event);

		// compute zoom and new scale
		//
		let zoom = 1 - (delta / this.viewport.height) * this.zoomFactor;
		let scale = this.viewport.scale * zoom;

		// check bounds on scale
		//
		if (scale < this.minScale) {
			scale = this.minScale;
		} else if (scale > this.maxScale) {
			scale = this.maxScale;
		}

		// set scale
		//
		this.viewport.setScale(scale);

		// save drag
		//
		this.drag = drag;
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// reset drag
		//
		this.drag = undefined;
	}

	//
	// static attributes
	//

	static zoomFactor = 5;
}