/******************************************************************************\
|                                                                              |
|                           preferences-form-view.js                           |
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
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="messages-per-page form-group">
			<label class="control-label"><i class="fa fa-long-arrow-alt-down"></i>Messages / Page</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Messages / Page" data-content="This is the number of messages to display per page."></i>
				</div>
			</div>
		</div>
		
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
				<div class="show-elapsed-time checkbox-inline">
					<label><input type="checkbox"<% if (show_elapsed_time) { %> checked<% } %>>Elapsed Time</label>
					
					<i class="active fa fa-question-circle" data-toggle="popover" title="Comments" data-content="This determines if the elapsed time since messages were posted is shown."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		messages: '.messages-per-page .range-input',
	},

	events: {
		'change .messages-per-page input': 'onChangeOption',
		'change .show-elapsed-time input': 'onChangeCheckbox',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'messages_per_page':
				return Math.round(this.getChildView('messages').getValue());
			case 'show_elapsed_time':
				return this.$el.find('.show-elapsed-time input').is(':checked');
		}
	},

	getValues: function() {
		return {
			messages_per_page: this.getValue('messages_per_page'),
			show_elapsed_time: this.getValue('show_elapsed_time')
		};
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'messages':
				this.showMessages();
				break;
		}
	},

	showMessages: function() {
		this.showChildView('messages', new RangeInputView({

			// options
			//
			value: this.model.get('messages_per_page'),
			min: 0,
			max: 100,
			step: 5,
			scale: 'linear'
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

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
