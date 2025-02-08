/******************************************************************************\
|                                                                              |
|                                clock-view.js                                 |
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
import Timeable from '../../../views/behaviors/effects/timeable.js';
import FaceView from '../../../views/apps/clock/mainbar/face-view.js';
import ButtonsView from '../../../views/apps/clock/mainbar/buttons-view.js';
import PreferencesFormView from '../../../views/apps/clock/forms/preferences/preferences-form-view.js'
import TimeUtils from '../../../utilities/time/time-utils.js';

export default AppView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	name: 'clock',

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
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// setting methods
	//

	setMode: function(mode, save) {
		this.mode = mode;

		// update display
		//
		this.getChildView('face').setMode(mode);
		this.getChildView('buttons').setMode(mode);

		// update animation
		//
		switch (mode) {
			case 'analog':
				this.stop();
				break;
			case 'digital':		
				this.animate();
				this.update();
				break;
		}

		// save user preferences
		//
		if (save && application.isSignedIn()) {
			this.preferences.save({
				'mode': 'analog'
			});
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.mode = this.preferences.get('mode');

		// show child views
		//
		this.showChildView('face', new FaceView({
			mode: this.mode
		}));
		if (this.preferences.get('show_mode')) {
			this.showChildView('buttons', new ButtonsView({
				mode: this.mode
			}));
		}

		// update scale
		//
		this.onResize();
	},

	onAttach: function() {
		this.original_width = this.$el.width();
		this.original_height = this.$el.height();
	},

	//
	// animating methods
	//

	update: function() {
		this.getChildView('face').setDigitalTime(TimeUtils.daysOfWeek[new Date().getDay()], TimeUtils.getTime());
	},

	animate: function() {
		if (!this.interval) {
			this.setInterval(() => {

				// update view
				//
				this.update();
			}, 1000);
		}
	},

	stop: function() {
		this.clearInterval();
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set initial mode
		//
		this.setMode(this.preferences.get('mode'));
	},

	//
	// window event handling methods
	//

	onResize: function() {
		let width = this.$el.width();
		let height = this.$el.height();

		// update view
		//
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

		// clear static attributes
		//
		this.constructor.current = null;
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});