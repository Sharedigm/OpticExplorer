/******************************************************************************\
|                                                                              |
|                               track-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an audio track controls toolbar.            |
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
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import PlayButtonView from '../../../../../views/apps/audio-player/header-bar/play-bar/buttons/play-button-view.js';
import ReplayButtonView from '../../../../../views/apps/audio-player/header-bar/play-bar/buttons/replay-button-view.js';
import TimeUtils from '../../../../../utilities/time/time-utils.js';

export default ToolbarView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	template: template(`
		<div class="play" data-toggle="tooltip" title="Play / Pause" data-placement="bottom"></div>
		<div class="elapsed-time input-label">00:00</div>
		<input type="range"<% if (min != undefined) { %> min="<%= min %>"<% } %> max="<%= max %>" <% if (step != undefined) { %> step="<%= step %>"<% } %><% if (value != undefined) { %> value="<%= value %>"<% } %> data-toggle="tooltip" title="Current Track" data-placement="bottom" />
		<div class="track-length input-label"><%= length %></div>
		<div class="replay hidden-xs" data-toggle="tooltip" title="Replay" data-placement="bottom"></div>
	`),

	regions: {
		play: '.play',
		replay: '.replay'
	},

	events: {
		'input input[type="range"]': 'onChange',
		'change input[type="range"]': 'onChanged'
	},

	//
	// querying methods
	//

	isPlaying: function() {
		// return this.interval != null;
		return this.getChildView('play').isSelected();
	},

	//
	// getting methods
	//

	getTime: function() {
		return parseFloat(this.$el.find('input[type="range"]').val());
	},
	
	//
	// sound methods
	//

	play: function() {
		this.getChildView('play').select();
	},

	pause: function() {
		this.getChildView('play').deselect();
	},

	replay: function() {
		this.app.setTrackTime(0);
		if (this.isPlaying()) {
			this.play();
		} else {
			this.pause();
		}
	},

	//
	// setting methods
	//

	setDigits: function(seconds) {
		if (seconds == undefined) {
			seconds = 0;
		}
		
		// set digits
		//
		let time = TimeUtils.secondsToTime(seconds);
		let digits = TimeUtils.timeToDigits(time);
		this.$el.find('.elapsed-time').html(digits);
	},

	setTime: function(seconds) {

		// set numerical digits
		//
		this.setDigits(seconds);

		// set range slider
		//
		this.$el.find('input[type="range"]').val(seconds);
	},

	setTrackLength: function(seconds) {
		let time = TimeUtils.secondsToTime(seconds);
		let digits = TimeUtils.timeToDigits(time);

		// set attributes
		//
		this.trackLength = seconds;

		// set digits
		//
		this.$el.find('.track-length').html(digits);

		// set range slider
		//
		this.$el.find('input[type="range"]').attr('max', Math.floor(seconds));
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let time = TimeUtils.secondsToTime(this.options.length);
		let digits = TimeUtils.timeToDigits(time);

		return {
			min: 0,
			max: Math.floor(this.options.length) || 100,
			step: 1,
			value: 0,
			progress: this.progress,
			length: digits,
			repeatable: this.options.repeatable
		};
	},

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('play', new PlayButtonView());
		this.showChildView('replay', new ReplayButtonView());
	},

	update: function() {
		let trackTime = this.app.getTrackTime();
		this.setTime(trackTime);

		// check if ended
		//
		if (trackTime > this.trackLength) {

			// perform callback
			//
			if (this.options.onended) {
				this.options.onended();
			}
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.getChildView('play').setDisabled(false);
		this.setTrackLength(this.parent.app.audio.getDuration());
	},

	onPlay: function() {

		// start updating progress bar
		//
		this.setInterval(() => {
			this.update();
		}, 1000);

		// perform callback
		//
		if (this.options.onplay) {
			this.options.onplay();
		}
	},

	onPause: function() {

		// stop updating progress bar
		//
		this.clearInterval();

		// perform callback
		//
		if (this.options.onpause) {
			this.options.onpause();
		}
	},

	onChange: function() {
		if (this.isPlaying()) {
			this.getChildView('play').deselect();
		}

		// update digits
		//
		this.setDigits(this.getTime());
	},

	onChanged: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.getTime());
		}		
	}
}));