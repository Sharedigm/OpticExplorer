/******************************************************************************\
|                                                                              |
|                               user-settings.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's settings.                   |
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
	// ajax attributes
	//

	urlRoot: config.servers.api + '/settings',

	//
	// setting methods
	//

	clear: function() {
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			this.set(keys[i], undefined);
		}
		return this;
	},

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
			url: user.url() + '/settings/' + this.category
		}, options));
	},

	delete: function(options) {
		return $.ajax(_.extend({
			url: this.urlRoot,
			type: 'DELETE'
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