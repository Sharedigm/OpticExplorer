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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="theme form-group">
			<label class="control-label"><i class="fa fa-adjust"></i>Brightness</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="theme-kind" value="light"<% if (theme == 'light') { %> checked<% } %>>Light</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="theme-kind" value="medium"<% if (theme == 'medium') { %> checked<% } %>>Medium</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="theme-kind" value="dark"<% if (theme == 'dark') { %> checked<% } %>>Dark</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="theme-kind" value="auto"<% if (theme == 'auto') { %> checked<% } %>>Auto</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Brightness" data-content="This is the optics theme to use."></i>
			</div>
		</div>

		<div class="viewport-options form-group">
			<label class="control-label"><i class="fa fa-desktop"></i>Viewport</label>
			<div class="controls">
		
				<div class="show-grid checkbox-inline">
					<label><input type="checkbox"<% if (show_grid) { %> checked<% } %>>Grid</label>
				</div>

				<div class="show-optical-axis checkbox-inline">
					<label><input type="checkbox"<% if (show_optical_axis) { %> checked<% } %>>Optical Axis</label>
				</div>

				<div class="show-perpendicular-axis checkbox-inline">
					<label><input type="checkbox"<% if (show_perpendicular_axis) { %> checked<% } %>>Perpendicular Axis</label>
				</div>

				<div class="show-colored-viewport checkbox-inline">
					<label><input type="checkbox"<% if (show_colored_viewport) { %> checked<% } %>>Colored</label>
				</div>
			</div>
		</div>

		<div class="arrow-options form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Arrows</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" value="filled"<% if (arrow_style == 'filled') { %> checked<% } %>>Filled</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" value="stroked"<% if (arrow_style == 'stroked') { %> checked<% } %>>Stroked</label>
				</div>
			</div>
		</div>

		<div class="label-options form-group">
			<label class="control-label"><i class="fa fa-font"></i>Labels</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" value="diagonal"<% if (label_style == 'diagonal') { %> checked<% } %>>Diagonal</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" value="horizontal"<% if (label_style == 'horizontal') { %> checked<% } %>>Horizontal</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'click .theme-kind input': 'onClickThemeKind',
		'change .show-grid input': 'onChangeShowGrid',
		'change .show-optical-axis input': 'onChangeShowOpticalAxis',
		'change .show-perpendicular-axis input': 'onChangeShowPerpendicularAxis',
		'change .show-colored-viewport input': 'onChangeShowColoredViewport'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'theme_kind':
				return this.$el.find('.theme-kind input:checked').val();
			case 'show_grid':
				return this.$el.find('.show-grid input:checked').val();
			case 'show_optical_axis':
				return this.$el.find('.show-optical-axis input:checked').val();
			case 'show_perpendicular_axis':
				return this.$el.find('.show-perpendicular-axis input:checked').val();
			case 'show_colored_viewport':
				return this.$el.find('.show-colored-viewport input:checked').val();
		}
	},

	getValues: function() {
		return {
			theme_kind: this.getValue('theme_kind'),
			show_grid: this.getValue('show_grid'),
			show_optical_axis: this.getValue('show_optical_axis'),
			show_perpendicular_axis: this.getValue('show_perpendicular_axis'),
			show_colored_viewport: this.getValue('show_colored_viewport')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'theme_kind':
				this.$el.find('.theme-kind input[value="' + value + '"]').prop('checked', true);
				break;
			case 'show_grid':
				this.$el.find('.show-grid input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_optical_axis':
				this.$el.find('.show-optical-axis input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_perpendicular_axis':
				this.$el.find('.show-perpendicular-axis input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_colored_viewport':
				this.$el.find('.show-colored-viewport input[type="checkbox"]').prop('checked', value);
				break;
		}
	},

	//
	// event handling methods
	//

	onClickViewKind: function() {
		this.onChangeValue('theme_kind', this.getValue('theme_kind'));
	},

	onChangeShowGrid: function() {
		this.onChangeValue('show_grid', this.getValue('show_grid'));
	},

	onChangeShowOpticalAxis: function() {
		this.onChangeValue('show_optical_axis', this.getValue('show_optical_axis'));
	},

	onChangeShowPerpendicularAxis: function() {
		this.onChangeValue('show_perpendicular_axis', this.getValue('show_perpendicular_axis'));
	},

	onChangeShowColoredViewport: function() {
		this.onChangeValue('show_colored_viewport', this.getValue('show_colored_viewport'));
	}
});