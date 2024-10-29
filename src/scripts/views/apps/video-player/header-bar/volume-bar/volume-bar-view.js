/******************************************************************************\
|                                                                              |
|                              volume-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a volume toolbar.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import VolumeDownButtonView from '../../../../../views/apps/video-player/header-bar/volume-bar/buttons/volume-down-button-view.js';
import VolumeUpButtonView from '../../../../../views/apps/video-player/header-bar/volume-bar/buttons/volume-up-button-view.js';
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="down" data-toggle="tooltip" title="Volume Down" data-placement="bottom"></div>
		<div class="current" data-toggle="tooltip" title="Volume" data-placement="bottom"></div>
		<div class="up" data-toggle="tooltip" title="Volume Up" data-placement="bottom"></div>
	`),

	regions: {
		down: '.down',
		current: '.current',
		up: '.up',
	},

	min: 0,
	max: 10,

	//
	// getting methods
	//

	getVolume: function() {
		return this.getChildView('current').getValue();
	},

	//
	// setting methods
	//

	setVolume: function(volume) {

		// clap to range
		//
		if (volume < this.min) {
			volume = this.min;
		}
		if (volume > this.max) {
			volume = this.max;
		}

		// update volume value
		//
		this.getChildView('current').setValue(Math.round(volume));

		// disable buttons
		//
		this.setItemsEnabled(false);

		return volume;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showRegions();

		// set initial state
		//
		this.setItemsEnabled(false);
	},

	showRegion: function(name) {
		switch (name) {
			case 'down':
				this.showChildView('down', new VolumeDownButtonView());
				break;
			case 'up':
				this.showChildView('up', new VolumeUpButtonView());
				break;
			case 'current':
				this.showCurrent();
				break;
		}
	},

	showCurrent: function() {
		this.showChildView('current', new RangeInputView({

			// options
			//
			value: this.options.volume,
			min: this.min,
			max: this.max,
			slider: true,
			input: false,

			// callbacks
			//
			onchange: (volume) => {

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(volume);
				}
			}
		}));
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// enable buttons
		//
		this.setItemsEnabled(true);
	}
});
