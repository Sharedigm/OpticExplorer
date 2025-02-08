/******************************************************************************\
|                                                                              |
|                           display-prefs-form-view.js                         |
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
	`),

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
		}
	},

	getValues: function() {
		return {
			display: this.getValue('display')
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
		}
	},

	//
	// mouse event handling methods
	//

	onClickDisplay: function() {
		this.onChangeValue('display', this.getValue('display'));
	}
});