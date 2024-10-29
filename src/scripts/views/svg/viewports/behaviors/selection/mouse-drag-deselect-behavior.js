/******************************************************************************\
|                                                                              |
|                         mouse-drag-deselect-behavior.js                      |
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

export default class MouseDragDeselectBehavior extends MouseDragRectBehavior {

	constructor(viewport, options) {

		// call superclass constructor
		//
		super(viewport, options);

		// set attributes
		//
		this.cursor = 'nwse-resize';
	}

	//
	// selecting methods
	//

	deselect(view, bounds) {
		if (view.select && view.getBounds) {

			// deselect view
			//
			if (view.getBounds().overlaps(bounds)) {
				view.deselect();
			}
		} else if (view.children) {

			// deselect children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.deselect(child, bounds);
			}
		}
	}

	//
	// activating methods
	//

	on() {

		// remove all deselect listeners
		//
		let views = this.viewport.getChildren();
		for (let i = 0; i < views.length; i++) {
			this.removeDeselectListeners(views[i]);
		}

		// call superclass method
		//
		super.on();
	}

	removeDeselectListeners(view) {

		// remove deselect listener from view
		//
		if (view.removeDeselectListener) {
			view.removeDeselectListener();
		}

		if (view.children) {

			// add deselect listeners to children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.removeDeselectListeners(child);
			}
		}		
	}
	
	//
	// mouse event handling methods
	//

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// select elements
		//
		let rectSize = this.view.model.getDiagonal().length();
		if (rectSize > 0) {

			// get rect bounds
			//
			let bounds = this.view.model.getBounds();

			// select bounded views
			//
			let views = this.view.options.viewport.getChildren();
			for (let i = 0; i < views.length; i++) {
				this.deselect(views[i], bounds);
			}
		}
	}
}