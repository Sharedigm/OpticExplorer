/******************************************************************************\
|                                                                              |
|                            mouse-drag-zoom-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewer's mouse interaction behavior.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseDragBehavior from '../../../../../../views/behaviors/mouse/mouse-drag-behavior.js';

export default class MouseDragZoomBehavior extends MouseDragBehavior {

	//
	// constructor
	//

	constructor(viewer, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// call superclass constructor
		//
		super(viewer.$el.find('.image'), options);

		// set attributes
		//
		this.viewer = viewer;
		this.zoomFactor = options.zoomFactor || MouseDragZoomBehavior.zoomFactor;
		this.minScale = options.minScale;
		this.maxScale = options.maxScale;
		this.cursor = 'ns-resize';
		this.blocking = false;
	}

	//
	// event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// reset drag
		//
		this.drag = {
			left: 0,
			top: 0
		};
		this.height = this.viewer.$el.height();
		this.zoom = this.viewer.getImageView().getScale() * 100;
	}

	onMouseDrag(mouseX, mouseY) {

		// call superclass method
		//
		super.onMouseDrag(mouseX, mouseY);

		// find change in drag
		//
		let drag = this.getOffset(this.start, this.current);
		
		// compute new zoom
		//
		let zoom = this.zoom * (1 + drag.top / this.height * this.zoomFactor);

		// set zoom
		//
		this.viewer.setZoom(zoom);
	}

	//
	// static attributes
	//

	static zoomFactor = 5;
}