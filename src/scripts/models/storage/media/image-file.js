/******************************************************************************\
|                                                                              |
|                                 image-file.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an image file.                                |
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
import DateUtils from '../../../utilities/time/date-utils.js';

//
// conversion functions
//

function toFloat(string) {
	if (string.contains('/')) {
		let substrings = string.split('/');
		let numerator = parseInt(substrings[0]);
		let denominator = parseInt(substrings[1]);
		return numerator / denominator;		
	} else {
		return parseFloat(string);
	}
}

function formatRational(string) {
	if (string) {
		let substrings = string.split('/');
		let numerator = parseInt(substrings[0]);
		let denominator = parseInt(substrings[1]);
		if (numerator > denominator && denominator != 0) {
			return numerator / denominator;
		} else if (numerator != 0) {
			return '1/' + (denominator / numerator);
		} else {
			return string;
		}
	}
}

function formatDms(string) {
	if (string) {
		string = string.replace(/d/g, '&deg; ');
		string = string.replace(/'/g, "' ");
		string = string.replace(/"/g, '" ');
	}
	return string;
}

export default File.extend({

	//
	// querying methods
	//

	hasThumbnail: function() {
		return this.has('path') && this.get('path').length != 0;
	},

	hasPageOrientation: function() {
		return this.has('resolution') || this.has('dimensions');
	},

	hasCaptureDate: function() {
		return this.has('exif') && this.get('exif').DateTimeOriginal != null;
	},

	//
	// metadata querying methods
	//

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'resolution':
				return this.has('resolution');
			case 'make_model':
				return this.has('exif') && this.get('exif').Model != undefined;
			case 'focal_length':
				return this.has('exif') && this.get('exif').FocalLength != undefined;
			case 'exposure':
				return this.has('exif') && this.get('exif').ExposureTime != undefined;
			case 'aperture':
				return this.has('exif') && this.get('exif').FNumber != undefined;
			case 'iso':
				return this.has('exif') && this.get('exif').ISOSpeedRatings != undefined;
			case 'capture_date':
				return this.hasCaptureDate();
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
		return config.servers.api + '/image?' + this.getQueryString(options);
	},

	getDimensions: function() {
		if (this.has('dimensions')) {
			let dimensions = this.get('dimensions');
			return dimensions[0] + 'x' + dimensions[1];
		}
	},

	getResolution: function() {
		if (this.has('resolution')) {
			let resolution = this.get('resolution');
			let width = parseInt(Math.round(resolution[0]));
			let height = parseInt(Math.round(resolution[1]));
			return width + 'x' + height + ' px';
		}
	},

	getAspectRatio: function() {
		if (this.has('dimensions')) {
			let dimensions = this.get('dimensions');
			if (typeof dimensions[0] == 'number' && typeof dimensions[1] == 'number') {
				return dimensions[1] / dimensions[0];
			}
		} else if (this.has('resolution')) {
			let resolution = this.get('resolution');
			return resolution[1] / resolution[1];
		}
	},

	getPageOrientation: function() {
		if (this.has('resolution')) {
			let resolution = this.get('resolution');
			return resolution[0] >= resolution[1]? 'landscape' : 'portrait';
		} else if (this.has('dimensions')) {
			let dimensions = this.get('dimensions');
			return dimensions[0] >= dimensions[1]? 'landscape' : 'portrait';				
		}
	},

	getPixelCount: function() {
		if (this.has('resolution')) {
			let resolution = this.get('resolution');
			return resolution[0] * resolution[1];
		}
	},
	
	getCaptureDate: function() {
		if (this.has('exif')) {
			let exif = this.get('exif');
			if (exif.DateTimeOriginal) {
				let substrings = exif.DateTimeOriginal.split(' ');
				let date = substrings[0].replace(/:/g, '-');
				if (date != '0000-00-00') {
					let formattedDate = new Date(date).format(DateUtils.getDateFormat('date_only'));
					let time = substrings[1];
					if (time != '00:00:00') {
						return new Date(Date.parse(formattedDate + ' ' + time));
					}
				}
			}
		}
	},

	//
	// metadata getting methods
	//

	getAttribute: function(attributeName, preferences) {
		switch (attributeName) {
			case 'resolution': {
				return this.getResolution();
			}

			// exif attributes
			//
			case 'focal_length': {
				let focalLength = this.has('exif')? this.get('exif').FocalLength : undefined;
				return focalLength? formatRational(focalLength) + ' mm' : undefined;
			}
			case 'exposure': {
				let exposure = this.has('exif')? this.get('exif').ExposureTime : undefined;
				return exposure? formatRational(exposure) + ' s': undefined;
			}
			case 'aperture': {
				let aperture = this.has('exif')? this.get('exif').FNumber : undefined;
				return aperture? 'F' + formatRational(aperture) : undefined;
			}
			case 'iso': {
				let iso = this.has('exif')? this.get('exif').ISOSpeedRatings : undefined;
				return iso? 'ISO ' + iso : undefined;
			}
			case 'make_model': {
				return this.has('exif')? this.get('exif').Model : undefined;
			}
			case 'capture_date': {
				let captureDate = this.getCaptureDate();
				let dateFormat = preferences? preferences.get('date_format') : undefined;
				let formatString = DateUtils.getDateFormat(dateFormat); 
				return captureDate? 'captured ' + captureDate.format(formatString) : undefined;
			}

			// geotiff attributes
			//
			case 'upper_left': {
				return this.has('geocoords')? formatDms(this.get('geocoords').upper_left) : undefined;
			}
			case 'upper_right': {
				return this.has('geocoords')? formatDms(this.get('geocoords').upper_right) : undefined;
			}
			case 'lower_left': {
				return this.has('geocoords')? formatDms(this.get('geocoords').lower_left) : undefined;
			}
			case 'lower_right': {
				return this.has('geocoords')? formatDms(this.get('geocoords').lower_right) : undefined;
			}

			// other attributes
			//
			default: {

				// call superclass method
				//
				return File.prototype.getAttribute.call(this, attributeName, preferences);
			}
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'resolution': {
				return this.getPixelCount();
			}
			case 'make_model': {
				return this.has('exif')? this.get('exif').Model : undefined;
			}
			case 'focal_length': {
				return  this.has('exif')? toFloat(this.get('exif').FocalLength) : undefined;
			}
			case 'exposure': {
				return this.has('exif')? toFloat(this.get('exif').ExposureTime) : undefined;
			}
			case 'aperture': {
				return this.has('exif')? toFloat(this.get('exif').FNumber) : undefined;
			}
			case 'iso': {
				return this.has('exif')? this.get('exif').ISOSpeedRatings : undefined;
			}
			case 'capture_date': {
				if (this.has('exif')) {
					return this.get('exif').DateTimeOriginal;
				} else {
					return undefined;
				}
			}
			default: {

				// call superclass method
				//
				return File.prototype.getSortableAttribute.call(this, attributeName);
			}
		}
	},

	//
	// ajax methods
	//

	fetchExif: function(options) {

		// fetch exif info
		//
		$.ajax({
			url: config.servers.api + '/image/exif',
			type: 'GET',
			data: this.getData(),

			// callbacks
			//
			success: options.success,
			error: options.error
		});
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = File.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.dimensions) {
			if (data.dimensions.width && $.isNumeric(data.dimensions.width)) {
				data.dimensions.width = parseFloat(data.dimensions.width);
			}
			if (data.dimensions.height && $.isNumeric(data.dimensions.height)) {
				data.dimensions.height = parseFloat(data.dimensions.height);
			}
		}

		return data;
	}
}, {

	//
	// static attributes
	//

	extensions: config.files.images.extensions,

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