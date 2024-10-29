/******************************************************************************\
|                                                                              |
|                                 animatable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of view behavior.                                 |
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
	// attributes
	//

	// default animation rate
	//
	fps: 30,

	//
	// animating methods
	//

	start: function(fps) {
		if (!fps) {
			fps = this.fps;
		}

		this.fpsInterval = 1000 / fps;
		this.then = Date.now();
		this.startTime = this.then;
		this.animate();
	},

	stop: function() {
		if (this.animationFrame) {
			window.cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}
	},

	animate: function() {

		// request another frame
		//
		this.animationFrame = requestAnimationFrame(() => {
			this.animate();
		});

		// calc elapsed time since last loop
		//
		this.now = Date.now();
		this.elapsed = this.now - this.then;

		// if enough time has elapsed, draw the next frame
		//
		if (this.elapsed > this.fpsInterval) {

			// Get ready for next frame by setting then=now, but also adjust for your
			// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
			//
			this.then = this.now - (this.elapsed % this.fpsInterval);

			// Put your drawing code here
			//
			if (this.$el.is(':visible')) {
				this.update();
			}
		}
	}
};