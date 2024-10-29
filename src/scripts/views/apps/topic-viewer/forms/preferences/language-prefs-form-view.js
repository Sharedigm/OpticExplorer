/******************************************************************************\
|                                                                              |
|                         language-prefs-form-view.js                          |
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
		<div class="translation form-group">
			<label class="control-label"><i class="fa fa-exchange-alt"></i>Translation</label>
			<div class="controls">
				<div class="checkbox-inline">
					<input type="checkbox"<% if (translation) { %> checked<% } %>>
					
					<i class="active fa fa-question-circle" data-toggle="popover" title="Translation" data-content="This determines if the messages are auto-translated to your language."></i>
				</div>
			</div>
		</div>
		
		<div class="language form-group">
			<label class="control-label"><i class="fa fa-language"></i>Language</label>
			<div class="controls">
				<select>
					<option></option>
					<% if (languages) { %>
					<% for (let i = 0; i < languages.length; i++) { %>
					<option value="<%= languages[i] %>"<% if (language == languages[i]) { %> selected<% } %>><%= languages[i] %></option>	
					<% } %>
					<% } %>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Language" data-content="This is your preferred language."></i>
			</div>
		</div>
	`),

	events: {
		'change .translation input': 'onChangeCheckbox',
		'change .language select': 'onChangeOption'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'translation':
				return this.$el.find('.translation input').is(':checked');
			case 'language':
				return this.$el.find('.language select').val();
		}
	},

	getValues: function() {
		return {
			translation: this.getValue('translation'),
			language: this.getValue('language')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			languages: application.session.get('config').languages
		};
	},

	//
	// event handling methods
	//

	onChangeCheckbox: function(event) {
		let className = $(event.target).closest('.form-group').attr('class');
		let option = className.replace('form-group', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);
	},

	onChangeOption: function(event) {
		let className = $(event.target).closest('.form-group').attr('class');
		let option = className.replace('form-group', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);
	}
});
