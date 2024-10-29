/******************************************************************************\
|                                                                              |
|                                video-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing video files.                     |
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

export default BaseView.extend({

	//
	// attributes
	//

	className: 'video',
	template: template(`
	`),

	//
	// events
	//

	events: {
		'click': 'onClick'
	},

	//
	// constructor
	//

	initialize: function() {
		this.loaded = false;
	},

	//
	// getting methods
	//

	getTime: function() {
		if (this.video) {
			return this.video.currentTime;
		}
	},

	getDuration: function() {
		if (this.video) {
			return this.video.duration;
		}
	},

	//
	// setting methods
	//

	setTime: function(time) {
		if (this.video) {
			this.video.currentTime = time;
		}
	},

	setVolume: function(volume) {
		if (this.video && volume >= 0 && volume <= 1) {
			this.video.volume = volume;
		}
	},

	setOption: function(key, value) {
		switch (key) {
			
			case 'background_color':
				this.$el.css('background-color', value || '');
				break;
		}
	},
	
	//
	// playing methods
	//

	play: function(options) {
		if (this.video) {

			// set on ended callback
			//
			$(this.video).off('ended');
			if (options && options.onended) {
				$(this.video).one('ended', options.onended);
			}

			this.video.play();
		}
	},

	pause: function() {
		if (this.video) {
			this.video.pause();
		}
	},

	//
	// loading methods
	//

	loadFile: function(model) {
		this.model = model;
		this.loaded = false;

		// remove any previous video
		//
		this.$el.find('video').remove();

		// remove any previous message
		//
		this.hideMessage();

		// create new video
		//
		this.video = $('<video class="loading spinner">')[0];

		// load video into DOM
		//
		this.$el.append(this.video);
		
		// set video event handlers
		//
		$(this.video).on('loadeddata', (event) => {

			// remove spinner styles
			//
			$(event.target).removeClass('loading').removeClass('spinner');
			this.loaded = true;

			// perform action
			//
			this.onLoad();
		});
		$(this.video).on('error', (event) => {
			$(event.target).remove();
			this.showMessage("404 - Video Not Found.", {
				icon: '<i class="fa fa-bug"></i>'
			});
		});

		// start video download
		//
		$(this.video).attr({
			'src': this.model.getUrl(),
			'type': 'video/mp4'	
		});
		this.video.load();
	},

	reload: function() {

		// load current file
		//
		if (this.model) {
			this.loadFile(this.model);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// apply preferences
		//
		if (this.options.preferences) {
			this.options.preferences.applyTo(this);
		}
		
		// load initial file
		//
		if (this.model) {
			this.loadFile(this.model);
		}
	},

	showMessage: function(message) {
		this.$el.append($('<div class="message">' + message + '</div>'));
	},

	hideMessage: function() {
		this.$el.find('.message').remove();
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onClick: function() {

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick();
		}		
	}
});