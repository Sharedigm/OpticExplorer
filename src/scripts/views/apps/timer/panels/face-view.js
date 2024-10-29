/******************************************************************************\
|                                                                              |
|                                face-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an a view used for the face of a timer.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import PieView from '../../../../views/forms/outputs/pie-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'face',

	template: template(`
		<div class="pie"></div>
		
		<div class="digital display">
			<div class="digits">
				<div class="hours"><%= hours %></div>
				<div class="middle">
					<div class="minutes"><%= minutes %></div>
					<div class="colons">:</div>
					<div class="seconds"><%= seconds %></div>
				</div>
				<div class="hundredths"><%= hundredths %></div>
			</div>
		</div>
	`),

	regions: {
		'pie': {
			el: '.pie',
			replaceElement: true
		}
	},

	//
	// conversion methods
	//

	toString: function(number) {
		function pad(string) {
			return string.length == 1? '0' + string : string;
		}

		return pad(number.toString());
	},

	//
	// getting methods
	//

	getAngle: function(seconds) {
		return 360 * (seconds / 60);
	},

	//
	// setting methods
	//

	setTime: function(time) {
		let hours = time.hours;
		let minutes = time.minutes;
		let seconds = Math.floor(time.seconds);
		let hundredths = Math.floor((time.seconds - seconds) * 100);

		// update digital display
		//
		this.$el.find('.hours').html(this.toString(hours));
		this.$el.find('.minutes').html(this.toString(minutes));
		this.$el.find('.seconds').html(this.toString(seconds));
		this.$el.find('.hundredths').html(this.toString(hundredths));

		// update analog display
		//
		this.setAngle(this.getAngle(time.seconds));
	},

	setAngle: function(angle) {
		this.getChildView('pie').setAngle(angle);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			hours: this.toString(this.options.hours || 0),
			minutes: this.toString(this.options.minutes || 0),
			seconds: this.toString(this.options.seconds || 0),
			hundredths: this.toString(this.options.hundredths || 0)
		};
	},

	onRender: function() {
		this.showChildView('pie', new PieView({
			className: 'pie',
			angle: this.getAngle(this.options.seconds)
		}));

		// set display type
		//
		if (this.options.display) {
			this.$el.find('.pie').addClass(this.options.display);
			this.$el.find('.digital.display').addClass(this.options.display);
		}
		if (!this.options.show_hours) {
			this.$el.find('.digital.display .hours').css('visibility', 'hidden')
		}
		if (!this.options.show_hundredths) {
			this.$el.find('.digital.display .hundredths').css('visibility', 'hidden')
		}
	}
});