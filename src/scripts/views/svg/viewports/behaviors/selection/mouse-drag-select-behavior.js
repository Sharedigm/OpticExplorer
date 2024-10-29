/******************************************************************************\
|                                                                              |
|                          mouse-drag-select-behavior.js                       |
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

export default class MouseDragSelectBehavior extends MouseDragRectBehavior {

	//
	// selecting methods
	//

	toggle(view, bounds) {
		if (view.select && view.getBounds) {

			// select or deselect view
			//
			if (bounds.overlaps(view.getBounds())) {
				view.select();
			} else {
				view.deselect();
			}
		} else if (view.children) {

			// select children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.toggle(child, bounds);
			}
		}
	}

	select(view, bounds) {
		if (view.select && view.getBounds) {

			// select or deselect view
			//
			if (bounds.overlaps(view.getBounds())) {
				view.select();
			}
		} else if (view.children) {

			// select children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.select(child, bounds);
			}
		}
	}

	toggleBoundedBy(bounds) {
		let views =  this.view.options.viewport.getChildren();
		for (let i = 0; i < views.length; i++) {
			this.toggle(views[i], bounds);
		}
	}

	selectBoundedBy(bounds) {
		let views =  this.view.options.viewport.getChildren();
		for (let i = 0; i < views.length; i++) {
			this.select(views[i], bounds);
		}
	}

	//
	// listening methods
	//

	addDeselectListeners(view, bounds) {
		if (view.isSelected && view.addDeselectListener && view.getBounds) {

			// add deselect listener to selected view
			//
			if (view.isSelected() && view.getBounds().overlaps(bounds)) {
				view.addDeselectListener();
			}
		}

		if (view.children) {

			// add deselect listeners to children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.addDeselectListeners(child, bounds);
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
			if (event.shiftKey) {
				this.selectBoundedBy(bounds);
			} else {
				this.toggleBoundedBy(bounds);
			}
		}
	}

	onMouseUp(event) {

		// add deselect listeners to elements
		//
		if (this.view) {
			let rectSize = this.view.model.getDiagonal().length();
			if (rectSize > 0) {

				// get rect bounds
				//
				let bounds = this.view.model.getBounds();

				// add listeners to bounded views
				//
				let views =  this.view.options.viewport.getChildren();
				for (let i = 0; i < views.length; i++) {
					this.addDeselectListeners(views[i], bounds);
				}
			}
		}

		// call superclass method
		//
		super.onMouseUp(event);
	}
}