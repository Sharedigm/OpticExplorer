/******************************************************************************\
|                                                                              |
|                          mouse-drag-circle-behavior.js                       |
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

import Circle from '../../../../../models/shapes/circle.js';
import MouseDragBehavior from '../../../../../views/behaviors/mouse/mouse-drag-behavior.js';
import CircleView from '../../../../../views/svg/shapes/circle-view.js';

export default class MouseDragCircleBehavior extends MouseDragBehavior {

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
		this.view = new CircleView({
			model: new Circle({
				center: point, 
				radius: 0
			}),
			viewport: this.viewport
		});
		this.view.className = 'selection';

		// show view
		//
		this.viewport.show(this.view);
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

		// compute end point
		//
		let offset = this.viewport.$el.offset();
		let x = this.current.left - offset.left;
		let y = this.current.top - offset.top;		
		let point = this.viewport.toPoint(x, y);

		// update rect
		//
		this.view.model.set({
			radius: this.view.model.get('center').distanceTo(point)
		});
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