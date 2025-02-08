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
		<div class="mode form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Mode</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="mode" value="analog">Analog</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="mode" value="digital">Digital</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Mode" data-content="This is the mode that the clock is in."></i>
			</div>
		</div>
	`),

	events: {
		'click .mode input': 'onClickMode'
	},

	//
	// querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'mode':
				return this.$el.find('.mode input:checked').val();
		}
	},

	getValues: function() {
		return {
			mode: this.getValue('mode')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'mode':
				this.$el.find('.mode input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// mouse event handling methods
	//

	onClickMode: function() {
		this.onChangeValue('mode', this.getValue('mode'));
	}
});