/******************************************************************************\
|                                                                              |
|                                    users.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of users.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import User from '../../models/users/user.js';
import GeolocatableCollection from '../../collections/places/geolocatable-collection.js';

export default GeolocatableCollection.extend({

	//
	// attributes
	//

	model: User,

	//
	// querying methods
	//

	hasGeolocation: function() {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).hasGeolocation()) {
				return true;
			}
		}
		return false;
	},
	
	//
	// getting methods
	//

	getIds: function() {
		let ids = [];

		this.each((item) => {
			ids.push(item.get('id'));
		});
		
		return ids;
	},

	getEnabled: function() {

		// create empty collection
		//
		let collection = new this.constructor([], {
			model: this.model,
			comparator: this.comparator
		});

		// add enabled items to collection
		//
		this.each((item) => {
			if (item.isEnabled()) {
				collection.add(item);
			}
		});

		return collection;
	},

	getDisabled: function() {
		
		// create empty collection
		//
		let collection = new this.constructor([], {
			model: this.model,
			comparator: this.comparator
		});

		// add disabled items to collection
		//
		this.each((item) => {
			if (item.isDisabled()) {
				collection.add(item);
			}
		});

		return collection;
	},

	//
	// fetching methods
	//

	fetchAll: function(options) {
		return this.fetch(_.extend(options, {
			url: config.servers.authentication + '/users/all'
		}));
	},

	fetchConnected: function(options) {
		return this.fetch(_.extend(options, {
			url: config.servers.authentication + '/connections/connected'
		}));
	},

	fetchUnconnected: function(options) {
		return this.fetch(_.extend(options, {
			url: config.servers.authentication + '/connections/unconnected'
		}));
	}
});
