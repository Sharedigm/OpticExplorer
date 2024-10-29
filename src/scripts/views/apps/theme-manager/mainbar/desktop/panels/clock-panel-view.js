/******************************************************************************\
|                                                                              |
|                             clock-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a settings form.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
		
				<div class="show-day checkbox-inline">
					<label><input type="checkbox"<% if (show_day) { %> checked<% } %>>Day of Week</label>
				</div>
		
				<div class="show-date checkbox-inline">
					<label><input type="checkbox"<% if (show_date) { %> checked<% } %>>Date</label>
				</div>
		
				<div class="show-time checkbox-inline">
					<label><input type="checkbox"<% if (show_time) { %> checked<% } %>>Time</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Show" data-content="This is which time values to show in the clock."></i>
			</div>
		</div>
		
		<div class="show-24hr form-group">
			<label class="control-label"><i class="fa fa-clock"></i>24 Hour</label>
			<div class="controls">
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_24hr) { %> checked<% } %> />
					&nbsp;<label>Show time in 24 hr / military format</label>
				</div>
			</div>
		</div>
		
		<div class="show-seconds form-group">
			<label class="control-label"><i class="fa fa-stopwatch"></i>Seconds</label>
			<div class="controls">
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_seconds) { %> checked<% } %> />
					&nbsp;<label>Show seconds</label>
				</div>
			</div>
		</div>
		
		<div class="show-led-time desktop-only form-group">
			<label class="control-label"><i class="fa fa-microchip"></i>LED</label>
			<div class="controls">
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_led_time) { %> checked<% } %> />
					&nbsp;<label>Show time using an LED display</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .show-day input': 'onChangeShowDay',
		'change .show-date input': 'onChangeShowDate',
		'change .show-time input': 'onChangeShowTime',
		'change .show-24hr input': 'onChangeShow24Hr',
		'change .show-seconds input': 'onChangeShowSeconds',
		'change .show-led-time input': 'onChangeShowLEDTime'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = application.settings.desktop;
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_day':
				return this.$el.find('.show-day input').is(':checked');
			case 'show_date':
				return this.$el.find('.show-date input').is(':checked');
			case 'show_time':
				return this.$el.find('.show-time input').is(':checked');
			case 'show_24hr':
				return this.$el.find('.show-24hr input').is(':checked');
			case 'show_seconds':
				return this.$el.find('.show-seconds input').is(':checked');
			case 'show_led_time':
				return this.$el.find('.show-led-time input').is(':checked');
		}
	},

	getValues: function() {
		return {
			show_day: this.getValue('show_day'),
			show_date: this.getValue('show_date'),
			show_time: this.getValue('show_time'),
			show_24hr: this.getValue('show_24hr'),
			show_seconds: this.getValue('show_seconds'),
			show_led_time: this.getValue('show_led_time')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_day: this.model.get('show_day'),
			show_date: this.model.get('show_date'),
			show_time: this.model.get('show_time'),
			show_24hr: this.model.get('show_24hr'),
			show_seconds: this.model.get('show_seconds'),
			show_led_time: this.model.get('show_led_time')
		};
	},

	//
	// event handling methods
	//

	onChangeShowDay: function() {
		this.model.set('show_day', this.getValue('show_day'));
		application.desktop.update();
	},

	onChangeShowDate: function() {
		this.model.set('show_date', this.getValue('show_date'));
		application.desktop.update();
	},

	onChangeShowTime: function() {
		this.model.set('show_time', this.getValue('show_time'));
		application.desktop.update();
	},

	onChangeShow24Hr: function() {
		this.model.set('show_24hr', this.getValue('show_24hr'));
		application.desktop.update();
	},

	onChangeShowSeconds: function() {
		this.model.set('show_seconds', this.getValue('show_seconds'));
		application.desktop.update();
	},

	onChangeShowLEDTime: function() {
		this.model.set('show_led_time', this.getValue('show_led_time'));
		application.desktop.update();	
	}
});