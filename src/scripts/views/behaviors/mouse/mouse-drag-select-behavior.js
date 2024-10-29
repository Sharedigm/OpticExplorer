/******************************************************************************\
|                                                                              |
|                          mouse-drag-select-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a selecting mouse interaction behavior.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Vector2 from '../../../utilities/math/vector2.js';
import MouseDragRectBehavior from '../../../views/behaviors/mouse/mouse-drag-rect-behavior.js';

export default class MouseDragSelectBehavior extends MouseDragRectBehavior {

	constructor(view, options) {
		let el;

		// find element
		//
		if (options) {
			el = options.el? options.el : view.el;
		} else {
			el = view.el;
		}

		// call superclass constructor
		//
		super(el, options);

		// set attributes
		//
		this.view = view;
		this.autoscroll = true;
	}

	//
	// setting methods
	//

	setSelected(view, bounds) {
		view.selected = view.isSelected();
		if (view.children) {

			// set children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.setSelected(child, bounds);
			}
		}
	}

	resetSelected(view, bounds) {
		view.selected = undefined;
		if (view.children) {

			// reset children
			//
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.resetSelected(child, bounds);
			}
		}
	}
	
	//
	// selecting methods
	//

	selectChildren(bounds) {
		let views = this.view.getChildren();
		for (let i = 0; i < views.length; i++) {
			this.select(views[i], bounds);
		}		
	}

	select(view, bounds) {
		if (view.select && view.getBounds) {

			// select or deselect view
			//
			if (view.getBounds().overlaps(bounds)) {

				// invert selection
				//
				if (view.selected) {
					if (view.isSelected()) {
						view.deselect({
							silent: true
						});
					}
				} else {
					if (!view.isSelected()) {
						view.select({
							silent: true
						});
					}							
				}
			} else {

				// revert selection
				//
				if (view.selected) {
					if (!view.isSelected()) {
						view.select({
							silent: true
						});
					}
				} else {
					if (view.isSelected()) {
						view.deselect({
							silent: true
						});
					}							
				}
			}
		}

		// select children
		//
		if (view.children) {
			for (let i = 0; i < view.children.length; i++) {
				let child = view.children.findByIndex(i);
				this.select(child, bounds);
			}
		}
	}

	//
	// rendering methods
	//

	update(event) {

		// call superclass method
		//
		super.update(event);

		// get rect bounds
		//
		let bounds = this.getBounds().offsetBy(new Vector2(-window.scrollX, -window.scrollY));

		// count selected
		//
		let numSelected = 0;
		if (this.options.onchange) {
			numSelected = this.view.numSelected();
		}

		// select bounded views
		//
		this.selectChildren(bounds);

		// check if no change
		//
		if (this.view.numSelected == numSelected) {
			return;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(event);
		}
	}

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

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// disable default selection
		//
		this.$el.addClass('unselectable');

		// reset selection
		//
		let views = this.view.getChildren();
		for (let i = 0; i < views.length; i++) {
			this.setSelected(views[i]);
		}
	}

	onMouseUp(event) {

		// disable default selection
		//
		this.$el.removeClass('unselectable');

		// add deselect listeners to elements
		//
		if (this.view) {

			// get rect bounds
			//
			let bounds = this.getBounds();

			// add listeners to bounded views
			//
			let views =  this.view.getChildren();
			for (let i = 0; i < views.length; i++) {
				this.addDeselectListeners(views[i], bounds);
			}
		}

		// call superclass method
		//
		super.onMouseUp(event);
	}
}