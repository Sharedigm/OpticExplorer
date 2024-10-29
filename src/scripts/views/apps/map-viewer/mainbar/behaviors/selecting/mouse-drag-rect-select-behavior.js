/******************************************************************************\
|                                                                              |
|                    mouse-drag-select-circle-behavior.js                      |
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

import MouseDragRectMeasureBehavior from '../../../../../../views/apps/map-viewer/mainbar/behaviors/measuring/mouse-drag-rect-measure-behavior.js';

export default class MouseDragRectSelectBehavior extends MouseDragRectMeasureBehavior {

	//
	// selecting methods
	//

	toggleView(view, bounds) {
		let viewBounds = view.getBounds? view.getBounds() : undefined;

		// check for bounds
		//
		if (!viewBounds) {
			return;
		}

		// select or deselect view
		//
		if (viewBounds.overlaps(bounds)) {

			// invert selection
			//
			if (view.selected) {
				if (view.isSelected()) {
					view.deselect();
				}
			} else {
				if (!view.isSelected()) {
					view.select();
				}							
			}
		} else {

			// revert selection
			//
			if (view.selected) {
				if (!view.isSelected()) {
					view.select();
				}
			} else {
				if (view.isSelected()) {
					view.deselect();
				}							
			}
		}
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// save initial selection
		//
		this.options.itemsView.each((view) => {
			view.selected = view.isSelected && view.isSelected();
		});
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
			let self = this;

			// get rect bounds
			//
			let bounds = this.getBounds();

			// select or deselect view
			//
			this.options.itemsView.each((view) => {
				self.toggleView(view, bounds);
			});
		}
	}

	//
	// mouse event handling methods
	//

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// reset selection
		//
		if (!event.shiftKey) {
			this.options.itemsView.each((view) => {
				view.selected = undefined;
			});
		}

		this.clear();
	}
}