/******************************************************************************\
|                                                                              |
|                                 user-job.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's work history job.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';
import DateUtils from '../../../utilities/time/date-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {

		// who
		//
		company_name: undefined,
		company_website: undefined,
		division: undefined,

		// what
		//
		title: undefined,
		description: undefined,

		// when
		//
		from_date: undefined,
		to_date: undefined,

		// where
		//
		city: undefined,
		state: undefined,
		country: undefined,

		// why / how
		//
		achievements: undefined,
		awards: undefined,
		skills: undefined,
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/jobs',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	},

	//
	// getting methods
	//

	getUrl: function() {
		if (this.has('company_website') && this.get('company_website') != '') {
			let url = this.get('company_website');

			// add protocol
			//
			if (url.startsWith('http')) {
				return url;
			} else {
				return 'http://' + url;
			}
		}
	},

	getLocation: function() {
		let name;
		if (this.has('city')) {
			name = this.get('city');
		}
		if (this.has('state')) {
			let state = this.get('state');
			if (name && state.length > 0) {
				name += ', ';
			}
			name += state;
		} else if (this.has('country')) {
			let country = this.get('country');
			if (country != 'United States') {
				if (name && country.length > 0) {
					name += ', ';
				}
				name += this.get('country');
			}
		}
		return name;
	},

	//
	// converting methods
	//

	toString: function() {
		let name = this.get('title');
		if (this.has('company_name') && this.get('company_name') != '') {
			name += ' at ' + this.get('company_name');
		}
		return name;
	},

	toContactInfo: function() {
		let json = {};

		json.title = this.get('title');
		json.company_name = this.get('company_name');

		return json;
	},

	toVCF: function() {
		let lines = [];

		lines.push('TITLE:' + this.get('title'));
		lines.push('ORG:' + this.get('company_name'));

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

				// parse title
				//
				case 'TITLE':
					this.set({
						title: value
					});
					break;

				case 'ORG':
					this.set({
						company_name: value
					});
					break;
			}
		}

		if (this.hasChanged()) {
			return this;
		} else {
			return null;
		}
	},

	toJSON: function() {

		// call superclass method
		//
		let json = Timestamped.prototype.toJSON.call(this);

		// parse attributes
		//
		if (this.has('from_date')) {
			json.from_date = this.get('from_date').format('yyyy-mm-dd');
		}
		if (this.has('to_date')) {
			json.to_date = this.get('to_date').format('yyyy-mm-dd');
		}

		return json;
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
		if (data.from_date) {
			data.from_date = DateUtils.parse(data.from_date);
		}
		if (data.to_date) {
			data.to_date = DateUtils.parse(data.to_date);
		}

		return data;
	}
}, {

	//
	// static methods
	//

	toVCF: function(json) {
		let lines = [];

		if (json.title) {
			lines.push('TITLE:' + json.title);
		}
		if (json.company_name) {
			lines.push('ORG:' + json.company_name);
		}

		return lines;
	}
});
