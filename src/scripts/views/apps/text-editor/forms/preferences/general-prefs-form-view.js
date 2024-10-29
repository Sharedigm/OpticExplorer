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
import FontSelectorView from '../../../../../views/forms/selectors/font-selector-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="font form-group">
			<label class="control-label"><i class="fa fa-font"></i>Font</label>
			<div class="controls">
				<div class="font-selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Font" data-content="This is font to use for text display."></i>
			</div>
		</div>
		
		<div class="font-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Font Size</label>
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
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Font Size" data-content="This is the size of the font used for text display."></i>
			</div>
		</div>
	`),

	regions: {
		font: {
			el: '.font-selector',
			replaceElement: true
		}
	},

	events: {
		'change .font select': 'onChangeFont',
		'change .font-size select': 'onChangeFontSize'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'font':
				return this.$el.find('.font select').val();
			case 'font_size':
				return this.$el.find('.font-size option:selected').val();
		}
	},

	getValues: function() {
		return {
			font: this.getValue('font'),
			font_size: parseInt(this.getValue('font_size'))
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'font':
				// this.$el.find('.font option[value=' + value + ']').attr('selected', true);
				break;
			case 'font_size':
				this.$el.find('.font-size option[value=' + value + ']').attr('selected', true);
				break;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		PreferencesFormView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showChildView('font', new FontSelectorView({
			initialValue: this.model.get('font')
		}));

		// set initial form values
		//
		this.setValues(this.model.attributes);
	},

	//
	// event handling methods
	//

	onChangeFont: function() {
		let font = this.$el.find('.font select').val();
		this.onChangeValue('font', font);
	},

	onChangeFontSize: function() {
		let fontSize = parseInt(this.$el.find('.font-size select').val());
		this.onChangeValue('font_size', fontSize);
	}
});
