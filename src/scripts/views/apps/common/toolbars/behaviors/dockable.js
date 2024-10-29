/******************************************************************************\
|                                                                              |
|                                  dockable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of view behavior for docking and dragging.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../../../vendor/jquery/jquery-ui/js/plugins/draggable.js';

export default {

	//
	// attributes
	//

	events: {
		"dblclick .handle": 'onDoubleClickHandle'
	},

	draggable: true,
	duration: 500,
	offset: {},

	//
	// querying methods
	//

	getOffset: function() {
		return this.$el.offset();
	},

	//
	// setting methods
	//

	setOffset: function(offset) {
		this.$el.offset(offset);
	},

	//
	// methods
	//

	resetOffset: function(offset, options) {
		let start = this.getOffset();

		if (start.top == this.offset.top && start.left == this.offset.left) {
			return;
		}

		// animate
		//
		$({t: 0}).animate({t: 1}, {
			duration: options && options.duration? options.duration : 0,

			// callback
			//
			step: (t) => {
				this.setOffset({
					top: start.top + (offset.top - start.top) * t,
					left: start.left + (offset.left - start.left) * t
				});
			},

			complete: () => {
				this.$el.css('inset', '');

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// enable dragging
		//
		if (this.draggable) {
			this.enableDragging();
		}

		// get initial offset
		//
		this.offset = this.getOffset();
	},

	enableDragging: function() {

		// make parent draggable
		//
		this.$el.draggable({
			handle: this.$el.find('.handle')
		});
	},

	//
	// event handling methods
	//

	onDoubleClickHandle: function() {

		// reset to upper left
		//
		this.resetOffset(this.offset, {
			duration: this.duration,

			// callbacks
			//
			done: () => {

				// play 'minimize' sound
				//
				application.play('minimize');
			}
		});
	}
};