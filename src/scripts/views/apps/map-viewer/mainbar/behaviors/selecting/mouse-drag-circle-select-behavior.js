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

import MouseDragCircleMeasureBehavior from '../../../../../../views/apps/map-viewer/mainbar/behaviors/measuring/mouse-drag-circle-measure-behavior.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default class MouseDragCircleSelectBehavior extends MouseDragCircleMeasureBehavior {

	//
	// selecting methods
	//

	toggleView(view, center, radius) {
		let viewBounds = view.getBounds? view.getBounds() : undefined;

		// check for bounds
		//
		if (!viewBounds) {
			return;
		}

		// select or deselect view
		//
		if (viewBounds.within(center, radius)) {

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
		let radius = this.view.model.get('radius');
		if (radius > 0) {
			let self = this;
			let center = new Vector2(this.start.left, this.start.top);
			let current = new Vector2(this.current.left, this.current.top);
			let radius = current.distanceTo(center);

			// select or deselect view
			//
			this.options.itemsView.each((view) => {
				self.toggleView(view, center, radius);
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