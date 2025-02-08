/******************************************************************************\
|                                                                              |
|                                  pdf-file.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a pdf file.                                   |
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

export default File.extend({
	
	//
	// ajax methods
	//

	fetchText: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/pdf/text',
			type: 'GET',
			data: this.getData()
		}));
	},

	fetchExif: function(options) {

		// fetch exif info
		//
		$.ajax({
			url: config.servers.api + '/pdf/exif',
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
	// static methods
	//

	isValidExtension: function(extension) {
		return extension && extension.toLowerCase() == 'pdf';
	},

	isValidPath: function(path) {
		return this.isValidExtension(FileUtils.getFileExtension(path));
	}
});