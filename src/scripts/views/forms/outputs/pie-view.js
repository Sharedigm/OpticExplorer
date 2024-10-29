/******************************************************************************\
|                                                                              |
|                                  pie-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a pie shaped region.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'pie',
	template: template(
		'<div class="empty slice"></div>' +
		'<div class="half-full first slice"></div>' +
		'<div class="half-empty last slice"></div>'),

	angle: 90,

	//
	// constuctor
	//

	initialize: function() {
		if (this.options.angle != undefined) {
			this.angle = this.options.angle;
		}
	},

	//
	// setting methods
	//

	setAngle: function(angle) {

		while (angle > 360) {
			angle -= 360;
		}

		if (angle < 180) {
			this.$el.find('.first.slice').removeClass('half-empty').addClass('half-full');
			this.$el.find('.last.slice').removeClass('half-full').addClass('half-empty');
			this.$el.find('.last.slice').css('transform', 'rotate(' + Math.floor(angle) + 'deg)');
		} else {
			this.$el.find('.first.slice').removeClass('half-empty').addClass('half-full');
			this.$el.find('.last.slice').removeClass('half-empty').addClass('half-full');
			this.$el.find('.last.slice').css('transform', 'rotate(' + Math.floor(180 + angle) + 'deg)');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.setAngle(this.angle);
	}
});