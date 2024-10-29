/******************************************************************************\
|                                                                              |
|                            mouse-drag-behavior.js                            |
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

import MouseBehavior from '../../../../../views/behaviors/mouse/mouse-drag-behavior.js';

export default class MouseDragBehavior extends MouseBehavior {

	constructor(viewport, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// call superclass constructor
		//
		super(options.el || (viewport? viewport.el : null), options);

		// set attributes
		//
		this.viewport = viewport;
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// update viewport
		//
		if (this.viewport.onStartDrag) {
			this.viewport.onStartDrag(event, this);
		}
	}

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// update viewport
		//
		if (this.viewport.onDrag) {
			this.viewport.onDrag(event, this);
		}
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// update viewport
		//
		if (this.drag && this.viewport.onEndDrag) {
			this.viewport.onEndDrag(event, this);
		}
	}
}