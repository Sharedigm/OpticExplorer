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

import MouseDragBehavior from '../../../../../views/behaviors/mouse/mouse-drag-behavior.js';
import TooltipShowable from '../../../../../views/behaviors/tips/tooltip-showable.js';
import Vector2 from '../../../../../utilities/math/vector2.js';

export default class MouseDragElementBehavior extends MouseDragBehavior {

	constructor(element, options) {

		// call superclass constructor
		//
		super(element, options);

		// set attributes
		//
		this.viewport = this.options.viewport;
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

	getElementLocation() {
		let x = $(this.el).attr('x') || 0;
		let y = $(this.el).attr('y') || 0;
		let units = {
			x: undefined,
			y: undefined			
		}

		// parse location
		//
		if (x.endsWith('mm')) {
			x = parseFloat(x.replace('mm', ''));
			units.x = 'mm';
		} else {
			x = parseFloat(x);
			units.x = 'pixels';
		}
		if (y.endsWith('mm')) {
			y = parseFloat(y.replace('mm', ''));
			units.y = 'mm';
		} else {
			y = parseFloat(y);
			units.y = 'pixels'
		}

		let location = new Vector2(x, y);
		location.units = units;

		return location;
	}

	//
	// setting methods
	//

	setElementLocation(location, options) {
		let point = new Vector2(location.x, location.y);

		// constrain location
		//
		if (this.options.constrain) {
			let constrained = this.options.constrain(point);
			if (constrained) {
				point = constrained;
			}
		}

		// set element horizontal location
		//
		if (!this.options.direction || this.options.direction == 'horizontal') {
			let x = options && options.precision? point.x.toPrecision(options.precision) / 1 : point.x;
			$(this.el).attr('x', x + (location.units.x? location.units.x : ''));
		}

		// set element vertical location
		//
		if (!this.options.direction || this.options.direction == 'vertical') {
			let y = options && options.precision? point.y.toPrecision(options.precision) / 1 : point.y;
			$(this.el).attr('y', y + (location.units.y? location.units.y : ''));
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

		let x = location.x + drag.left / this.options.viewport.scale;
		let y = location.y + drag.top / this.options.viewport.scale;
		let location2 = new Vector2(x, y);
		location2.units = location.units;

		return location2;
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
		this.location = this.getElementLocation();

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

		// update element location
		//
		this.setElementLocation(this.offsetLocation(this.location, drag));
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// re-enable tooltips
		//
		TooltipShowable.enableTooltips();
	}

	//
	// cleanup methods
	//

	onDestroy() {

		// reset cursor
		//
		if (this.cursor) {
			this.resetCursor();
		}
	}
}