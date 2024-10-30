/******************************************************************************\
|                                                                              |
|                         ray-tracing-prefs-form-view.js                       |
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
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="number-of-rays form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Number of Rays</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Sizebar Size" data-content="This is the size of the sizebar window pane."></i>
				</div>
			</div>
		</div>

		<div class="light-options form-group">
			<label class="control-label"><i class="fa fa-lightbulb"></i>Lights</label>
			<div class="controls">
		
				<div class="show-filled-lights checkbox-inline">
					<label><input type="checkbox"<% if (show_filled_lights) { %> checked<% } %>>Filled</label>
				</div>

				<div class="show-stroked-lights checkbox-inline">
					<label><input type="checkbox"<% if (show_stroked_lights) { %> checked<% } %>>Stroked</label>
				</div>

				<div class="show-transmitted-lights checkbox-inline">
					<label><input type="checkbox"<% if (show_transmitted_lights) { %> checked<% } %>>Transmitted</label>
				</div>

				<div class="show-obstructed-lights checkbox-inline">
					<label><input type="checkbox"<% if (show_obstructed_lights) { %> checked<% } %>>Obstructed</label>
				</div>

				<div class="show-reflected-lights checkbox-inline">
					<label><input type="checkbox"<% if (show_reflected_lights) { %> checked<% } %>>Reflected</label>
				</div>
			</div>
		</div>

		<div class="object-options form-group">
			<label class="control-label"><i class="fa fa-arrow-up-long"></i>Objects</label>
			<div class="controls">
		
				<div class="show-filled-objects checkbox-inline">
					<label><input type="checkbox"<% if (show_filled_objects) { %> checked<% } %>>Filled</label>
				</div>

				<div class="show-stroked-objects checkbox-inline">
					<label><input type="checkbox"<% if (show_stroked_objects) { %> checked<% } %>>Stroked</label>
				</div>

				<div class="show-transmitted-objects checkbox-inline">
					<label><input type="checkbox"<% if (show_transmitted_objects) { %> checked<% } %>>Transmitted</label>
				</div>

				<div class="show-obstructed-objects checkbox-inline">
					<label><input type="checkbox"<% if (show_obstructed_objects) { %> checked<% } %>>Obstructed</label>
				</div>

				<div class="show-reflected-objects checkbox-inline">
					<label><input type="checkbox"<% if (show_reflected_objects) { %> checked<% } %>>Reflected</label>
				</div>
			</div>
		</div>
	`),

	regions: {
		number_of_rays: '.number-of-rays .range-input',
	},

	events: {
		'change .show-lights input': 'onChangeShowLights',
		'change .show-filled-lights input': 'onChangeShowFilledLights',
		'change .show-stroked-lights input': 'onChangeShowStrokedLights',
		'change .show-transmitted-lights input': 'onChangeShowTransmittedLights',
		'change .show-obstructed-lights input': 'onChangeShowObstructedLights',
		'change .show-reflected-lights input': 'onChangeShowReflectedLights',

		'change .show-objects input': 'onChangeShowObjects',
		'change .show-filled-objects input': 'onChangeShowFilledObjects',
		'change .show-stroked-objects input': 'onChangeShowStrokedObjects',
		'change .show-transmitted-objects input': 'onChangeShowTransmittedObjects',
		'change .show-obstructed-objects input': 'onChangeShowObstructedObjects',
		'change .show-reflected-objects input': 'onChangeShowReflectedObjects'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'number_of_rays':
				return this.getChildView('number_of_rays').getValue();

			// lights
			//
			case 'show_lights':
				return this.$el.find('.show-lights input:checked').val();
			case 'show_filled_lights':
				return this.$el.find('.show-filled-lights input:checked').val();
			case 'show_stroked_lights':
				return this.$el.find('.show-stroked-lights input:checked').val();
			case 'show_transmitted_lights':
				return this.$el.find('.show-transmitted-lights input:checked').val();
			case 'show_obstructed_lights':
				return this.$el.find('.show-obstructed-lights input:checked').val();
			case 'show_reflected_lights':
				return this.$el.find('.show-reflected-lights input:checked').val();

			// objects
			//
			case 'show_objects':
				return this.$el.find('.show-objects input:checked').val();
			case 'show_filled_objects':
				return this.$el.find('.show-filled-objects input:checked').val();
			case 'show_stroked_objects':
				return this.$el.find('.show-stroked-objects input:checked').val();
			case 'show_transmitted_objects':
				return this.$el.find('.show-transmitted-objects input:checked').val();
			case 'show_obstructed_objects':
				return this.$el.find('.show-obstructed-objects input:checked').val();
			case 'show_reflected_objects':
				return this.$el.find('.show-reflected-objects input:checked').val();
		}
	},

	getValues: function() {
		return {
			number_of_rays: this.getValue('number_of_rays'),

			// lights
			//
			show_lights: this.getValue('show_lights'),
			show_filled_lights: this.getValue('show_filled_lights'),
			show_stroked_lights: this.getValue('show_stroked_lights'),
			show_transmitted_lights: this.getValue('show_transmitted_lights'),
			show_obstructed_lights: this.getValue('show_obstructed_lights'),
			show_reflected_lights: this.getValue('show_obstructed_lights'),

			// objects
			//
			show_objects: this.getValue('show_objects'),
			show_filled_objects: this.getValue('show_filled_objects'),
			show_stroked_objects: this.getValue('show_stroked_objects'),
			show_transmitted_objects: this.getValue('show_transmitted_objects'),
			show_obstructed_objects: this.getValue('show_obstructed_objects'),
			show_reflected_objects: this.getValue('show_obstructed_objects')
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'number_of_rays':
				this.getChildView('number_of_rays').setValue(value);
				break;

			// lights
			//
			case 'show_lights':
				this.$el.find('.show-lights input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_filled_lights':
				this.$el.find('.show-filled-lights input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_stroked_lights':
				this.$el.find('.show-stroked-lights input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_transmitted_lights':
				this.$el.find('.show-transmitted-lights input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_obstructed_lights':
				this.$el.find('.show-obstructed-lights input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_reflected_lights':
				this.$el.find('.show-reflected-lights input[type="checkbox"]').prop('checked', value);
				break;

			// objects
			//
			case 'show_objects':
				this.$el.find('.show-objects input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_filled_objects':
				this.$el.find('.show-filled-objects input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_stroked_object':
				this.$el.find('.show-stroked-objects input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_transmitted_objects':
				this.$el.find('.show-transmitted-objects input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_obstructed_objects':
				this.$el.find('.show-obstructed-objects input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_reflected_objects':
				this.$el.find('.show-reflected-objects input[type="checkbox"]').prop('checked', value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'number_of_rays':
				this.showNumberOfRays();
				break;
		}
	},

	showNumberOfRays: function() {
		this.showChildView('number_of_rays', new RangeInputView({

			// options
			//
			value: this.model.get('sidebar_size'),
			min: 2,
			max: 200,
			step: 1,

			// callbacks
			//
			onchange: () => this.onChangeNumberOfRays()
		}));
	},

	//
	// event handling methods
	//

	onChangeNumberOfRays: function() {
		this.onChangeValue('number_of_rays', this.getValue('number_of_rays'));
	},

	//
	// light event handling methods
	//

	onChangeShowLights: function() {
		this.onChangeValue('show_lights', this.getValue('show_lights'));
	},

	onChangeShowFilledLights: function() {
		this.onChangeValue('show_filled_lights', this.getValue('show_filled_lights'));
	},

	onChangeShowStrokedLights: function() {
		this.onChangeValue('show_stroked_lights', this.getValue('show_stroked_lights'));
	},

	onChangeShowTransmittedLights: function() {
		this.onChangeValue('show_transmitted_lights', this.getValue('show_transmitted_lights'));
	},

	onChangeShowObstructedLights: function() {
		this.onChangeValue('show_obstructed_lights', this.getValue('show_obstructed_lights'));
	},

	onChangeShowReflectedLights: function() {
		this.onChangeValue('show_reflected_lights', this.getValue('show_reflected_lights'));
	},

	//
	// object event handling methods
	//

	onChangeShowObjects: function() {
		this.onChangeValue('show_objects', this.getValue('show_objects'));
	},

	onChangeShowFilledObjects: function() {
		this.onChangeValue('show_filled_objects', this.getValue('show_filled_objects'));
	},

	onChangeShowStrokedObjects: function() {
		this.onChangeValue('show_stroked_objects', this.getValue('show_stroked_objects'));
	},

	onChangeShowTransmittedObjects: function() {
		this.onChangeValue('show_transmitted_objects', this.getValue('show_transmitted_objects'));
	},

	onChangeShowObstructedObjects: function() {
		this.onChangeValue('show_obstructed_objects', this.getValue('show_obstructed_objects'));
	},

	onChangeShowReflectedObjects: function() {
		this.onChangeValue('show_reflected_objects', this.getValue('show_reflected_objects'));
	}
});