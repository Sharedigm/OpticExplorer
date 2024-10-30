/******************************************************************************\
|                                                                              |
|                            optics-prefs-form-view.js                         |
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

		<div class="element-options form-group">
			<label class="control-label"><i class="fa fa-database rotated flipped"></i>Elements</label>
			<div class="controls">

				<div class="show-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_elements) { %> checked<% } %>>Elements</label>
				</div>

				<div class="show-filled-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_filled_elements) { %> checked<% } %>>Filled</label>
				</div>

				<div class="show-stroked-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_stroked_elements) { %> checked<% } %>>Stroked</label>
				</div>

				<div class="show-shaded-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_shaded_elements) { %> checked<% } %>>Shaded</label>
				</div>

				<div class="show-illustrated-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_illustrated_elements) { %> checked<% } %>>Illustrated</label>
				</div>

				<div class="show-shadowed-elements checkbox-inline">
					<label><input type="checkbox"<% if (show_shadowed_elements) { %> checked<% } %>>Shadowed</label>
				</div>
			</div>
		</div>

		<div class="annotation-options form-group">
			<label class="control-label"><i class="fa fa-arrows-left-right-to-line"></i>Annotations</label>
			<div class="controls">

				<div class="show-annotations checkbox-inline">
					<label><input type="checkbox"<% if (show_annotations) { %> checked<% } %>>Annotations</label>
				</div>

				<div class="show-thickness checkbox-inline">
					<label><input type="checkbox"<% if (show_thickness) { %> checked<% } %>>Thickness</label>
				</div>

				<div class="show-spacing checkbox-inline">
					<label><input type="checkbox"<% if (show_spacing) { %> checked<% } %>>Spacing</label>
				</div>

				<div class="show-focal-points checkbox-inline">
					<label><input type="checkbox"<% if (show_focal_points) { %> checked<% } %>>Focal points</label>
				</div>

				<div class="show-principal-planes checkbox-inline">
					<label><input type="checkbox"<% if (show_principal_planes) { %> checked<% } %>>Principal Planes</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .show-elements input': 'onChangeShowElements',
		'change .show-filled-elements input': 'onChangeShowFilledElements',
		'change .show-stroked-elements input': 'onChangeShowStrokedElements',
		'change .show-shaded-elements input': 'onChangeShowShadedElements',
		'change .show-illustrated-elements input': 'onChangeShowIllustratedElements',
		'change .show-shadowed-elements input': 'onChangeShowShadowedElements',

		'change .show-annotations input': 'onChangeShowAnnotations',
		'change .show-thickness input': 'onChangeShowThickness',
		'change .show-spacing input': 'onChangeShowSpacing',
		'change .show-focal-points input': 'onChangeShowFocalPoints',
		'change .show-principal-planes input': 'onChangeShowPrincipalPlanes'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// elements
			//
			case 'show_elements':
				return this.$el.find('.show-elements input:checked').val();
			case 'show_filled_elements':
				return this.$el.find('.show-filled-elements input:checked').val();
			case 'show_stroked_elements':
				return this.$el.find('.show-stroked-elements input:checked').val();
			case 'show_shaded_elements':
				return this.$el.find('.show-shaded-elements input:checked').val();
			case 'show_illustrated_elements':
				return this.$el.find('.show-illustrated-elements input:checked').val();
			case 'show_shadowed_elements':
				return this.$el.find('.show-shadowed-elements input:checked').val();

			// annotations
			//
			case 'show_annotations':
				return this.$el.find('.show-annotations input:checked').val();
			case 'show_thickness':
				return this.$el.find('.show-thickness input:checked').val();
			case 'show_spacing':
				return this.$el.find('.show-spacing input:checked').val();
			case 'show_focal_points':
				return this.$el.find('.show-focal-points input:checked').val();
			case 'show_principal_planes':
				return this.$el.find('.show-principal-planes input:checked').val();
		}
	},

	getValues: function() {
		return {

			// elements
			//
			show_elements: this.getValue('show_elements'),
			show_filled_elements: this.getValue('show_filled_elements'),
			show_stroked_elements: this.getValue('show_stroked_elements'),
			show_shaded_elements: this.getValue('show_shaded_elements'),
			show_illustrated_elements: this.getValue('show_illustrated_elements'),
			show_shadowed_elements: this.getValue('show_shadowed_elements'),

			// annotations
			//
			show_annotations: this.getValue('show_annotations'),
			show_thickness: this.getValue('show_thickness'),
			show_spacing: this.getValue('show_spacing'),
			show_focal_points: this.getValue('show_focal_points'),
			show_principal_planes: this.getValue('show_principal_planes')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {

			// elements
			//
			case 'show_elements':
				this.$el.find('.show-elements input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_filled_elements':
				this.$el.find('.show-filled-elements input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_stroked_elements':
				this.$el.find('.show-stroked-elements input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_shaded_elements':
				this.$el.find('.show-shaded-elements input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_illustrated_elements':
				this.$el.find('.show-illustrated-elements input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_shadowed_elements':
				this.$el.find('.show-shadowed-elements input[type="checkbox"]').prop('checked', value);
				break;

			// annotations
			//
			case 'show_annotations':
				this.$el.find('.show-annotations input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_thickness':
				this.$el.find('.show-thickness input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_spacing':
				this.$el.find('.show-spacing input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_focal_points':
				this.$el.find('.show-focal-points input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_principal_planes':
				this.$el.find('.show-principal-planes input[type="checkbox"]').prop('checked', value);
				break;
		}
	},

	//
	// element event handling methods
	//

	onChangeShowElements: function() {
		this.onChangeValue('show_elements', this.getValue('show_elements'));
	},

	onChangeShowFilledElements: function() {
		this.onChangeValue('show_filled_elements', this.getValue('show_filled_elements'));
	},

	onChangeShowStrokedElements: function() {
		this.onChangeValue('show_stroked_elements', this.getValue('show_stroked_elements'));
	},

	onChangeShowShadedElements: function() {
		this.onChangeValue('show_shaded_elements', this.getValue('show_shaded_elements'));
	},

	onChangeShowIllustratedElements: function() {
		this.onChangeValue('show_illustrated_elements', this.getValue('show_illustrated_elements'));
	},

	onChangeShowShadowedElements: function() {
		this.onChangeValue('show_shadowed_elements', this.getValue('show_shadowed_elements'));
	},

	//
	// annotation event handling methods
	//

	onChangeShowAnnotations: function() {
		this.onChangeValue('show_annotations', this.getValue('show_annotations'));
	},

	onChangeShowThickness: function() {
		this.onChangeValue('show_thickness', this.getValue('show_thickness'));
	},

	onChangeShowSpacing: function() {
		this.onChangeValue('show_spacing', this.getValue('show_spacing'));
	},

	onChangeShowFocalPoints: function() {
		this.onChangeValue('show_focal_points', this.getValue('show_focal_points'));
	},

	onChangeShowPrincipalPlanes: function() {
		this.onChangeValue('show_principal_planes', this.getValue('show_principal_planes'));
	}
});