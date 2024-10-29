/******************************************************************************\
|                                                                              |
|                             dynamic-shadowing.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for dynamically rendering shadows.            |
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

	shadows: 'sometimes',
	dynamic_shadows: true,
	shadows_delay: 100,
	delayed_shadow_scale: 0.5,
	max_shadow_scale: 5,

	//
	// setting methods
	//

	setShadows: function(visible) {
		if (visible) {
			this.shadows = this.dynamic_shadows? 'sometimes' : 'always';
		} else {
			this.shadows = 'never';
		}
		this.updateShadows();
	},

	//
	// shadow updating methods
	//

	showShadows: function() {
		this.$el.removeClass('unshadowed');
	},

	hideShadows: function() {
		this.$el.addClass('unshadowed');
	},

	showDelayedShadows: function() {

		// show shadows if no change within a short period of time 
		//		
		clearTimeout(this.shadowing_timeout);
		this.hideShadows();
		this.shadowing_timeout = setTimeout(() => {
			clearTimeout(this.shadowing_timeout);

			// show / hide shadows
			//
			let scale = this.getRelativeScale();
			if (scale < this.max_shadow_scale) {
				this.showShadows();
			}
		}, this.shadows_delay);
	},

	showScaledShadows: function() {

		// show / hide shadows, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (scale <= this.max_shadow_scale) {

			// always show shadows
			//
			this.showShadows();
		} else {

			// hide shadows
			//
			this.hideShadows();
		}
	},

	showScaledDelayedShadows: function() {

		// show / hide shadows, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (scale <= this.delayed_shadow_scale) {

			// always show shadows
			//
			this.showShadows();
		} else if (scale < this.max_shadow_scale) {

			// show shadows if zoomed out
			//
			this.showDelayedShadows();
		} else {

			// hide shadows
			//
			this.hideShadows();
		}
	},

	updateShadows: function() {
		switch (this.shadows) {
			case 'always':
				this.showShadows();
				break;
			case 'sometimes':
				if (this.shadows_delay) {
					this.showScaledDelayedShadows();
				} else {
					this.showScaledShadows();
				}
				break;
			case 'never':
				this.hideShadows();
				break;
		}
	}
}