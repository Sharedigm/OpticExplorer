/******************************************************************************\
|                                                                              |
|                          effects-prefs-form-view.js                          |
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

export default PreferencesFormView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="zoom-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Zoom Duration (ms)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Duration" data-content="This is how long to take when zooming an image in or out."></i>
				</div>
			</div>
		</div>
		
		<div class="rotate-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Rotate Duration (ms)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Rotate Duration" data-content="This is how long to take when rotating an image."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		zoom_duration: '.zoom-duration .range-input',
		rotate_duration: '.rotate-duration .range-input'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'zoom_duration':
				return this.getChildView('zoom_duration').getValue();
			case 'rotate_duration':
				return this.getChildView('rotate_duration').getValue();
		}
	},

	getValues: function() {
		return {
			zoom_duration: this.getValue('zoom_duration'),
			rotate_duration: this.getValue('rotate_duration')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'zoom_duration':
				this.getChildView('zoom_duration').setValue(value);
				break;
			case 'rotate_duration':
				this.getChildView('rotate_duration').setValue(value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'zoom_duration':
				this.showZoomDuration();
				break;
			case 'rotate_duration':
				this.showRotateDuration();
				break;
		}
	},

	showZoomDuration: function() {
		this.showChildView('zoom_duration', new RangeInputView({

			// options
			//
			value: this.model.get('zoom_duration'),
			min: 0,
			max: 1000,
			step: 100
		}));		
	},

	showRotateDuration: function() {
		this.showChildView('rotate_duration', new RangeInputView({

			// options
			//
			value: this.model.get('rotate_duration'),
			min: 0,
			max: 1000,
			step: 100
		}));	
	}
});
