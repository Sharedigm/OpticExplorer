/******************************************************************************\
|                                                                              |
|                          mouse-drag-element-behavior.js                      |
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

import MouseDragBehavior from '../../../views/behaviors/mouse/mouse-drag-behavior.js';
import TooltipShowable from '../../../views/behaviors/tips/tooltip-showable.js';
import Vector2 from '../../../utilities/math/vector2.js';

export default class MouseDragElementBehavior extends MouseDragBehavior {

	constructor(element, options) {

		// call superclass constructor
		//
		super(element, options);

		// set attributes
		//
		this.viewport = this.options.viewport;
		// this.cursor = 'grabbing';
		this.blocking = true;
	}

	//
	// initializing methods
	//

	addMouseEventHandlers() {
		this.mouseMoveHandler = (event) => {

			// handle event
			//
			this.onMouseMove(event);

			// block event from parent
			//
			this.block(event);
		};

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
			this.viewport.$el.on('mousemove', this.mouseDragHandler);
			this.viewport.$el.on('mouseup', this.mouseUpHandler);

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
			// this.blocking = this.temp;
			this.viewport.$el.off('mousemove', this.mouseDragHandler);
			this.viewport.$el.off('mouseup', this.mouseUpHandler);

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
			// event.preventDefault();

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
	// activiting methods
	//

	on() {

		// call superclass method
		//
		super.on();

		// set cursor
		//
		if (this.cursor) {
			this.setCursor(this.cursor);
		}
	}

	off() {

		// call superclass method
		//
		super.off();

		// reset cursor
		//
		if (this.cursor) {
			this.resetCursor();
		}
	}

	//
	// getting methods
	//

	getLocation() {
		let x = $(this.el).attr('x');
		let y = $(this.el).attr('y');
		let location = new Vector2(x, y);

		// append units
		//
		location.units = {
			x: undefined,
			y: undefined
		};

		// parse location
		//
		if (location.x.endsWith('mm')) {
			location.x = parseFloat(location.x.replace('mm', ''));
			location.units.x = 'mm';
		} else {
			location.x = parseFloat(location.x);
			location.unit.x = 'pixels';
		}
		if (location.y.endsWith('mm')) {
			location.y = parseFloat(location.y.replace('mm', ''));
			location.units.y = 'mm';
		} else {
			location.y = parseFloat(location.y);
			location.units.y = 'pixels'
		}

		return location;
	}

	getElementPosition() {
		let offset = this.current;
		let viewportOffset = this.options.viewport.$el.offset();

		return {
			left: offset.left - viewportOffset.left,
			top: offset.top - viewportOffset.top
		};
	}

	//
	// setting methods
	//

	setLocation(location) {

		// compute new location
		//
		let x = location.x;
		let y = location.y;
		if (location.units.x == 'mm') {
			x += 'mm';
		}
		if (location.units.y == 'mm') {
			y += 'mm';
		}

		// set element location
		//
		$(this.el).attr('x', x);
		$(this.el).attr('y', y);

		// perform callback
		//
		if (this.options.ondragelement) {
			this.options.ondragelement(x, y);
		}
	}

	offsetLocation(location, drag) {

		// convert units
		//
		if (location.units.x == 'mm') {
			drag.left /= this.options.viewport.pixelsPerMillimeter;
		}
		if (location.units.y == 'mm') {
			drag.top /= this.options.viewport.pixelsPerMillimeter;
		}

		return {
			x: location.x + drag.left / this.options.viewport.scale,
			y: location.y + drag.top / this.options.viewport.scale,
			units: location.units
		}
	}

	//
	// mouse event handling methods
	//

	onMouseDown(event) {

		// call superclass method
		//
		super.onMouseDown(event);

		// save element location and units
		//
		this.location = this.getLocation();

		// disable tooltips while dragging
		//
		TooltipShowable.disableTooltips();
	}

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		// set location of element in original units
		//
		let drag = this.getOffset(this.start, this.current);
		this.setLocation(this.offsetLocation(this.location, drag));
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// re-enable tooltips
		//
		TooltipShowable.disableTooltips();
	}

	//
	// cleanup methods
	//

	onDestroy() {

		// remove class for cursor
		//
		this.$el.removeClass('grabbable');
	}
}