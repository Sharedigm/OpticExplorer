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
		<div class="pan-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Pan Duration (ms)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Pan Duration" data-content="This is how long to take when panning a map side to side."></i>
				</div>
			</div>
		</div>
		
		<div class="zoom-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Zoom Duration (ms)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Duration" data-content="This is how long to take when zooming a map in or out."></i>
				</div>
			</div>
		</div>
		
		<div class="zoom-to-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Zoom To Duration (s)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Duration" data-content="This is how long to take when zooming a map to a particular place."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		pan_duration: '.pan-duration .range-input',
		zoom_duration: '.zoom-duration .range-input',
		zoom_to_duration: '.zoom-to-duration .range-input',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'pan_duration':
				return this.getChildView('pan_duration').getValue();
			case 'zoom_duration':
				return this.getChildView('zoom_duration').getValue();
			case 'zoom_to_duration':
				return this.getChildView('zoom_to_duration').getValue();
		}
	},

	getValues: function() {
		return {
			pan_duration: this.getValue('pan_duration'),
			zoom_duration: this.getValue('zoom_duration'),
			zoom_to_duration: this.getValue('zoom_to_duration')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'pan_duration':
				this.getChildView('pan_duration').setValue(value);
				break;
			case 'zoom_duration':
				this.getChildView('zoom_duration').setValue(value);
				break;
			case 'zoom_to_duration':
				this.getChildView('zoom_to_duration').setValue(value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'pan_duration':
				this.showPanDuration();
				break;
			case 'zoom_duration':
				this.showZoomDuration();
				break;
			case 'zoom_to_duration':
				this.showZoomToDuration();
				break;
		}
	},

	showPanDuration: function() {
		this.showChildView('pan_duration', new RangeInputView({

			// options
			//
			value: this.model.get('pan_duration'),
			min: 0,
			max: 1000,
			step: 100
		}));		
	},

	showZoomDuration: function() {
		this.showChildView('zoom_duration', new RangeInputView({

			// options
			//
			value: this.model.get('zoom_duration'),
			min: 0,
			max: 5000,
			step: 100
		}));	
	},

	showZoomToDuration: function() {
		this.showChildView('zoom_to_duration', new RangeInputView({

			// options
			//
			value: this.model.get('zoom_to_duration'),
			min: 0,
			max: 20,
			step: 1
		}));	
	}
});
