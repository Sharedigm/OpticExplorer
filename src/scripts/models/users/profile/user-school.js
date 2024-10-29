/******************************************************************************\
|                                                                              |
|                               user-school.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's term at a school.                    |
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

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		school_name: undefined,
		school_website: undefined,
		city: undefined,
		state: undefined,
		country: undefined,
		degree: undefined,
		from_grade_level: undefined,
		to_grade_level: undefined,
		from_year: undefined,
		to_year: undefined,
		major_subject: undefined,
		minor_subject: undefined,
		sports: undefined,
		clubs: undefined,
		activities: undefined,
		honors: undefined
	},
	
	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/schools',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	},

	//
	// getting methods
	//

	getDegree: function() {
		switch (this.get('degree')) {
			case 'primary':
				return "Primary School";
			case 'middle':
				return "Middle School";
			case 'secondary':
				return "Secondary School";
			case 'B.A.':
				return "Bachelor of Arts";
			case 'B.S.':
				return "Bachelor of Science";
			case 'B.F.A.':
				return "Bachelor of Science";
			case 'B.A.S.':
				return "Bachelor of Applied Science";
			case 'M.A.':
				return "Master of Arts";
			case 'M.S.':
				return "Master of Science";
			case 'M.B.A.':
				return "Master of Business Administration";
			case 'M.F.A.':
				return "Master of Fine Arts";
			case 'Ph.D.':
				return "Doctor of Philosophy";
			case 'J.D.':
				return "Juris Doctor";
			case 'M.D.':
				return "Doctor of Medicine";
			case 'D.D.S.':
				return "Doctor of Dental Surgery";
		}
	},

	getUrl: function() {
		if (this.has('school_website') && this.get('school_website') != '') {
			let url = this.get('school_website');

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
		return (this.has('degree')? this.get('degree') + ' at ' : '') + this.get('school_name');
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
		if (data.from_year == 0) {
			data.from_year = null;
		}
		if (data.to_year == 0) {
			data.to_year = null;
		}

		return data;
	}
});
