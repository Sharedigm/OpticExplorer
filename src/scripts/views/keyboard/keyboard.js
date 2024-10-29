/******************************************************************************\
|                                                                              |
|                                   keyboard.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for keeping track of the keyboard state and         |
|        for triggering keyboard events on DOM elements that wouldn't          |
|        otherwise respond to keyboard events.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';
import Browser from '../../utilities/web/browser.js';

export default BaseModel.extend({

	//
	// attributes
	//
	
	keyDown: [],

	//
	// constructor
	//

	initialize: function() {

		// create key handlers
		//
		$(window).on('keydown', (event) => {

			// update key mask
			//
			this.keyDown[event.keyCode] = true;

			// trigger DOM event
			//
			this.trigger('keydown', event);
		});

		$(window).on('keypress', (event) => {

			// trigger DOM event
			//
			this.trigger('keypress', event);
		});

		$(window).on('keyup', (event) => {

			// update key mask
			//
			this.keyDown[event.keyCode] = false;

			// trigger DOM event
			//
			this.trigger('keyup', event);
		});

		// initialize keycode sets
		//
		if (this.constructor.arrowKeys.length == 0) {
			this.constructor.arrowKeys = [
				this.constructor.keyCodes['left arrow'],
				this.constructor.keyCodes['right arrow']
			];
		}
	},

	//
	// querying methods
	//

	isKeyDown: function(keycode) {
		return this.keyDown[keycode];
	},

	//
	// setting methods
	//

	reset: function() {

		// reset key mask
		//
		for (let key in this.keyDown) {
			this.keyDown[key] = false;
		}
	},
}, {

	//
	// static attributes
	//

	keyCodes: config.keycodes,
	arrowKeys: [],

	//
	// static methods
	//

	isAutorepeat: function(event) {
		return event.repeat || (event.kind == 'keydown' && application.keyDown[event.keyCode]);
	},

	//
	// converting methods
	//

	keyCodeToName: function(keyCode) {
		let keys = Object.keys(this.keyCodes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (this.keyCodes[key] == keyCode) {
				return key;
			}
		}
	},

	nameToKeyCode: function(name) {
		if (Browser.is_firefox && this.keyCodes[name + ' (Firefox)']) {
			return this.keyCodes[name + ' (Firefox)'];
		} 
		
		return this.keyCodes[name];
	}
});