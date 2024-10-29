/******************************************************************************\
|                                                                              |
|                        slide-show-prefs-form-view.js                         |
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
		<div class="slide-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Slide Duration (s)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Slide Duration" data-content="This is how long to display each image when in slide show mode."></i>
				</div>
			</div>
		</div>
		
		<div class="slide-looping form-group">
			<label class="control-label"><i class="fa fa-redo"></i>Slide Looping</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (slide_looping) { %> checked<% } %> />
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Slide Looping" data-content="This is whether or not to play the slide show in a repeating loop."></i>
			</div>
		</div>
	`),

	regions: {
		slide_duration: '.slide-duration .range-input'
	},

	events: {
		'click .slide-looping input[type="checkbox"]': 'onClickSlideLooping'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'slide_duration':
				return this.getChildView('slide_duration').getValue();			
			case 'slide_looping':
				return this.$el.find('.slide-looping input[type="checkbox"]').is(':checked');
		}
	},

	getValues: function() {
		return {
			slide_duration: this.getValue('slide_duration'),
			slide_looping: this.getValue('slide_looping')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'slide_duration':
				this.getChildView('slide_duration').setValue(value);
				break;
			case 'slide_looping':
				this.$el.find('.slide-looping input[type="checkbox"]').prop('checked', value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'slide_duration':
				this.showSlideDuration();
		}
	},

	showSlideDuration: function() {
		this.showChildView('slide_duration', new RangeInputView({

			// options
			//
			value: this.model.get('slide_duration'),
			min: 1,
			max: 10,
			step: 1
		}));		
	},

	//
	// mouse event handling methods
	//

	onClickSlideLooping: function() {
		this.onChangeValue('slide_looping', this.getValue('slide_looping'));
	}
});
