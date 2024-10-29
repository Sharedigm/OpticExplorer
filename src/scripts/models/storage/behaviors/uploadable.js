/******************************************************************************\
|                                                                              |
|                                uploadable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a downloadable behavior mixin for file system items.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import QueryString from '../../../utilities/web/query-string.js';

export default {

	//
	// uploading methods
	//

	uploadTo: function(directory, options) {
		let path = options? options.path : null;
		let dirname = directory.get('path');
		let dest = dirname? dirname + '/' + (path || '') : path;
		let xhrobj = $.ajaxSettings.xhr();

		// set attributees
		//
		this.parent = directory;

		// add additional info
		//
		let data = {};
		if (dest) {
			data.dest = dest;
		}
		if (options.name) {
			data.name = options.name;
		}

		// upload and update
		//
		this.save(null, _.extend({

			// data
			//
			url: this.urlRoot + '/upload' + "?" + QueryString.encode(directory.getData(data)),
			contentType: false,
			processData: false,
			cache: false,

			// callbacks
			//
			xhr: function() {
				if (xhrobj.upload) {
					xhrobj.upload.addEventListener('progress', (event) => {
						let percent = 0;
						let position = event.loaded || event.position;
						let total = event.total;
						if (event.lengthComputable) {
							percent = Math.ceil(position / total * 100);
						}

						// set progress
						//
						if (options.progress) {
							options.progress(percent);
						}
					}, false);
				}
				return xhrobj;
			}
		}, options));

		return xhrobj;
	}
};