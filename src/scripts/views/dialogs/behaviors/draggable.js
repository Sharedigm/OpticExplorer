/******************************************************************************\
|                                                                              |
|                                  draggable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for dragging dialogs.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../vendor/jquery/jquery-ui/js/plugins/draggable.js';

let rowPositions = ['top', 'middle', 'bottom'];
let colPositions = ['left', 'center', 'right'];

export default {

	//
	// querying methods
	//

	isContained: function(event) {
		let offset = this.$el.offset();
		let top = offset.top;
		let left = offset.left;
		let right = left + this.$el.width();
		let bottom = top + this.$el.height();

		// check if event location is defined
		//
		if (event.clientX == undefined || event.clientY == undefined) {
			return;
		}

		// check if event is contained in window
		//
		return event.clientX > left && event.clientX < right &&
			event.clientY > top && event.clientY < bottom;
	},

	isDraggable: function() {
		return this.$el.find('.modal-header .handle').length > 0;
	},

	//
	// getting methods
	//

	getDragPosition: function() {
		return [this.rows[this.tileRow], this.cols[this.tileCol]];
	},

	//
	// enabling methods
	//

	enableDrag: function() {

		// check if already enabled
		//
		if (this.hammer) {
			return;
		}

		// add drag handle
		//
		$('<div class="left handle">').insertBefore(this.$el.find('.heading'));
		$('<div class="right handle">').insertAfter(this.$el.find('.heading'));

		// make modal draggable
		//
		this.$el.find('.modal-dialog').draggable({
			handle: '.modal-header',
			scroll: false,

			// callbacks
			//
			start: (event) => {
				this.onDragStart(event);
			},
			drag: (event) => {
				this.onDrag(event);
			},
			stop: (event) => {
				this.onDragStop(event);
			}
		});
	},

	disableDrag: function() {
		this.$el.find('.modal-dialog').draggable('disable');
	},

	reenableDrag: function() {
		this.$el.find('.modal-dialog').draggable('enable');
	},

	//
	// mouse event handling methods
	//

	handleEvent: function(event) {
		let width = $(window).width();
		let height = $(window).height();
		let offset = this.$el.height() / 4;
		let x = event.clientX / width;
		let y = (event.clientY + offset) / height;

		this.tileRow = Math.floor(y * 3);
		this.tileCol = Math.floor(x * 3);
		this.tileWidth = width / 2;
		this.tileHeight = height / 2;
		this.tileX = Math.floor(x * 2) * this.tileWidth;
		this.tileY = Math.floor(y * 2) * this.tileHeight;
		this.tileRowPos = rowPositions[this.tileRow];
		this.tileColPos = colPositions[this.tileCol];

		// find if we are dragging to edges
		//
		let topOrBottom = Math.even(this.tileRow);
		let leftOrRight = Math.even(this.tileCol);
		
		if (topOrBottom && !leftOrRight) {

			// top / bottom
			//
			this.tileX = 0;
			this.tileWidth = width;
			this.tileColPos = undefined;
		} else if (leftOrRight && !topOrBottom) {

			// left / right
			//
			this.tileY = 0;
			this.tileHeight = height;
			this.tileRowPos = undefined;
		} else if (!topOrBottom && !leftOrRight) {

			// center
			//
			this.tileX = undefined;
			this.tileY = undefined;
			this.tileWidth = undefined;
			this.tileHeight = undefined;
			this.tileRowPos = undefined;
			this.tileColPos = undefined;
		}
	},

	onDragStart: function(event) {
		this.savePosition();

		// add modal overlay
		//
		if (event.shiftKey) {
			this.snapping = true;
			this.overlay = $('<div class="overlay"></div>');
			$('.modals').append(this.overlay);
		} else {
			this.snapping = false;
			this.overlay = null;
		}
	},

	onDrag: function(event) {

		// show window snap
		//
		if (this.snapping && this.isContained(event) == true) {
			this.handleEvent(event);

			// show modal overlay
			//
			if (this.tileRowPos || this.tileColPos) {
				let className = 'snap-to' + 
					(this.tileRowPos? ' ' + this.tileRowPos : '') + 
					(this.tileColPos? ' ' + this.tileColPos : '');
				$('.modals > .overlay').attr('class', 'overlay ' + className);
			} else {
				$('.modals > .overlay').attr('class', 'overlay');
			}
		}
	},

	onDragStop: function(event) {

		// check if we've dragged the window outside of the viewport
		//
		if (this.isContained(event) == false) {
			this.onDragOut(event);

			// play error sound
			//
			application.play('error');

		// snap window to tile bounds if shift key is down
		//
		} else if (this.snapping && event.shiftKey) {
			this.handleEvent(event);

			// reposition and resize window
			//
			if (this.tileWidth && this.tileHeight) {
				this.setPosition('absolute', {
					left: this.tileX,
					top: this.tileY
				});
				this.setSize([this.tileWidth, this.tileHeight]);
			} else {
				this.resetPosition();

				// reset size of resizeable dialogs
				//
				if (this.resizable) {
					this.resetSize();
				}
			}
		}

		// remove modal overlay
		//
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}

		// remove snap to overlays
		//
		$('.modals > .snap-to.overlay').remove();
	},

	onDragOut: function() {
		this.restorePosition();
	}
};