/******************************************************************************\
|                                                                              |
|                              mouse-behavior.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of an abstract mouse behavior.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../utilities/web/browser.js';

export default class MouseBehavior {

	constructor(element, options) {
		if (!element) {
			return;
		}

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		if (options.on == undefined) {
			options.on = true;
		}
		if (options.cursor == undefined) {
			options.cursor = this.cursor;
		}
		if (options.button == undefined) {
			options.button = 1;
		}
		if (options.blocking == undefined) {
			options.blocking = false;
		}
		
		// set attributes
		//
		this.$el = $(element);
		this.el = $(element)[0];
		this.cursor = options.cursor;
		this.button = options.button;
		this.blocking = options.blocking;
		this.options = options;

		//
		// create event handlers
		//
		if (Browser.is_touch_enabled) {
			this.addTouchEventHandlers();
		} else {
			this.addMouseEventHandlers();
		}

		// activate behavior
		//
		if (this.options.on) {
			this.on();
		}
	}

	//
	// initializing methods
	//

	addMouseEventHandlers() {
		this.mouseDownHandler = (event) => {
			if (event.which != this.button) {
				return;
			}
			
			// set mouse event handlers
			//
			this.$el.on('mouseup', this.mouseUpHandler);

			// handle event
			//
			this.onMouseDown(event);

			// block event from parent
			//
			this.block(event);
		};

		this.mouseUpHandler = (event) => {
			if (event.which != this.button) {
				return;
			}

			// remove mouse event handlers
			//
			this.$el.off('mouseup', this.mouseUpHandler);

			// handle event
			//				
			this.onMouseUp(event);			
			this.onClick(event);
			
			// block event from parent
			//
			this.block(event);
		};
	}

	addTouchEventHandlers() {
		this.touchStartHandler = (event) => {

			// check if single or multi touch event
			//
			if (event.touches.length != this.button) {
				return;
			}

			// handle event
			//
			this.onMouseDown(event);
			
			// set touch event handlers
			//
			this.$el.on('touchend', this.touchEndHandler);

			// block event from parent
			//
			this.block(event);
		};

		this.touchEndHandler = (event) => {

			// handle event
			//				
			this.onMouseUp(event);

			// remove mouse event handlers
			//
			this.$el.off('touchend');

			// block event from parent
			//
			this.block(event);
		};
	}

	//
	// getting methods
	//

	getMousePosition(event) {
		return {
			left: event.clientX,
			top: event.clientY
		};		
	}

	getTouchPosition(event, index) {
		return {
			left: event.touches[index || 0].clientX,
			top: event.touches[index || 0].clientY
		};
	}

	getEventPosition(event, index) {
		if (!event.type.includes('touch')) {
			return this.getMousePosition(event);
		} else {
			return this.getTouchPosition(event, index);
		}
	}

	getMouseOffset(event) {
		return {
			left: event.offsetX,
			top: event.offsetY
		};
	}

	getTouchOffset(event, index) {
		let rect = event.target.getBoundingClientRect();
		return {
			left: event.targetTouches[index || 0].clientX - rect.left,
			top: event.targetTouches[index || 0].clientY - rect.top
		}
	}

	getEventOffset(event, index) {
		if (!event.type.includes('touch')) {
			return this.getMouseOffset(event);
		} else {
			return this.getTouchOffset(event, index);
		}
	}

	getOffset(start, finish) {
		return {
			left: finish.left - start.left,
			top: finish.top - start.top
		};
	}

	getDistance(start, finish) {
		return Math.sqrt(Math.sqr(start.left - finish.left) + Math.sqr(start.top - finish.top));
	}

	getRect(start, finish) {
		return {
			left: start.left < finish.left? start.left : finish.left,
			top: start.top < finish.top? start.top : finish.top,
			width: Math.abs(finish.left - start.left),
			height: Math.abs(finish.top - start.top)
		};
	}

	getCursor() {
		return this.$el.css('cursor');
	}

	//
	// setting methods
	//

	setCursor(cursor) {
		this.previousCursor = this.getCursor();
		this.$el.css('cursor', cursor);
	}

	resetCursor() {
		this.setCursor(this.previousCursor);
	}

	//
	// activating methods
	//

	on() {
		if (Browser.is_touch_enabled) {

			// bind touch event handlers
			//
			this.$el.on('touchstart', this.touchStartHandler);
		} else {

			// bind mouse event handlers
			//
			this.$el.on('mousedown', this.mouseDownHandler);
		}
	}

	off() {
		if (Browser.is_touch_enabled) {

			// unbind touch event handlers
			//
			this.$el.off('touchstart', this.touchStartHandler);
		} else {
			
			// unbind mouse event handlers
			//
			this.$el.off('mousedown', this.mouseDownHandler);
		}
	}

	//
	// event handling methods
	//

	block(event) {

		// block event from parent
		//
		if (this.blocking) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// perform callback
		//
		if (this.options.onmousedown) {
			this.options.onmousedown(event);
		}
	}

	onMouseUp(event) {

		// perform callback
		//
		if (this.options.onmouseup) {
			this.options.onmouseup(event);
		}
	}

	onClick(event) {

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(event);
		}
	}
}