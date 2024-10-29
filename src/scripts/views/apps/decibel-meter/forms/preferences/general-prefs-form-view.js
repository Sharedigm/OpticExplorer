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
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="display form-group">
			<label class="control-label"><i class="fa fa-display"></i>Display</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="display" value="led">LED</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="display" value="lcd">LCD</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Display" data-content="This is the type of display to use."></i>
			</div>
		</div>

		<div class="sensitivity form-group">
			<label class="control-label"><i class="fa fa-volume-up"></i>Sensitivity (%)</label>
			<div class="controls">
				<div class="range-input"></div>

				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Sensitivity" data-content="This is the sensitivity of the microphone input."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		sensitivity: '.sensitivity .range-input'
	},

	events: {
		'click .display input': 'onClickDisplay'
	},

	//
	// querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'display':
				return this.$el.find('.display input:checked').val();
			case 'sensitivity':
				return this.getChildView('sensitivity').getValue();
		}
	},

	getValues: function() {
		return {
			display: this.getValue('display'),
			sensitivity: this.getValue('sensitivity')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'display':
				this.$el.find('.display input[value="' + value + '"]').prop('checked', true);
				break;
			case 'sensitivity':
				this.getChildView('sensitivity').setValue(value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'sensitivity':
				this.showSensitivity();
				break;
		}
	},

	showSensitivity: function() {
		this.showChildView('sensitivity', new RangeInputView({

			// options
			//
			value: this.model.get('sensitivity'),
			min: 0,
			max: 200,
			step: 5,

			// callbacks
			//
			onchange: () => this.onChangeSensitivity()
		}));
	},

	//
	// event handling methods
	//

	onChangeSensitivity: function() {
		this.onChangeValue('sensitivity', this.getValue('sensitivity'));
	},

	//
	// mouse event handling methods
	//

	onClickDisplay: function() {
		this.onChangeValue('display', this.getValue('display'));
	}
});
