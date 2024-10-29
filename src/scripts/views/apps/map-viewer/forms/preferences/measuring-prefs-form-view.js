/******************************************************************************\
|                                                                              |
|                          measuring-prefs-form-view.js                        |
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
		<div class="measuring-units form-group">
			<label class="control-label"><i class="fa fa-calculator"></i>Units</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="mode" value="imperial">Imperial</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="mode" value="metric">Metric</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Units" data-content="These are the units to use for measuring."></i>
			</div>
		</div>
		
		<div class="arrow-style form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Arrows</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="arrow-style" value="filled">Filled</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="arrow-style" value="stroked">Stroked</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Arrows" data-content="This determines how annotation arrows are displayed."></i>
			</div>
		</div>
		
		<div class="label-style form-group">
			<label class="control-label"><i class="fa fa-font"></i>Labels</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="label-style" value="rotated">Rotated</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="label-style" value="horizontal">Horizontal</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Labels" data-content="This determines how annotation labels are displayed."></i>
			</div>
		</div>
	`),

	events: {
		'click .measuring-units input': 'onClickUnits',
		'click .arrow-style input': 'onClickArrowStyle',
		'click .label-style input': 'onClickLabelStyle'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'measuring_units':
				return this.$el.find('.measuring-units input:checked').val();
			case 'arrow_style':
				return this.$el.find('.arrow-style input:checked').val();
			case 'label_style':
				return this.$el.find('.label-style input:checked').val();
		}
	},

	getValues: function() {
		return {
			measuring_units: this.getValue('measuring_units'),
			arrow_style: this.getValue('arrow_style'),
			label_style: this.getValue('label_style')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'measuring_units':
				this.$el.find('.measuring-units input[value="' + value + '"]').prop('checked', true);
				break;
			case 'arrow_style':
				this.$el.find('.arrow-style input[value="' + value + '"]').prop('checked', true);
				break;
			case 'label_style':
				this.$el.find('.label-style input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// mouse event handling methods
	//

	onClickUnits: function() {
		this.onChangeValue('measuring-units', this.getValue('measuring_units'));
	},

	onClickArrowStyle: function() {
		this.onChangeValue('arrow_style', this.getValue('arrow_style'));
	},

	onClickLabelStyle: function() {
		this.onChangeValue('label_style', this.getValue('label_style'));
	}
});
