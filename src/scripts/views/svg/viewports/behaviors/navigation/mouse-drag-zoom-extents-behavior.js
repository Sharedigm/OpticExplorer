/******************************************************************************\
|                                                                              |
|                       mouse-drag-zoom-extents-behavior.js                    |
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

import MouseDragRectBehavior from '../../../../../views/svg/viewports/behaviors/manipulation/mouse-drag-rect-behavior.js';

export default class MouseDragZoomExtentsBehavior extends MouseDragRectBehavior {

	constructor(viewport, options) {

		// call superclass constructor
		//
		super(viewport, options);

		// set attributes
		//
		this.cursor = 'nwse-resize';
	}

	//
	// mouse event handling methods
	//

	onMouseUp(event) {

		// end drag
		//
		if (this.view) {
			let rectSize = this.view.model.getDiagonal().length();
			let viewportSize = this.viewport.getFieldOfView() * 1.5;
			let scale = this.viewport.scale * (viewportSize / rectSize);
			
			// set viewport
			//
			if (rectSize > 0) {
				let offset = this.view.model.getCenter().scaledBy(-this.viewport.pixelsPerMillimeter);
				if (this.options.duration == 0) {

					// zoom instantly
					//
					this.viewport.setOffset(offset);
					this.viewport.setScale(scale);				
				} else {

					// animate zoom
					//
					this.viewport.transformTo(offset, scale, this.options);

					// perform callback
					//
					if (this.options.onzoom) {
						this.options.onzoom();
					}
				}
			}
		}

		// call superclass method
		//
		super.onMouseUp(event);
	}
}