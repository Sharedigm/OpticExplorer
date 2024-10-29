/******************************************************************************\
|                                                                              |
|                           mouse-drag-rect-behavior.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a dragging mouse interaction behavior.        |
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
import Bounds2 from '../../../utilities/bounds/bounds2.js';
import MouseDragBehavior from '../../../views/behaviors/mouse/mouse-drag-behavior.js';

export default class MouseDragRectBehavior extends MouseDragBehavior {

	constructor(element, options) {
		
		// call superclass constructor
		//
		super(element, options);

		// set attributes
		//
		this.autoscrollInterval = 30;
	}

	//
	// querying methods
	//

	isAutoScrolling() {
		return this.interval != undefined;
	}

	boundsOf(start, finish) {
		let left, right, top, bottom;

		// compute bounds
		//
		if (finish.left > start.left) {
			left = start.left;
			right = finish.left;
		} else {
			left = finish.left;
			right = start.left;
		}
		if (finish.top > start.top) {
			top = start.top;
			bottom = finish.top;
		} else {
			top = finish.top;
			bottom = start.top;
		}
		return new Bounds2(new Vector2(left, top), new Vector2(right, bottom));
	}

	//
	// getting methods
	//

	getBounds() {
		if (this.start && this.current) {
			return this.boundsOf(this.start, this.current);
		}
	}

	//
	// activating methods
	//

	off() {

		// call superclass method
		//
		super.off();

		// remove associated element
		//
		if (this.$rect) {
			this.$rect.remove();
			this.$rect = null;
		}
	}

	//
	// scrolling methdos
	//

	scrollBy(offset) {
		this.el.scrollTo(0, this.el.scrollTop + offset);
		this.start.top -= offset;
	}

	startAutoscroll() {
		let scrollHeight = this.el.scrollHeight;
		let rect = this.el.getBoundingClientRect();

		this.interval = window.setInterval(() => {

			// stop scrolling
			//
			if (this.autoscrollSpeed > 0) {
				if (this.el.scrollTop >= scrollHeight - rect.height) {
					this.stopAutoscroll();
					return;
				} 
			} else {
				if (this.el.scrollTop <= 0) {
					this.stopAutoscroll();
					return;
				}
			}

			// scroll by speed
			//
			this.scrollBy(this.autoscrollSpeed);
			this.update();
		}, this.autoscrollInterval); 
	}

	stopAutoscroll() {
		window.clearInterval(this.interval);
		this.interval = null;
	}

	updateAutoScroll(event) {
		let scrollHeight = this.el.scrollHeight;
		let rect = this.el.getBoundingClientRect();
		
		if (!this.isAutoScrolling()) {
			
			// start scrolling
			//
			if (event.clientY > rect.bottom) {

				// start scrolling down
				//
				if (this.el.scrollTop < scrollHeight - rect.height) {
					this.autoscrollSpeed = event.clientY - rect.bottom;
					this.startAutoscroll();
				}
			} else if (event.clientY < rect.top) {

				// start scrolling up
				//
				if (this.el.scrollTop > 0) {
					this.autoscrollSpeed = event.clientY - rect.top;
					this.startAutoscroll();
				}
			}
		} else {

			// stop scrolling
			//
			if (this.autoscrollSpeed > 0) {

				// stop scrolling down
				//
				if (event.clientY < rect.bottom) {
					this.stopAutoscroll();
				} else {
					this.autoscrollSpeed = event.clientY - rect.bottom;
				}
			} else {

				// stop scrolling up
				//
				if (event.clientY > rect.top) {
					this.stopAutoscroll();
				} else {
					this.autoscrollSpeed = event.clientY - rect.top;
				}
			}
		}
	}

	//
	// rendering methods
	//

	show() {

		// create new element
		//
		this.$rect = $('<span>', {
			class: 'selection rect'
		});

		// set position
		//
		let offset = this.$el.offset();
		this.$rect.css({
			position: 'absolute',
			left: this.start.left - offset.left,
			top: this.start.top - offset.top
		});

		// add new element
		//
		this.$el.append(this.$rect);
	}

	update() {
		let offset = this.$el.offset();
		let rect = this.getRect(this.start, this.current);
		
		rect.left -= offset.left;
		rect.top -= offset.top;
		this.$rect.css(_.extend(rect, {

			// add background position for dithering
			//
			'background-position': (rect.left % 2) + 'px ' + (rect.top % 2 + 1) + 'px'
		}));
	}

	//
	// mouse event handling methods
	//

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// handle autoscroll
		//
		if (this.autoscroll) {
			this.updateAutoScroll(event);
		}

		// show rect
		//
		if (!this.$rect) {
			this.show();
		}

		// update rect
		//
		this.update(event);

		// block event from parent
		//
		this.block(event);
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// clear autoscroll
		//
		if (this.interval) {
			window.clearInterval(this.interval);
			this.interval = null;
		}

		// remove rect
		//
		if (this.$rect) {
			this.$rect.remove();
			this.$rect = null;
		}
	}
}