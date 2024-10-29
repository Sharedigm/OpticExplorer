/******************************************************************************\
|                                                                              |
|                            mouse-drag-behavior.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a mouse interaction behavior.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseBehavior from '../../../views/behaviors/mouse/mouse-behavior.js';
import Bounds2 from '../../../utilities/bounds/bounds2.js';

export default class MouseDragBehavior extends MouseBehavior {

	//
	// initializing methods
	//

	addMouseEventHandlers() {
		this.mouseDownHandler = (event) => {
			if (event.which != this.button) {
				return;
			}

			// set start and current positions
			//
			this.start = this.getMousePosition(event);
			this.current = this.start;

			// set to drag cursor
			//
			if (this.cursor) {
				this.setCursor(this.cursor);
			}
			
			// set mouse event handlers
			//
			if (this.blocking) {
				this.$el.on('mousemove', this.mouseDragHandler);
				this.$el.on('mouseup', this.mouseUpHandler);
			} else {
				$(window).on('mousemove', this.mouseDragHandler);
				$(window).on('mouseup', this.mouseUpHandler);				
			}

			// prevent Safari from changing the cursor
			// to an i-beam on mouse drag start events
			//
			this.$el.on('selectstart', function() {
				return false;
			});

			// handle event
			//
			this.onMouseDown(event);

			// block event from parent
			//
			this.block(event);
		};

		this.mouseDragHandler = (event) => {
			if (event.which != this.button) {
				return;
			}

			// update current position
			//
			this.current = this.getMousePosition(event);

			// handle event
			//
			this.onMouseDrag(event);

			// block event from parent
			//
			this.block(event);
		};

		this.mouseUpHandler = (event) => {
			if (event.which != this.button) {
				return;
			}

			// reset cursor
			//
			if (this.cursor) {
				this.resetCursor();
			}

			// remove mouse event handlers
			//
			if (this.blocking) {
				this.$el.off('mousemove', this.mouseDragHandler);
				this.$el.off('mouseup', this.mouseUpHandler);
			} else {
				$(window).off('mousemove', this.mouseDragHandler);
				$(window).off('mouseup', this.mouseUpHandler);			
			}

			// prevent Safari from changing the cursor
			// to an i-beam on mouse drag start events
			//
			this.$el.off('selectstart');

			// handle event
			//				
			this.onMouseUp(event);
			
			// reset start and current positions
			//
			this.start = undefined;
			this.current = undefined;
			
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

			// set start and current positions
			//
			if (this.button == 2) {
				this.start = this.getTouchPosition(event, 0);
				this.current = this.getTouchPosition(event, 1);
			} else {
				this.start = this.getTouchPosition(event, 0);
				this.current = this.start;
			}

			// handle event
			//
			this.onMouseDown(event);
			
			// set touch event handlers
			//
			this.$el.on('touchmove', this.touchMoveHandler);
			this.$el.on('touchend', this.touchEndHandler);

			// block event from parent
			//
			this.block(event);
		};

		this.touchMoveHandler = (event) => {

			// prevent rubber-band scrolling
			//
			event.preventDefault();

			// check if single or multi touch event
			//
			if (event.touches.length != this.button) {
				return;
			}

			// update start and current positions
			//
			if (this.button == 2) {
				this.start = this.getTouchPosition(event, 0);
				this.current = this.getTouchPosition(event, 1);
			} else {
				this.current = this.getTouchPosition(event, 0);	
			}

			// handle event
			//
			this.onMouseDrag(event);

			// block event from parent
			//
			this.block(event);
		};

		this.touchEndHandler = (event) => {

			// handle event
			//				
			this.onMouseUp(event);

			// reset start and current positions
			//
			this.start = undefined;
			this.current = undefined;

			// remove mouse event handlers
			//
			this.$el.off('touchmove');
			this.$el.off('touchend');

			// block event from parent
			//
			this.block(event);
		};
	}

	//
	// querying methods
	//

	isDragged() {
		return this.start && (this.start != this.current);
	}

	//
	// getting methods
	//

	getBounds() {
		let left, right, top, bottom;

		if (this.start.left < this.current.left) {
			left = this.start.left;
			right = this.current.left;
		} else {
			left = this.current.left;
			right = this.start.left;		
		}
		if (this.start.top < this.current.top) {
			bottom = this.start.top;
			top = this.current.top;
		} else {
			bottom = this.current.top;
			top = this.start.top;		
		}

		return new Bounds2({
			left: left,
			top: top,
			right: right,
			bottom: bottom
		});
	}

	//
	// mouse event handling methods
	//

	onMouseDrag(event) {
		
		// find drag
		//
		this.drag = this.getOffset(this.start, this.current);

		// perform callback
		//
		if (this.options.onmousedrag) {
			this.options.onmousedrag(event);
		}
	}
}