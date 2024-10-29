/******************************************************************************\
|                                                                              |
|                                 timeable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for containers.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {
	
	//
	// timeout methods
	//

	setTimeout: function(callback, delay) {

		// clear previous timeout
		//
		this.clearTimeout();

		// set new timeout
		//
		this.timeout = window.setTimeout(() => {
			this.timeout = null;

			// check that view still exists
			//
			if (this.isDestroyed()) {
				return;
			}
		
			// perform callback
			//
			callback();
		}, delay);

		return this.timeout;
	},

	clearTimeout: function() {

		// clear timeout, if it exists
		//
		if (this.timeout) {
			window.clearTimeout(this.timeout);
			this.timeout = null;
		}
	},

	//
	// interval methods
	//

	setInterval: function(callback, interval) {

		// clear previous interval
		//
		this.clearInterval();

		// create new interval
		//
		this.interval = window.setInterval(() => {

			// check that view still exists
			//
			if (this.isDestroyed()) {
				window.clearInterval(this.interval);
				this.interval = null;
				return;
			}
		
			// perform callback
			//
			callback();
		}, interval);
	},

	clearInterval: function() {

		// clear interval, if it exists
		//
		if (this.interval) {
			window.clearInterval(this.interval);
			this.interval = null;
		}
	},

	onBeforeDestroy: function() {

		// clear timers
		//
		this.clearTimeout();
		this.clearInterval();
	}
};