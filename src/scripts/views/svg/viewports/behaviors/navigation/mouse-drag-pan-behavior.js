/******************************************************************************\
|                                                                              |
|                             mouse-drag-pan-behavior.js                       |
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
import Vector2 from '../../../../../utilities/math/vector2.js';

export default class MouseDragPanBehavior extends MouseDragBehavior {

	constructor(viewport, options) {
		
		// call superclass constructor
		//
		super(viewport, options);

		// set attributes
		//
		this.cursor = 'move';
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// store viewport offset at start of drag
		//
		this.offset = this.viewport.offset || {
			x: 0,
			y: 0
		};
	}

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// find viewport offset
		//
		let offset = {
			x: this.offset.x + this.drag.left / this.viewport.scale,
			y: this.offset.y + this.drag.top / this.viewport.scale
		};

		// apply viewport offset
		//
		this.viewport.setOffset(new Vector2(offset.x, offset.y));
	}
}