/******************************************************************************\
|                                                                              |
|                                     user.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application user.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';
import UserAccount from '../../models/users/account/user-account.js';
import Place from '../../models/places/place.js';
import CheckIn from '../../models/places/check-in.js';
import QueryString from '../../utilities/web/query-string.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		honorific: undefined,
		first_name: undefined,
		preferred_name: undefined,
		middle_name: undefined,
		last_name: undefined,
		titles: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.authentication + '/users',

	//
	// querying methods
	//

	isAdmin: function() {
		return this.get('is_admin') == true;
	},

	isCurrent: function() {
		return this.get('is_current') == true;
	},

	isConnection: function() {
		return this.get('is_connection') == true;
	},

	isOnline: function() {
		return this.get('is_online') == true;
	},

	isActive: function() {
		return this.get('is_active') == true;
	},

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			default:
				return this.has(attributeName);
		}
	},

	//
	// geolocation querying methods
	//

	hasGeolocation: function() {
		return this.get('check_in') != null;
	},

	//
	// profile photo querying methods
	//

	hasProfilePhoto: function() {
		return this.get('has_profile_photo') == 1;
	},

	hasCoverPhoto: function() {
		return this.get('has_cover_photo') == 1;
	},

	//
	// getting methods
	//

	getName: function(kind) {
		switch (kind) {
			case 'first':
				return this.get('first_name');
			case 'preferred':
				return this.get('preferred_name');
			case 'middle':
				return this.get('middle_name');
			case 'last':
				return this.get('last_name');
			case 'nick':
				return this.get('preferred_name') || this.get('first_name');
			case 'full':
				return this.getFullName();
			case 'single':
				return this.get('preferred_name') || this.get('first_name') || this.get('last_name');
			default:
				return this.getShortName();
		}
	},

	getShortName: function() {
		let name = '';

		if (this.has('preferred_name') && this.get('preferred_name') != '') {
			name += this.get('preferred_name').toTitleCase();
		} else if (this.has('first_name')) {
			name += this.get('first_name');
		}
		if (this.has('last_name')) {
			name += ' ' + this.get('last_name');
		}

		return name;
	},

	getFullName: function() {
		let name = '';

		if (this.has('honorific')) {
			let honorific = this.get('honorific');
			if (honorific != '') {
				name += honorific;
			}
		}
		if (this.has('first_name')) {
			let firstName = this.get('first_name');
			if (firstName != '') {
				if (name != '') {
					name += ' ';
				}
				name += firstName;
			}
		}
		if (this.has('preferred_name')) {
			let preferredName = this.get('preferred_name');
			if (preferredName != '') {
				if (name != '') {
					name += ' ';
				}
				name += '(' + preferredName + ')';
			}
		}
		if (this.has('middle_name')) {
			let middleName = this.get('middle_name');
			if (middleName != '') {
				if (name != '') {
					name += ' ';
				}
				name += middleName;
			}
		}
		if (this.has('last_name')) {
			let lastName = this.get('last_name');
			if (lastName != '') {
				if (name != '') {
					name += ' ';
				}
				name += lastName;
			}
		}
		if (this.has('titles')) {
			let titles = this.get('titles');
			if (titles != '') {
				if (name != '') {
					name += ' ';
				}
				name += titles;
			}
		}

		return name;
	},

	getGroup: function(item) {
		if (item.isOwnedBy(this)) {
			return 'owner';
		} else if (this.isConnection()) {
			return 'group';
		} else {
			return 'other';
		}
	},

	getUrl: function() {
		return application.getUrl() + '#users/' + this.get('username');
	},

	//
	// attribute getting methods
	//

	getAttribute: function(attributeName) {
		switch (attributeName) {
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'name':
				return this.get('last_name');
			case 'gender': {
				let gender = this.get('gender');
				switch (gender) {
					case 'male':
						return 1;
					case 'female':
						return 2;
					default:
						return 3;
				}
			}
			default:
				return this.get(attributeName);
		}
	},

	//
	// profile photo getting methods
	//

	getProfilePhotoUrl: function(options) {
		let url;

		if (this.hasProfilePhoto()) {
			url = this.url() + '/profile/photo';
		} else {
			return;
		}

		// add options as query string
		//
		if (options) {
			let queryString = QueryString.encode(options);
			if (queryString) {
				url += '?' + queryString;
			}
		}

		return url;
	},

	getProfileCoverPhotoUrl: function(options) {
		let url;

		if (this.hasCoverPhoto()) {
			url = this.url() + '/profile/cover-photo';
		} else {
			return;
		}

		// add options as query string
		//
		if (options) {
			let queryString = QueryString.encode(options);
			if (queryString) {
				url += '?' + queryString;
			}
		}

		return url;
	},

	//
	// geolocation getting methods
	//

	getLatLon: function() {
		let checkIn = this.get('check_in');
		return {
			latitude: checkIn.get('latitude'),
			longitude: checkIn.get('longitude')
		};
	},

	getPlace: function(zoomLevel) {
		let latLon = this.getLatLon();
		return new Place({
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: zoomLevel
		});
	},

	//
	// ajax methods
	//

	start: function(options) {

		// update user account's timestamps
		//
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/sessions/start',
			type: 'PUT',

			// callbacks
			//
			success: () => {
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	},

	//
	// fetching methods
	//

	fetchByUsername: function(username, options) {

		// look up user by username
		//
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/users/names/' + username,
			type: 'GET',

			// callbacks
			//
			success: (data) => {
				this.set(this.parse(data));

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	},

	requestUsernameByEmail: function(email, options) {

		// send request usernam email
		//
		$.ajax(_.extend({
			url: config.servers.api + '/users/email/request-username',
			type: 'POST',
			dataType: 'JSON',
			data: {
				'email': email
			},

			// callbacks
			//
			success: (data) => {
				this.set(this.parse(data));
			}
		}, options));
	},

	disconnect: function(connection, options) {

		// delete connection from connections list
		//
		$.ajax(_.extend({
			url: config.servers.api + '/users/' + this.get('id') + '/connections/' + connection.get('id'),
			type: 'DELETE'
		}, options));		
	},

	//
	// converting methods
	//

	toContactInfo: function() {
		let json = {};

		// add name
		//
		json.last_name = this.get('last_name');
		json.first_name = this.get('first_name');
		json.middle_name = this.get('middle_name');
		json.honorific = this.get('honorific');
		json.title = this.get('titles');

		// add full name
		//
		json.fullname = this.getFullName();

		// add nickname
		//
		if (this.has('preferred_name') && this.get('preferred_name') != '') {
			json.nickname = this.get('preferred_name');
		}

		// add gender info
		//
		if (this.has('gender')) {
			json.gender = this.get('gender');
		}

		// add profile photo
		//
		if (this.hasProfilePhoto()) {
			json.photo = this.getProfilePhotoUrl();
		}

		return json;
	},

	toVCF: function() {
		let lines = [];

		// add name
		//
		let string = '';
		string += (this.get('last_name') || '') + ';';
		string += (this.get('first_name') || '') + ';';
		string += (this.get('middle_name') || '') + ';';
		string += (this.get('honorific') || '') + ';';
		string += (this.get('titles') || '');
		lines.push('N:' + string);

		// add full name
		//
		lines.push('FN:' + this.getFullName());

		// add nickname
		//
		if (this.has('preferred_name') && this.get('preferred_name') != '') {
			lines.push('NICKNAME:' + this.get('preferred_name'));
		}

		// add gender info
		//
		if (this.has('gender')) {
			lines.push('GENDER:' + this.get('gender'));
		}

		// add profile photo
		//
		if (this.hasProfilePhoto()) {
			lines.push('PHOTO:' + this.getProfilePhotoUrl());
		}

		return lines;
	},

	fromVCF: function(lines) {

		// parse lines
		//
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// break line into key value pairs
			//
			let pair = line.split(':');
			let key = pair[0];
			let value = pair[1];

			switch (key) {

				// parse name
				//
				case 'N': {
					let names = value.split(';');
					this.set({
						'last_name': names[0],
						'first_name': names[1],
						'middle_name': names[2],
						'honorific': names[3],
						'titles': names[4]
					});
					break;
				}

				// parse nickname
				//
				case 'NICKNAME':
					this.set({
						'preferred_name': value
					});
					break;

				// parse gender
				//
				case 'GENDER':
					this.set({
						'gender': value
					});
					break;
			}
		}

		return this;
	},

	//
	// destroying methods
	//

	delete: function(options) {
		return $.ajax(_.extend({
			url: config.servers.authentication + '/users/' + this.get('id') + '/delete',
			type: 'DELETE',
			dataType: 'json'
		}, options));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.account) {
			data.account = new UserAccount(data.account);
		}
		if (data.check_in) {
			data.check_in = new CheckIn(data.check_in, {
				parse: true
			});
		}

		return data;
	}
}, {

	//
	// static methods
	//

	toVCF: function(json) {
		let lines = [];

		// add name
		//
		let string = '';
		string += (json.last_name || '') + ';';
		string += (json.first_name || '') + ';';
		string += (json.middle_name || '') + ';';
		string += (json.honorific || '') + ';';
		string += (json.titles || '');
		lines.push('N:' + string);

		// add full name
		//
		if (json.full_name) {
			lines.push('FN:' + json.full_name);
		}

		// add nickname
		//
		if (json.preferred_name && json.preferred_name != '') {
			lines.push('NICKNAME:' + json.preferred_name);
		}

		// add gender info
		//
		if (json.gender) {
			lines.push('GENDER:' + json.gender);
		}

		// add profile photo
		//
		if (json.profile_photo) {
			lines.push('PHOTO:' + json.profile_photo);
		}

		return lines;
	}
});
