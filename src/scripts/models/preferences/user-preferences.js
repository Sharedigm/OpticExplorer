/******************************************************************************\
|                                                                              |
|                             user-preferences.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of user application preferences.        |
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
import Browser from '../../utilities/web/browser.js';

export default UserKeyValues.extend({

	//
	// attributes
	//

	app: undefined,

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/preferences',

	//
	// setting methods
	//

	applyTo: function(view, attributes) {
		let keys = attributes? Object.keys(attributes) : Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			view.setOption(key, value);
		}
	},

	reset: function() {
		this.set(this.constructor.getDefaults(this.app));
	},

	//
	// fetching methods
	//

	fetch: function(options) {
		return UserKeyValues.prototype.fetch.call(this, _.extend({
			url: this.urlRoot + '/' + this.app
		}, options));
	},

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/preferences/' + this.app
		}, options));
	},
	
	//
	// saving methods
	//

	save: function(attributes, options) {
		return UserKeyValues.prototype.save.call(this, attributes, _.extend({
			url: this.urlRoot + '/' + this.app
		}, options));
	},

	saveValue: function(key, value, options) {
		$.ajax(_.extend({}, options, {
			url: this.urlRoot + '/' + this.app + '/' + key,
			type: 'PUT',
			data: {
				value: value
			}
		}));
	},

	delete: function(options) {
		$.ajax(_.extend({}, options, {
			url: this.urlRoot + '/' + this.app,
			type: 'DELETE'
		}));
	}
}, {

	//
	// static methods
	//

	toKeyValuePairs: function(array, device) {
		let values = {};

		for (let key in array) {
			let value = array[key];
			let isAssociativeArray = value && (typeof value == 'object' && value.length == undefined);

			// check if value is specified per device
			//
			if (isAssociativeArray) {
				values[key] = value[device];
			} else {
				values[key] = value;
			}
		}

		return values;
	},

	getDefaults: function(app) {
		let preferences = config.preferences[app];
		if (preferences) {
			return this.toKeyValuePairs(preferences, Browser.device);
		}
	},

	create: function(app, options) {
		let defaults = this.getDefaults(app);

		// create preferences using defaults
		//
		let preferences = new this.prototype.constructor(_.extend({}, defaults, options));
		
		// set preferences app name
		//
		if (Browser.device != 'desktop') {
			preferences.app = Browser.device + '_' + app;
		} else {
			preferences.app = app;
		}

		// preferences have been specified
		//
		if (options) {
			preferences.loaded = true;
		}

		return preferences;
	}
});