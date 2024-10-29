/******************************************************************************\
|                                                                              |
|                            mouse-move-behavior.js                            |
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
import Browser from '../../../utilities/web/browser.js';

export default class MouseMoveBehavior extends MouseBehavior {

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
			this.onMouseMove(event);

			// block event from parent
			//
			this.block(event);
		};
	}

	//
	// activating methods
	//

	on() {
		if (Browser.is_touch_enabled) {

			// bind touch event handlers
			//
			this.$el.on('touchmove', this.touchMoveHandler);
		} else {

			// bind mouse event handlers
			//
			this.$el.on('mousemove', this.mouseMoveHandler);
		}
	}

	off() {
		if (Browser.is_touch_enabled) {

			// unbind touch event handlers
			//
			this.$el.off('touchmove', this.touchMoveHandler);
		} else {
			
			// unbind mouse event handlers
			//
			this.$el.off('mousemove', this.mouseMoveHandler);
		}
	}

	//
	// mouse event handling methods
	//

	onMouseMove(event) {

		// perform callback
		//
		if (this.options.onmousemove) {
			this.options.onmousemove(event);
		}
	}
}