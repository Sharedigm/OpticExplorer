/******************************************************************************\
|                                                                              |
|                           mouse-drag-rect-behavior.js                        |
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

import Rect from '../../../../../models/shapes/rect.js';
import MouseDragBehavior from '../../../../../views/behaviors/mouse/mouse-drag-behavior.js';
import RectView from '../../../../../views/svg/shapes/rect-view.js';

export default class MouseDragRectBehavior extends MouseDragBehavior {

	//
	// constructor
	//

	constructor(viewport, options) {

		// call superclass constructor
		//
		super(viewport? viewport.el : null, options);

		// set attributes
		//
		this.viewport = viewport;
	}

	//
	// rendering methods
	//

	show() {
		
		// compute start point
		//
		let offset = this.viewport.$el.offset();
		let x = this.start.left - offset.left;
		let y = this.start.top - offset.top;
		let point = this.viewport.toPoint(x, y);

		// create rect view
		//
		this.view = new RectView({
			model: new Rect({
				point1: point, 
				point2: point
			}),
			viewport: this.viewport
		});
		this.view.className = 'selection';

		// show view
		//
		this.viewport.show(this.view);
	}

	updateRect() {

		// compute end point
		//
		let offset = this.viewport.$el.offset();
		let x = this.current.left - offset.left;
		let y = this.current.top - offset.top;		
		let point = this.viewport.toPoint(x, y);

		// update rect
		//
		this.view.model.set({
			point2: point
		});
	}

	clear() {
		if (this.view) {
			this.view.destroy();
			this.view = null;
		}
	}

	//
	// activating methods
	//

	off() {

		// call superclass method
		//
		super.off();

		// remove associated views
		//
		this.clear();
	}

	//
	// mouse event handling methods
	//

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// show rect
		//
		if (!this.view) {
			this.show();
		}

		this.updateRect();
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// destroy rect
		//
		if (this.view) {
			this.view.destroy();
			this.view = null;
		}
	}
}