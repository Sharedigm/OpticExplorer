/******************************************************************************\
|                                                                              |
|                              dynamic-shading.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for dynamically rendering shading.            |
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

	shading: 'sometimes',
	dynamic_shading: true,
	shading_delay: 0,
	delayed_shading_scale: 500,
	max_shading_scale: 50,

	//
	// setting methods
	//

	setShading: function(visible) {
		if (visible) {
			this.shading = this.dynamic_shading? 'sometimes' : 'always';
		} else {
			this.shading = 'never';
		}
		this.updateShading();
	},

	//
	// shading updating methods
	//

	showShading: function() {
		this.$el.removeClass('unshaded');
	},

	hideShading: function() {
		this.$el.addClass('unshaded');
	},

	showDelayedShading: function() {

		// show shading if no change within a short period of time 
		//		
		clearTimeout(this.shading_timeout);
		this.hideShading();
		this.shading_timeout = setTimeout(() => {
			clearTimeout(this.shading_timeout);

			// show / hide shading
			//
			let scale = this.getRelativeScale();
			if (scale < this.max_shading_scale) {
				this.showShading();
			}
		}, this.shading_delay);
	},

	showScaledShading: function() {

		// show / hide shading, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (scale <= this.max_shading_scale) {

			// always show shading
			//
			this.showShading();
		} else {

			// hide shading
			//
			this.hideShading();
		}
	},

	showScaledDelayedShading: function() {

		// show / hide shading, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (scale <= this.delayed_shading_scale) {

			// always show shading
			//
			this.showShading();
		} else if (scale < this.max_shading_scale) {

			// show shading if zoomed out
			//
			this.showDelayedShading();
		} else {

			// hide shading
			//
			this.hideShading();
		}
	},

	updateShading: function() {
		switch (this.shading) {
			case 'always':
				this.showShading();
				break;
			case 'sometimes':
				if (this.shading_delay) {
					this.showScaledDelayedShading();
				} else {
					this.showScaledShading();
				}
				break;
			case 'never':
				this.hideShading();
				break;
		}
	}
}