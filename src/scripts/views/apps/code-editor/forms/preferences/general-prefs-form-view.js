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
		<div class="show-gutter form-group">
			<label class="control-label"><i class="fa fa-ellipsis-v"></i>Gutter</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_gutter) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Gutter" data-content="This is whether or not to show the gutter contining line numbers."></i>
			</div>
		</div>
		
		<div class="show-indent-guides form-group">
			<label class="control-label"><i class="fa fa-indent"></i>Indent Guides</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_indent_guides) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Indent Guides" data-content="This is whether or not to show guide lines to show indentation."></i>
			</div>
		</div>
		
		<div class="show-print-margin form-group">
			<label class="control-label"><i class="fa fa-print"></i>Print Margin</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_print_margin) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Print Margin" data-content="This is whether or not to show the limits to the printable area."></i>
			</div>
		</div>
		
		<div class="show-invisibles form-group">
			<label class="control-label"><i class="fa fa-blind"></i>Invisibles</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (show_invisibles) { %> checked<% } %>>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Invisibles" data-content="This is whether or not to show invisible characters."></i>
			</div>
		</div>
	`),

	events: {
		'change .show-gutter input': 'onChangeShowGutter',
		'change .show-indent-guides input': 'onChangeShowIndentGuides',
		'change .show-print-margin input': 'onChangeShowPrintMargin',
		'change .show-invisibles input': 'onChangeShowInvisibles'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_gutter':
				return this.$el.find('.show-gutter input').is(':checked');
			case 'show_indent_guides':
				return this.$el.find('.show-indent-guides input').is(':checked');
			case 'show_print_margin':
				return this.$el.find('.show-print-margin input').is(':checked');
			case 'show_invisibles':
				return this.$el.find('.show-invisibles input').is(':checked');
		}
	},

	getValues: function() {
		return {
			show_gutter: this.getValue('show_gutter'),
			show_indent_guides: this.getValue('show_indent_guides'),
			show_print_margin: this.getValue('show_print_margin'),
			show_invisibles: this.getValue('show_invisibles')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'show_gutter':
				this.$el.find('.show-gutter input[value="' + value + '"]').prop('checked', true);
				break;
			case 'show_indent_guides':
				this.$el.find('.show-indent-guides input[value="' + value + '"]').prop('checked', true);
				break;
			case 'show_print_margin':
				this.$el.find('.show-print-margin input[value="' + value + '"]').prop('checked', true);
				break;
			case 'show_invisibles':
				this.$el.find('.show-invisibles input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// event handling methods
	//

	onChangeShowGutter: function() {
		this.onChangeValue('show_gutter', this.getValue('show_gutter'));
	},

	onChangeShowIndentGuides: function() {
		this.onChangeValue('show_indent_guides', this.getValue('show_indent_guides'));
	},

	onChangeShowPrintMargin: function() {
		this.onChangeValue('show_print_margin', this.getValue('show_print_margin'));
	},

	onChangeShowInvisibles: function() {
		this.onChangeValue('show_invisibles', this.getValue('show_invisibles'));
	}
});
