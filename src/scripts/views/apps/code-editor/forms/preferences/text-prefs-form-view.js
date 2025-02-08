/******************************************************************************\
|                                                                              |
|                           text-prefs-form-view.js                            |
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
		<div class="font-size form-group">
			<label class="control-label"><i class="fa fa-font"></i>Font Size</label>
			<div class="controls">
				<select style="float:left; margin-right:10px">
					<option value="10">10</option>
					<option value="11">11</option>
					<option value="12">12</option>
					<option value="13">13</option>
					<option value="14">14</option>
					<option value="15">15</option>
					<option value="16">16</option>
					<option value="18">18</option>
					<option value="20">20</option>
					<option value="24">24</option>
				</select>
				<label>px</label>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Font Size" data-content="This is font size to use for code display."></i>
			</div>
		</div>
		
		<div class="tab-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Tab Size</label>
			<div class="controls">
				<select style="float:left; margin-right:10px">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>
				<label>spaces</label>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tab Size" data-content="This is the number of spaces to use when indenting."></i>
			</div>
		</div>
		
		<div class="indenting form-group">
			<label class="control-label"><i class="fa fa-long-arrow-alt-right"></i>Indenting</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="indenting" value="tabs">Tabs</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="indenting" value="spaces">Spaces</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Indenting" data-content="This is whether to use tabs or spaces to indent code."></i>
			</div>
		</div>
		
		<div class="soft-wrap form-group">
			<label class="control-label"><i class="fa fa-exchange-alt"></i>Wrapping</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="wrapping" value="off">Off</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="wrapping" value="on">On</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="wrapping" value="80">80 chars</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Wrapping" data-content="This is how to display lines of code that are wider than the available width."></i>
			</div>
		</div>
	`),

	events: {
		'change .font-size select': 'onChangeFontSize',
		'change .tab-size select': 'onChangeTabSize',
		'click .soft-tabs input': 'onClickSoftTabs',
		'click .soft-wrap input': 'onClickSoftWrap',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'font_size':
				return parseInt(this.$el.find('.font-size option:selected').val());
			case 'tab_size':
				return parseInt(this.$el.find('.tab-size option:selected').val());
			case 'soft_tabs':
				return this.$el.find('.indenting input:checked').val() == 'spaces';
			case 'soft_wrap':
				return this.$el.find('.soft-wrap input:checked').val();
		}
	},

	getValues: function() {
		return {
			font_size: this.getValue('font_size'),
			tab_size: this.getValue('tab_size'),
			soft_tabs: this.getValue('soft_tabs'),
			soft_wrap: this.getValue('soft_wrap'),
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'font_size':
				this.$el.find('.font-size option[value=' + value + ']').attr('selected', true);
				break;
			case 'tab_size':
				this.$el.find('.tab-size option[value=' + value + ']').attr('selected', true);
				break;
			case 'soft_tabs':
				this.$el.find('.indenting input[value="' + (value? 'spaces' : 'tabs') + '"]').prop('checked', true);
				break;
			case 'soft_wrap':
				this.$el.find('.soft-wrap input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// event handling methods
	//

	onChangeFontSize: function() {
		this.onChangeValue('font_size', this.getValue('font_size'));
	},

	onChangeTabSize: function() {
		this.onChangeValue('tab_size', this.getValue('tab_size'));
	},

	onClickSoftTabs: function() {
		this.onChangeValue('soft_tabs', this.getValue('soft_tabs'));
	},

	onClickSoftWrap: function() {
		this.onChangeValue('soft_wrap', this.getValue('soft_wrap'));
	}
});
