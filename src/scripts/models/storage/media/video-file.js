/******************************************************************************\
|                                                                              |
|                                 video-file.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a video file.                                 |
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
import TimeUtils from '../../../utilities/time/time-utils.js';

export default File.extend({

	//
	// querying methods
	//

	hasThumbnail: function() {

		// check for path
		//
		if (!this.has('path') || this.get('path').length == 0) {
			return false;
		}

		// check configuration
		//
		return application.session.has('config')? application.session.get('config').video_thumbnails_enabled : false;
	},

	//
	// metadata querying methods
	//

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'resolution':
				return this.has('resolution') && this.get('resolution') != undefined;
			case 'duration':
				return this.has('tags') && this.get('tags').duration != undefined;
			case 'bit_rate':
				return this.has('tags') && this.get('tags').bit_rate != undefined;
			default:

				// call superclass method
				//
				return File.prototype.hastAttribute.call(this, attributeName);
		}
	},

	//
	// getting methods
	//

	getUrl: function(options) {		
		return config.servers.api + '/video?' + this.getQueryString(options);
	},

	getResolution: function() {
		if (this.has('resolution')) {
			let resolution = this.get('resolution');
			if (resolution) {
				let width = resolution[0];
				let height = resolution[1];
				return width + 'x' + height + ' px';
			}
		}
	},

	getPixelCount: function() {
		if (this.has('resolution')) {
			let resolution = this.get('resolution');
			if (resolution) {
				let width = resolution[0];
				let height = resolution[1];
				return width * height;
			}
		}
	},

	getSeconds: function() {
		if (this.has('tags')) {
			let duration = this.get('tags').duration;
			if (duration) {
				return parseFloat(duration);
			}
		}
	},

	getDuration: function() {
		if (this.has('tags')) {
			let seconds = this.getSeconds();
			if (seconds) {
				let time = TimeUtils.secondsToTime(seconds);
				let digits = TimeUtils.timeToDigits(time);
				return digits;
			}
		}
	},

	getBitRate: function() {
		if (this.has('tags')) {
			let bit_rate = this.get('tags').bit_rate;
			if (bit_rate) {
				return Math.floor(bit_rate / 1000) + ' Kbps';
			}
		}
	},

	//
	// metadata getting methods
	//

	getAttribute: function(attributeName, preferences) {
		switch (attributeName) {
			case 'resolution':
				return this.getResolution();
			case 'duration':
				return this.getDuration();
			case 'bit_rate':
				return this.getBitRate();
			default:

				// call superclass method
				//
				return File.prototype.getAttribute.call(this, attributeName, preferences);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'resolution':
				return this.getPixelCount();
			case 'duration':
				return this.getSeconds();
			case 'bit_rate':
				return this.get('tags').bit_rate;
			default:

				// call superclass method
				//
				return File.prototype.getSortableAttribute.call(this, attributeName);
		}
	},

	//
	// ajax methods
	//

	fetchExif: function(options) {

		// fetch exif info
		//
		$.ajax({
			url: config.servers.api + '/video/exif',
			type: 'GET',
			data: this.getData(),

			// callbacks
			//
			success: options.success,
			error: options.error
		});
	}
}, {

	//
	// static attributes
	//

	extensions: config.files.videos.extensions,

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