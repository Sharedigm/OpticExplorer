/******************************************************************************\
|                                                                              |
|                                  writable.js                                 |
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
	// create new file
	//

	write: function(contents, options) {
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/write?' + this.getQueryString(),
			type: 'POST',
			data: {
				'contents': contents
			}
		}));
	},

	//
	// update an existing file
	//

	update: function(contents, options) {
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/update?' + this.getQueryString(),
			type: 'PUT',
			data: {
				'contents': contents
			}
		}));
	},
};