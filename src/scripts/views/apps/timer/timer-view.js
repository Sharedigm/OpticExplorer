/******************************************************************************\
|                                                                              |
|                                timer-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for performing timing.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppView from '../../../views/apps/common/app-view.js';
import FaceView from '../../../views/apps/timer/panels/face-view.js';
import ButtonsView from '../../../views/apps/timer/panels/buttons-view.js';
import PreferencesFormView from '../../../views/apps/timer/forms/preferences/preferences-form-view.js'
import TimeUtils from '../../../utilities/time/time-utils.js';

export default AppView.extend({

	//
	// attributes
	//

	name: 'timer',

	template: template(`
		<div class="body last">
			<div class="face"></div>
			<div class="buttons"></div>
		</div>
	`),

	regions: {
		face: {
			el: '.face',
			replaceElement: true
		},
		buttons: {
			el: '.buttons',
			replaceElement: true
		}
	},

	//
	// dialog attributes
	//
	
	size: [300, 300],
	resizable: true,
	maximizable: true,
	min_size: [300, 300],

	//
	// timing methods
	//

	start: function() {
		if (this.blinking) {
			return;
		}

		// set start time
		//
		if (!this.interval) {
			this.startTime = new Date();
		}

		// start updating at regular intervals
		//
		let updateInterval = this.preferences.get('show_hundredths')? 30 : 1000;
		this.setInterval(() => {
			this.update();
		}, updateInterval);

		// perform initial update
		//
		window.setTimeout(() => {
			this.update();
		}, 10);
		
		this.getChildView('buttons').start();
	},

	toggle: function() {
		if (this.interval) {
			this.stop();
		} else {
			this.start();
		}
	},

	stop: function() {
		this.clearInterval(this.blinking);
		this.elapsed += TimeUtils.getElapsedSeconds(this.startTime, new Date()) * this.direction;
		this.getChildView('buttons').stop();
	},

	reset: function() {

		// reset display
		//
		this.stop();
		this.stopBlinking();
		this.showDigits();

		switch (this.preferences.get('direction')) {
			case 'down':
				this.elapsed = this.seconds;
				break;
			case 'up':
				this.elapsed = 0;
				break;
		}

		// reset time
		//
		this.setTime(this.elapsed);

		// reset status
		//
		if (this.blinking) {
			window.clearTimeout(this.blinking);
			this.showDigits();
		}
	},

	//
	// setting methods
	//

	setTime: function(seconds) {
		this.getChildView('face').setTime(TimeUtils.secondsToTime(seconds));
	},

	//
	// rendering methods
	//

	onRender: function() {
		let direction = this.preferences.get('direction');

		// find start time
		//
		let hours = this.preferences.get('hours');
		let minutes = this.preferences.get('minutes');
		let seconds = this.preferences.get('seconds');

		// set initial attributes
		//
		this.direction = direction == 'down'? -1 : 1;
		this.seconds = (hours * 3600) + (minutes * 60) + seconds;
		switch (direction) {
			case 'down':
				this.elapsed = this.seconds;
				break;
			case 'up':
				this.elapsed = 0;
				break;
		}

		// show child views
		//
		this.showChildView('face', new FaceView({
			display: this.preferences.get('display'),
			hours: direction == 'down'? hours : 0,
			minutes: direction == 'down'? minutes : 0,
			seconds: direction == 'down'? seconds : 0,
			show_hours: this.preferences.get('show_hours'),
			show_hundredths: this.preferences.get('show_hundredths')
		}));
		this.showChildView('buttons', new ButtonsView());

		// update scale
		//
		this.onResize();
	},

	onAttach: function() {
		this.original_width = this.$el.width();
		this.original_height = this.$el.height();
	},

	update: function() {
		let seconds = this.elapsed + TimeUtils.getElapsedSeconds(this.startTime, new Date()) * this.direction;

		// check limit
		//
		switch (this.preferences.get('direction')) {
			case 'down':
				if (seconds < 0) {
					seconds = 0;
					this.blink();
				}
				break;
			case 'up':
				if (this.seconds && seconds > this.seconds) {
					seconds = this.seconds;
					this.blink();
				}
				break;
		}

		// update digital display
		//
		this.setTime(seconds);
	},

	blink: function() {
		this.stop();

		// start blinking interval
		//
		this.blinks = 0;
		this.blinking = window.setInterval(() => {
			this.blinks++;

			// update display
			//
			if (this.blinks % 2 == 0) {
				this.hideDigits();
			} else {
				this.showDigits();

				// play error sound
				//
				application.play('tap');
			}
		}, 500);
	},

	stopBlinking: function() {
		if (this.blinking) {
			window.clearInterval(this.blinking);
		}
		this.blinking = null;
	},

	//
	// hiding methods
	//

	hideDigits: function() {
		this.$el.find('.digits').addClass('hidden');
	},

	showDigits: function() {
		this.$el.find('.digits').removeClass('hidden');
	},

	//
	// dialog rendering methods
	//

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/timer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences,

				// updating method
				//
				onclose: () => {
					this.render();
				}
			}));
		});
	},

	//
	// window event handling methods
	//

	onResize: function() {
		let width = this.$el.width();
		let height = this.$el.height();

		if (width != this.original_width || height != this.original_height) {
			let size = Math.min(width, height);
			let original_size = Math.min(this.original_width, this.original_height);
			let scale = size / original_size;
			this.$el.find('.face').css('transform', 'scale(' + scale.toPrecision(3) + ')');
		} else {
			this.$el.find('.face').css('transform', '');
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.stopBlinking();
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});