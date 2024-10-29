/******************************************************************************\
|                                                                              |
|                                 file-index.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a searchable file index.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import QueryString from '../../utilities/web/query-string.js';

export default {

	//
	// searching methods
	//

	add: function(file, options) {
		return $.ajax(_.extend({}, options, {
			url: config.servers.api + '/file/index' + "?" + file.getQueryString(),
			type: 'POST'
		}));
	},

	remove: function(file, options) {
		return $.ajax(_.extend({}, options, {
			url: config.servers.api + '/file/indices/' + file.get('index_id'),
			type: 'DELETE'
		}));
	},

	removeAll: function(directory, options) {
		return $.ajax(_.extend({}, options, {
			url: config.servers.api + '/directory/indices' + "?" + directory.getQueryString(),
			type: 'DELETE'
		}));
	},

	count: function(query, options) {
		return $.ajax(_.extend({}, options, {
			url: config.servers.api + '/files/search/num?' + QueryString.encode({
				query: query,
				details: options.details,
				after: options.after,
				before: options.before
			}),
			type: 'GET'
		}));
	},

	search: function(query, options) {
		return $.ajax(_.extend({}, options, {
			url: config.servers.api + '/files/search?' + QueryString.encode({
				query: query,
				details: options.details,
				after: options.after,
				before: options.before,
				from: options.from,
				to: options.to
			}),
			type: 'GET'
		}));
	}
};