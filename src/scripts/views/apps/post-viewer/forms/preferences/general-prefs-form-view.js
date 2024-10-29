/******************************************************************************\
|                                                                              |
|                          general-prefs-form-view.js                          |
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
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
		
				<div class="show-options checkbox-inline">
					<label><input type="checkbox"<% if (show_options) { %> checked<% } %>>Options Buttons</label>
		
					<i class="active fa fa-question-circle" data-toggle="popover" title="Options" data-content="This determines if the option buttons (like, comment, reply) are shown. These functions are also available via the menu so these buttons are provided as a convenience."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		topics: {
			el: '.selector',
			replaceElement: true
		},
		items: '.items-per-page .range-input',
	},

	events: {
		'change .show-comments input': 'onChangeCheckbox',
		'change .show-options input': 'onChangeCheckbox'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_comments':
				return this.$el.find('.show-comments input').is(':checked');
			case 'show_options':
				return this.$el.find('.show-options input').is(':checked');
		}
	},

	getValues: function() {
		return {
			show_comments: this.getValue('show_comments'),
			show_options: this.getValue('show_options')
		};
	},

	//
	// form event handling methods
	//

	onChangeOption: function(event) {
		let className = $(event.target).closest('.form-group').attr('class');
		let option = className.replace('form-group', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);	
	},

	onChangeCheckbox: function(event) {
		let className = $(event.target).closest('.checkbox-inline').attr('class');
		let option = className.replace('checkbox-inline', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);	
	}
});
