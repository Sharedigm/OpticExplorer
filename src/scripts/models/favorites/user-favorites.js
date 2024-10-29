/******************************************************************************\
|                                                                              |
|                              user-favorites.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of user application favorites.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserKeyValues from '../../models/settings/user-key-values.js';

export default UserKeyValues.extend({

	//
	// attributes
	//

	category: undefined,

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		if (options && options.category) {
			this.category = options.category;
		}
		if (options && options.defaults) {
			this.defaults = options.defaults;
		}
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/favorites',

	//
	// fetching methods
	//

	fetch: function(options) {
		return UserKeyValues.prototype.fetch.call(this, _.extend({
			url: this.urlRoot + '/' + this.category
		}, options));
	},

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/favorites/' + this.category
		}, options));
	},

	//
	// saving methods
	//

	save: function(attributes, options) {
		return UserKeyValues.prototype.save.call(this, attributes, _.extend({
			url: this.urlRoot + '/' + this.category
		}, options));
	},

	saveValue: function(key, value, options) {
		$.ajax(_.extend({}, options, {
			url: this.urlRoot + '/' + this.category + '/' + key,
			type: 'PUT',
			data: {
				value: value
			}
		}));
	}
});