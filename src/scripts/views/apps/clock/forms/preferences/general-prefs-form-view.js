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
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
		
				<div class="show-mode checkbox-inline">
					<label><input type="checkbox"<% if (show_mode) { %> checked<% } %>>Mode Button</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Mode" data-content="This is whether or not to show the mode button."></i>
			</div>
		</div>
	`),

	events: {
		'click .show-mode input': 'onClickShowMode',
	},

	//
	// querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_mode':
				return this.$el.find('.show-mode input').is(':checked');
		}
	},

	getValues: function() {
		return {
			show_mode: this.getValue('show_mode')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'show_mode':
				this.$el.find('.show-mode input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// mouse event handling methods
	//

	onClickShowMode: function() {
		this.onChangeValue('show_mode', this.getValue('show_mode'));
	}
});