/******************************************************************************\
|                                                                              |
|                                  readable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for reading the contents of an item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// read text / json data
	//

	read: function(options) {
		return $.ajax(_.extend({}, options, {
			url: this.getUrl(),
			type: 'GET'
		}));
	},

	//
	// read binary data
	//

	readBinary: function(options) {

		// create get request
		//
		let request = new XMLHttpRequest();
		request.open('GET', this.getUrl(), true);
		request.responseType = "arraybuffer";

		// set callbacks
		//
		request.onload = function() {
			let arrayBuffer = request.response;
			let byteArray = new Uint8Array(arrayBuffer);
			options.success(byteArray);
		};
		request.onerror = options.error;

		// perform request
		//
		request.send();
		return request;
	}
};