/******************************************************************************\
|                                                                              |
|                            decibel-meter-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for measuring microphone audio levels.       |
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
import FaceView from '../../../views/apps/decibel-meter/panels/face-view.js';
import ButtonsView from '../../../views/apps/decibel-meter/panels/buttons-view.js';
import PreferencesFormView from '../../../views/apps/decibel-meter/forms/preferences/preferences-form-view.js'

export default AppView.extend({

	//
	// attributes
	//

	name: 'decibel_meter',

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
	// attributes
	//

	max: 0,
	interval: 100,

	//
	// timing methods
	//

	start: function() {
		let self = this;
		this.stopped = false;

		// update buttons
		//
		this.getChildView('buttons').start();

		// start monitoring
		//
		navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false
		}).then(stream => {
			const audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(stream);
			const analyzer = audioContext.createAnalyser();

			analyzer.fftSize = 2048;
			source.connect(analyzer);

			function analyzeAudio() {
				const storedData = new Uint8Array(analyzer.frequencyBinCount);
				analyzer.getByteFrequencyData(storedData);

				var sum = 0;
				for (let i = 0; i < storedData.length; i++) {
					sum += storedData[i];
				}

				const average = sum / storedData.length;
				const decibels = 38 * Math.log10(average);

				// set up next update
				//
				if (!self.isDestroyed() && !self.stopped) {
					let sensitivity = self.preferences.get('sensitivity');
					self.setDecibels(decibels * (sensitivity != undefined? sensitivity / 100 : 1));
					setTimeout(analyzeAudio, self.interval);
				}
			}

			analyzeAudio();
		});
	},

	stop: function() {
		this.stopped = true;

		// update buttons
		//
		this.getChildView('buttons').stop();
	},

	reset: function() {
		this.max = 0;
		this.getChildView('face').setMax(0);
	},

	//
	// rendering methods
	//

	setDecibels: function(decibels) {
		this.getChildView('face').setDecibels(decibels);

		if (decibels > this.max) {
			this.max = decibels;
			this.getChildView('face').setMax(decibels);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('face', new FaceView({
			display: this.preferences.get('display')
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

	//
	// dialog rendering methods
	//

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/decibel-meter/dialogs/preferences/preferences-dialog-view.js'
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
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});