/******************************************************************************\
|                                                                              |
|                                clock-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing the date and time.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import Timeable from '../../../../../../views/behaviors/effects/timeable.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'desktop-only clock',

	template: template(`
		<span class="icon"><i class="far fa-clock icon"></i></span>
		<div class="digits">
			<span class="date"><%= date %></span>
			<span class="time"><%= time %></span>
		</div>
	`),

	events: {
		'click .date': 'onClickDate',
		'click .time': 'onClickTime'
	},

	//
	// getting methods
	//

	getDate: function(options) {
		let format = '';
		if (options.show_day) {
			format += 'ddd';
		}
		if (options.show_date) {
			if (format != '') {
				format += ' ';
			}
			format += 'mmm d';
		}
		if (format != '') {
			return new Date().format(format, false);
		}	
	},

	getTime: function(options) {
		let format = '';
		if (options.show_time) {
			if (format != '') {
				format += ' ';
			}
			if (options.show_24hr) {
				format += 'HH:MM';
				if (options.show_seconds) {
					format += ':ss';
				}
			} else {
				format += 'h:MM';
				if (options.show_seconds) {
					format += ':ss';
				}
				format += ' TT';
			}
		}
		if (format != '') {
			return new Date().format(format, false);
		}
	},

	/*
	getDateTime: function(options) {
		let html = '';
		if (options.show_day || options.show_date) {
			html += '<span class="date">' + this.getDate(options) + '</span>';
		}
		if (options.show_time) {
			html += '<span class="time">' + this.getTime(options) + '</span>';
		}
		return html;
	},
	*/

	getInterval: function() {
		if (this.options.show_seconds) {

			// once per second
			//
			return 1000;
		} else {

			// once per minute
			//
			return 1000 * 60;
		}
	},

	//
	// setting methods
	//

	setShowLEDTime: function(showLEDTime) {

		// set LED style
		//
		if (showLEDTime) {
			this.$el.find('.digits').addClass('led').addClass('dot');
		} else {
			this.$el.find('.digits').removeClass('led').addClass('dot');
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			date: this.options.show_day || this.options.show_date? this.getDate(this.options) : undefined,
			time: this.options.show_time? this.getTime(this.options) : undefined
		};
	},

	onRender: function() {

		// set initial LED mode
		//
		this.setShowLEDTime(this.options.show_led_time);

		// add tooltip info
		//
		this.$el.find('.date').attr({
			'data-toggle': 'tooltip',
			'title': 'Date'
		});
		this.$el.find('.time').attr({
			'data-toggle': 'tooltip',
			'title': 'Time'
		});

		// add tooltip triggers
		//
		this.addTooltips({
			placement: 'bottom',
			container: 'body'
		});

		// schedule next update
		//
		this.setInterval(() => {
			this.update();
		}, this.getInterval());
	},

	updateDate: function() {
		if (this.options.show_day || this.options.show_date) {
			this.$el.find('.date').html(this.getDate(this.options));
		} else {
			this.$el.find('.date').html();
		}
	},

	updateTime: function() {
		if (this.options.show_time) {
			this.$el.find('.time').html(this.getTime(this.options));
		} else {
			this.$el.find('.time').html();
		}
	},

	update: function() {
		// this.$el.find('.digits').html(this.getDateTime(this.options));
		this.updateDate();
		this.updateTime();
	},

	//
	// mouse event handling methods
	//

	onClickDate: function() {
		application.launch('calendar');
	},

	onClickTime: function() {
		application.launch('clock');
	}
}));