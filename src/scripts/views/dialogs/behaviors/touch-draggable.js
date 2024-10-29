/******************************************************************************\
|                                                                              |
|                              touch-draggable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for touch dragging dialogs.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Hammer from '../../../hammer.js';
import Browser from '../../../utilities/web/browser.js';

export default {

	//
	// querying methods
	//

	isDraggable: function() {
		return this.$el.find('.modal-header .handle').length > 0;
	},

	//
	// dragging methods
	//

	enableDrag: function() {

		// set attributes
		//
		this.draggable = true;

		// check if already enabled
		//
		if (this.target) {
			return;
		}

		// add drag handle
		//
		this.handle = $('<div class="handle">');
		this.$el.find('.modal-header').append(this.handle);

		// needed for MS Surface touch screen compatibility
		//
		if (Browser.is_touch_enabled) {
			this.handle.on('mousedown', function(event) {
				event.stopPropagation();
			});
		}

		// make handle draggable
		//
		this.element = this.$el.find('.modal-dialog')[0];
		this.target = new Hammer(this.$el.find('.modal-header')[0]);

		// handle panning
		//
		this.dragX = this.element.style.left? parseInt(this.element.style.left.replace('px', '')) : 0;
		this.dragY = this.element.style.top? parseInt(this.element.style.top.replace('px', '')) : 0;
		
		// add pan behavior
		//
		this.target.on("pan", (event) => {

			// check if item is draggable
			//
			if (!this.draggable) {
				return;
			}

			// check if drag started
			//
			if (!this.isDragging) {
				this.isDragging = true;
				this.onDragStart(event.srcEvent);
			}

			// we simply need to determine where the x,y of this
			// object is relative to where it's "last" known position is
			// NOTE: deltaX and deltaY are cumulative
			// Thus we need to always calculate 'real x and y' relative
			// to the "lastPosX/Y"
			//
			let dragX = this.dragX + event.deltaX;
			let dragY = this.dragY + event.deltaY;

			// move our element to that position
			//
			this.element.style.left = dragX + "px";
			this.element.style.top = dragY + "px";

			// finish drag
			//
			if (event.isFinal) {
				this.isDragging = false;
				this.dragX = parseInt(this.element.style.left.replace('px', ''));
				this.dragY = parseInt(this.element.style.top.replace('px', ''));
				this.onDragStop(event.srcEvent);
			}
		});
	},

	disableDrag: function() {
		this.draggable = false;
	},

	reenableDrag: function() {
		this.draggable = true;
	},

	resetDrag: function() {
		this.dragX = parseInt(this.element.style.left.replace('px', ''));
		this.dragY = parseInt(this.element.style.top.replace('px', ''));
	},

	//
	// event handling methods
	//

	onDragStart: function() {
		this.savePosition();
	},

	onDragStop: function(event) {
		if (event.clientX < 0 || event.clientX > $(window).width() ||
			event.clientY < 0 || event.clientY > $(window).height()) {
			this.onDragOut(event);
		}

		if (!this.options.height) {
			this.$el.find('.modal-dialog').css({
				'height': ''
			});
		}
	},

	onDragOut: function() {
		this.restorePosition();
		this.resetDrag();
	}
};