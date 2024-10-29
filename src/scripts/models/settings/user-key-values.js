/******************************************************************************\
|                                                                              |
|                              user-key-values.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's key value pairs.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	loaded: false,

	//
	// querying methods
	//

	equals: function(keyValues) {
		let keys = this.getKeys();
		if (keys.equals(keyValues.getKeys())) {
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				let value = this.get(key);

				// compare values
				//
				if (value != keyValues.get(key)) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	},

	//
	// getting methods
	//

	getKeys: function() {
		return Object.keys(this.attributes);
	},

	getAttributes: function(keys) {
		let attributes = [];
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			attributes[key] = this.get(key);
		}
		return attributes;
	},
	
	//
	// loading methods
	//

	load: function(options) {

		// check if already loaded
		//
		if (this.loaded) {

			// perform callback
			//
			if (options && options.success) {
				options.success(this);
			}
			return;
		}

		this.fetch({

			// callbacks
			//
			success: () => {
				this.loaded = true;

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			},

			error: () => {
				this.loaded = false;

				// perform callback
				//
				if (options && options.error) {
					options.error(this);
				}
			}
		});
	},

	loadByUser: function(user, options) {

		// check if already loaded
		//
		if (this.loaded) {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
			return;
		}
		
		return this.fetchByUser(user, {

			// callbacks
			//
			success: () => {
				this.loaded = true;

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (model, response) => {
				this.loaded = false;

				// show error message
				//
				application.error({
					message: "Could not load user key values.",
					response: response
				});
			}
		});
	},

	removeKey: function(key) {
		delete this.attributes[key];
	},

	reset: function() {
		this.loaded = false;
		this.set(this.defaults);
	},
	
	//
	// converting methods
	//

	toCollection: function(keyName, valueName) {

		// create collection of key / value pairs
		//
		let collection = new Backbone.Collection();
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			let attributes = {};
			attributes[keyName] = key;
			attributes[valueName] = value;
			collection.add(new BaseModel(attributes));
		}
		return collection;
	},

	copy: function() {
		let copy = this.clone();

		// make a copy of attributes
		//
		let attributes = {};
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			if (Array.isArray(value)) {
				attributes[key] = value.slice();
			} else {
				attributes[key] = value;
			}
		}
		copy.set(attributes);

		// copy attributes
		//
		copy.app = this.app;
		copy.loaded = this.loaded;

		return copy;
	}
}, {

	//
	// static methods
	//

	toKeyValuePairs: function(array, device) {
		let values = {};

		for (let key in array) {
			let value = array[key];

			// check if value is specified per device
			//
			if (typeof value != 'object' || value == null) {
				values[key] = value;
			} else {
				values[key] = value[device];
			}
		}

		return values;
	},
});