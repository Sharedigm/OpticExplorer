/******************************************************************************\
|                                                                              |
|                                 audio-file.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an audio file.                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import FileUtils from '../../../utilities/files/file-utils.js';
import Sound from '../../../utilities/multimedia/sound.js';
import TimeUtils from '../../../utilities/time/time-utils.js';

export default File.extend({

	//
	// querying methods
	//

	isPlaying: function() {
		return this.sound && this.sound.isPlaying() && !this.sound.isPaused();
	},

	isPaused: function() {
		return this.sound && this.sound.isPaused();
	},
	
	hasId3Attribute: function(name) {
		if (this.has('id3')) {
			let id3 = this.get('id3');
			return id3[name] != undefined;
		}			
	},

	hasThumbnail: function() {

		// check for path
		//
		if (!this.has('path') || this.get('path').length == 0) {
			return false;
		}

		// check id3 info
		//
		return this.hasId3Thumbnail();
	},

	hasId3Thumbnail: function() {
		return this.has('id3') && this.get('id3').picture;
	},

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'album':
			case 'artist':
			case 'band':
			case 'composer':
			case 'genre':
			case 'publisher':
			case 'title':
			case 'track_number':
			case 'year':
			case 'length':
				return this.hasId3Attribute(attributeName);
			default:

				// call superclass method
				//
				return File.prototype.hasAttribute.call(this, attributeName);
		}
	},

	//
	// getting methods
	//

	getUrl: function(options) {
		return config.servers.api + '/audio?' + this.getQueryString(options);
	},

	getId3Attribute: function(name) {
		if (this.has('id3')) {
			let id3 = this.get('id3');
			if (id3[name]) {
				return id3[name];
			}
		}			
	},

	getAttribute: function(attributeName, preferences) {
		switch (attributeName) {
			case 'album':
			case 'artist':
			case 'band':
			case 'composer':
			case 'genre':
			case 'publisher':
			case 'title':
			case 'track_number':
			case 'year':
				return this.getId3Attribute(attributeName);
			case 'length':
				return this.hasId3Attribute('length')? TimeUtils.secondsToString(this.getLength(), {
					verbose: false
				}) : undefined;
			default:

				// call superclass method
				//
				return File.prototype.getAttribute.call(this, attributeName, preferences);
		}
	},

	getSortableAttribute: function(attributeName) {
		let trackNumber;

		switch (attributeName) {
			case 'album':
			case 'artist':
			case 'band':
			case 'composer':
			case 'genre':
			case 'publisher':
			case 'title':
			case 'year':
				return this.getId3Attribute(attributeName);
			case 'track_number':
				trackNumber = this.getId3Attribute(attributeName);
				if (trackNumber && trackNumber.contains('/')) {
					trackNumber = parseInt(trackNumber.split('/'));
				} else {
					trackNumber = parseInt(trackNumber);
				}
				return trackNumber;
			case 'length':
				return this.has('id3')? parseInt(this.get('id3').length) : undefined;
			default:

				// call superclass method
				//
				return File.prototype.getSortableAttribute.call(this, attributeName);
		}
	},

	getLength: function() {
		if (this.hasId3Attribute(name)) {
			return this.getId3Attribute(name) / 1000;
		}
	},

	getTime: function() {
		if (this.sound) {
			return this.sound.getTime();
		} else {
			return 0;
		}
	},

	//
	// setting methods
	//

	setTime: function(time) {
		if (this.sound) {
			this.sound.setTime(time);
		}
	},

	setVolume: function(volume) {
		if (this.sound) {
			this.sound.setVolume(volume);
		}
	},

	//
	// loading methods
	//

	loadAudio: function(audio, options) {

		// clear previous sound
		//
		if (this.sound) {
			this.stop();
		}

		// notify listeners
		//
		this.trigger('load');

		// start audio
		//
		return audio.load(this.getUrl(), _.extend({}, options, {

			// callbacks
			//
			success: () => {

				// create new sound
				//
				this.sound = new Sound({
					audio: audio,
					url: this.getUrl(),
					volume: options.volume != undefined? options.volume : 0.5
				});

				// notify listeners
				//
				this.trigger('loaded');

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		}));
	},

	//
	// playing methods
	//

	play: function(audio, options) {

		// create new sound
		//
		if (!this.sound) {
			this.sound = new Sound({
				url: this.getUrl(),
				volume: options.volume != undefined? options.volume : 0.5
			});
		}

		// start audio
		//
		this.sound.play(audio, options);

		// notify listeners
		//
		this.trigger('play');
	},

	pause: function() {

		// pause audio
		//
		if (this.sound) {
			this.sound.pause();
		}

		// notify listeners
		//
		this.trigger('pause');
	},

	stop: function() {

		// stop audio
		//
		if (this.sound) {
			this.sound.stop();
			this.sound = null;
		}

		// notify listeners
		//
		this.trigger('stop');
	},

	//
	// ajax methods
	//

	fetchId3: function(options) {

		// compose data
		//
		/*
		let data = {
			path: this.get('path')
		};
		if (this.has('volume')) {
			data.volume = this.get('volume');
		}
		if (this.has('link_id')) {
			data.link_id = this.get('link_id');
		}
		if (this.has('share_id')) {
			data.share_id = this.get('share_id');
		}
		if (this.has('post_attachment_id')) {
			data.post_attachment_id = this.get('post_attachment_id');
		}
		*/

		// check if metadata is already loaded
		//
		if (this.has('id3')) {

			// perform callback
			//
			if (options && options.success) {
				options.success(this);
			}
			return;
		}

		// fetch exif info
		//
		$.ajax({
			url: config.servers.api + '/audio/id3',
			type: 'GET',
			data: this.getData(),

			// callbacks
			//
			success: (data) => {
				this.set('id3', data, {
					silent: true
				});

				// perform callback
				//
				if (options && options.success) {
					options.success(data);
				}
			},
			error: () => {

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}
			}
		});
	}
}, {

	//
	// static attributes
	//

	extensions: config.files.audio.extensions,

	//
	// static methods
	//

	isValidExtension: function(extension) {
		return extension && this.extensions.contains(extension.toLowerCase());
	},

	isValidPath: function(path) {
		return this.isValidExtension(FileUtils.getFileExtension(path));
	}
});