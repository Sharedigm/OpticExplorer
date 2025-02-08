/******************************************************************************\
|                                                                              |
|                           general-prefs-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Show</label>
			<div class="controls">

				<div class="show-hours checkbox-inline">
					<label><input type="checkbox"<% if (show_hours) { %> checked<% } %>>Hours</label>
				</div>

				<div class="show-hundredths checkbox-inline">
					<label><input type="checkbox"<% if (show_hundredths) { %> checked<% } %>>Hundredths</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Options" data-content="This is which display options to show."></i>
			</div>
		</div>

		<div class="direction form-group">
			<label class="control-label"><i class="fa fa-arrows-up-down"></i>Direction</label>
			<div class="controls">

				<div class="radio-inline">
					<label><input type="radio" name="direction" value="down">Down</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="direction" value="up">Up</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Direction" data-content="This is direction that the timer advances."></i>
			</div>
		</div>

		<div class="hours form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Time</label>
			<div class="controls">
				<div class="input-group" style="width:150px; float:left; margin-right:10px">
					<input type="text" class="hours form-control" size="2" value="<%= hours %>">
					<span class="input-group-addon">:</span>
					<input type="text" class="minutes form-control" size="2" value="<%= minutes %>">
					<span class="input-group-addon">:</span>
					<input type="text" class="seconds form-control" size="2" value="<%= seconds %>">
				</div>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Time" data-content="This is amount of time (hours : minutes : seconds) to count down or up."></i>
			</div>
		</div>
	`),

	events: {
		'change .show-hours input': 'onChangeShowHours',
		'change .show-hundredths input': 'onChangeShowHundredths',
		'change .direction input': 'onChangeDirection',
		'change .hours': 'onChangeHours',
		'change .minutes': 'onChangeMinutes',
		'change .seconds': 'onChangeSeconds'
	},

	//
	// querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_hours':
				return this.$el.find('.show-hours input').is(':checked');
			case 'show_hundredths':
				return this.$el.find('.show-hundredths input').is(':checked');
			case 'direction':
				return this.$el.find('.direction input:checked').val();
			case 'hours':
				return parseInt(this.$el.find('.hours').val());
			case 'minutes':
				return parseInt(this.$el.find('.minutes').val());
			case 'seconds':
				return parseInt(this.$el.find('.seconds').val());
		}
	},

	getValues: function() {
		return {
			show_hours: this.getValue('show_hours'),
			show_hundredths: this.getValue('show_hundredths'),
			direction: this.getValue('direction'),
			hours: this.getValue('hours'),
			minutes: this.getValue('minutes'),
			seconds: this.getValue('seconds')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'show_hours':
				this.$el.find('.show-hours input').prop('checked', value);
				break;
			case 'show_hundredths':
				this.$el.find('.show-hundredths input').prop('checked', value);
				break;
			case 'direction':
				this.$el.find('.direction input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	toTwoDigits: function(number) {
		return number.toLocaleString('en-US', {
			minimumIntegerDigits: 2,
			useGrouping: false
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_hours: this.model.get('show_hours'),
			show_hundredths: this.model.get('show_hundredths'),
			direction: this.model.get('direction'),
			hours: this.toTwoDigits(this.model.get('hours')),
			minutes: this.toTwoDigits(this.model.get('minutes')),
			seconds: this.toTwoDigits(this.model.get('seconds'))
		};
	},

	//
	// mouse event handling methods
	//

	onChangeShowHours: function() {
		this.onChangeValue('show_hours', this.getValue('show_hours'));
	},

	onChangeShowHundredths: function() {
		this.onChangeValue('show_hundredths', this.getValue('show_hundredths'));
	},

	onChangeDirection: function() {
		this.onChangeValue('direction', this.getValue('direction'));
	},

	onChangeHours: function() {
		this.onChangeValue('hours', this.getValue('hours'));
	},

	onChangeMinutes: function() {
		this.onChangeValue('minutes', this.getValue('minutes'));
	},

	onChangeSeconds: function() {
		this.onChangeValue('seconds', this.getValue('seconds'));
	}
});