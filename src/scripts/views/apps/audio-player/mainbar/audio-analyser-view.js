/******************************************************************************\
|                                                                              |
|                            audio-analyser-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an audio analyser.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import Animatable from '../../../../views/behaviors/effects/animatable.js';

export default BaseView.extend(_.extend({}, Animatable, {

	//
	// attributes
	//

	className: 'dark audio-analyser',

	template: template(`
		<canvas></canvas>
		
		<label>
			<i class="fa fa-chart-column"></i>
		</label>
	`),

	// animation frame rate
	//
	// fps: 15,

	// fixed sized bars
	//
	bar_width: 3,
	bar_margin: 1,
	max_bars: 150,

	// variable size bars
	//
	num_bars: undefined,
	bar_spacing: 0.5,

	// vertical range of graph view
	//
	range: 300,		// values are returned from 0 to 255

	//
	// setting methods
	//

	setModel: function(model) {
		this.model = model;
	},

	setSize: function(width, height) {

		// resize canvas
		//
		let canvas = this.$el.find('canvas');

		// update canvas
		//
		canvas[0].width = width;
		canvas[0].height = height;
		this.ctx = canvas[0].getContext('2d');

		// update view
		//
		this.update();
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.onResize();
	},

	clear: function(color) {
		let width = this.$el.width();
		let height = this.$el.height();

		if (!this.ctx) {
			return;
		}

		if (color) {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(0, 0, width, height);
		} else {
			this.ctx.clearRect(0, 0, width, height);
		}
	},

	showBars: function() {
		let numBars;
		let barWidth;
		let barMargin;
		let width = this.$el.width();
		let height = this.$el.height();

		// check to see if audio has been loaded
		//
		if (!this.analyser) {
			return;
		}

		if (!this.num_bars) {

			// fixed size bars
			//
			barWidth = this.bar_width;
			barMargin = this.bar_margin;
			numBars = width / (barWidth + barMargin);
		} else {

			// variable size bars
			//
			barWidth = width / (this.num_bars * (1 + this.bar_spacing));
			barMargin = barWidth * this.bar_spacing;
			numBars = this.num_bars;
		}

		// let fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
		let fbcArray = new Uint8Array(numBars);		
		this.analyser.getByteFrequencyData(fbcArray);

		let barX = barMargin;
		for (let i = 0; i < numBars; i++) {
			let amplitude = fbcArray[i] / this.range;
			let barHeight = height * amplitude;

			// draw bar
			//
			this.ctx.fillRect(barX, height, barWidth, -barHeight);

			// advance to next bar
			//
			barX += barWidth + barMargin;
		}	
	},

	showColoredBars: function(color) {
		let numBars;
		let barWidth;
		let barMargin;
		let width = this.$el.width();
		let height = this.$el.height();

		// set optional param defaults
		//
		if (!color) {
			color = 'white';
		}

		// check to see if audio has been loaded
		//
		if (!this.analyser) {
			return;
		}

		if (!this.num_bars) {

			// fixed size bars
			//
			barWidth = this.bar_width;
			barMargin = this.bar_margin;
			numBars = width / (barWidth + barMargin);
		} else {

			// variable size bars
			//
			barWidth = width / (this.num_bars * (1 + this.bar_spacing));
			barMargin = barWidth * this.bar_spacing;
			numBars = this.num_bars;
		}

		// let fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
		let fbcArray = new Uint8Array(numBars);
		this.analyser.getByteFrequencyData(fbcArray);

		let barX = barMargin;
		for (let i = 0; i < numBars; i++) {
			let amplitude = fbcArray[i] / this.range;
			let barHeight = height * amplitude;
			
			// set color
			//
			this.ctx.fillStyle = color;

			// draw bar
			//
			this.ctx.fillRect(barX, height, barWidth, -barHeight);

			// advance to next bar
			//
			barX += barWidth + barMargin;
		}			
	},

	showMulticoloredBars: function(getColor) {
		let numBars;
		let barWidth;
		let barMargin;
		let width = this.$el.width();
		let height = this.$el.height();

		// check to see if audio has been loaded
		//
		if (!this.analyser) {
			return;
		}

		if (!this.num_bars) {

			// fixed size bars
			//
			barWidth = this.bar_width;
			barMargin = this.bar_margin;
			numBars = width / (barWidth + barMargin);
		} else {

			// variable size bars
			//
			barWidth = width / (this.num_bars * (1 + this.bar_spacing));
			barMargin = barWidth * this.bar_spacing;
			numBars = this.num_bars;
		}

		// let fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
		let fbcArray = new Uint8Array(numBars);		
		this.analyser.getByteFrequencyData(fbcArray);

		let barX = barMargin;
		for (let i = 0; i < numBars; i++) {
			let amplitude = fbcArray[i] / this.range;
			let barHeight = height * amplitude;
			
			// set color
			//
			this.ctx.fillStyle = getColor(fbcArray, i, amplitude);

			// draw bar
			//
			this.ctx.fillRect(barX, height, barWidth, -barHeight);

			// advance to next bar
			//
			barX += barWidth + barMargin;
		}
	},

	update: function() {
		this.clear();

		// show bars
		//
		if ($('body').hasClass('colored')) {
			this.showMulticoloredBars(this.constructor.green);
		} else if ($('body').hasClass('monochrome')) {
			this.showMulticoloredBars(this.constructor.monochrome);
		} else {
			this.showColoredBars('white');
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.clear();

		// stop animation
		//
		this.stop();
	},

	onPlay: function() {

		// hide analyzer label
		//
		this.$el.find('label').fadeOut();
	},

	onStart: function() {
		let sound = this.model.sound;
		let audio = sound.audio;

		// create audio analyser
		//
		this.analyser = audio.context.createAnalyser();

		// Re-route audio playback into the processing graph of the AudioContext
		//
		if (sound) {
			sound.gainNode.connect(this.analyser);
		}

		// connect analyser to audio output
		//
		this.analyser.connect(audio.context.destination);

		// start animation
		//
		this.start();
	},

	onPause: function() {

		// show analyzer label
		//
		this.$el.find('label').fadeIn();
	},

	onResize: function() {
		this.setSize(this.$el.width(), this.$el.height());
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// stop sound
		//
		if (this.model && this.model.sound) {
			this.model.sound.stop();
		}

		// stop analyser
		//
		if (this.analyser) {
			this.analyser.disconnect();
		}

		// stop animation
		//
		this.stop();
	}
}), {

	//
	// static methods
	//

	monochrome: function(array, i) {
		let value = array[i];
		return 'rgb(' + value + ',' + value + ',' + value + ')';
	},

	light: function(array, i) {
		let red = Math.floor(255 - array[i - 1] / 2);
		let green = Math.floor(255 - array[i] / 2);
		let blue = Math.floor(255 - array[i + 1] / 2);		
		return 'rgb(' + red + ',' + green + ',' + blue + ')';
	},

	blue: function(array, i) {
		let red = Math.floor(255 - array[i - 1] / 2);
		let green = Math.floor(255 - array[i] / 2);
		let blue = Math.floor(255 - array[i + 1] / 2);		
		return 'rgb(' + red + ',' + green + ',' + blue + ')';
	},

	dark: function(array, i) {
		let red = array[i + 1];
		let green = array[i];
		let blue = array[i - 1];
		return 'rgb(' + red + ',' + green + ',' + blue + ')';
	},

	green: function(array, i, amplitude) {
		let red = Math.min(32 + Math.floor(array[i + 1] / 1.5 * amplitude), 255);
		let green = Math.min(32 + Math.floor(array[i] * amplitude), 255);
		let blue = Math.min(32 + Math.floor(array[i - 1] / 2), 255);
		return 'rgb(' + red + ',' + green + ',' + blue + ')';
	}
});