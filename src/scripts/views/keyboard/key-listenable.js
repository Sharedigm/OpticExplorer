/******************************************************************************\
|                                                                              |
|                                  key-listenable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a mixin for creating views that have keyboard behavior.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// attributes
	//

	events: {
		'keydown': 'onKeyDown',
		'keyup': 'onKeyUp'
	},

	// key mask
	//
	keyDown: [],

	//
	// constructor
	//

	initialize: function() {

		// create key handlers
		//
		$(window).on('keydown', (event) => {
			this.onKeyDown(event)
		});
		$(window).on('keyup', (event) => {
			this.onKeyUp(event)
		});
	},

	//
	// querying methods
	//

	isKeyDown: function(keycode) {
		return this.keyDown[keycode];
	},

	//
	// event handling methods
	//

	onKeyDown: function(event) {
		this.keyDown[event.keyCode] = true;
		this.trigger('keydown');
	},

	onKeyUp: function(event) {
		this.keyDown[event.keyCode] = false;
		this.trigger('keyup');
	}
};