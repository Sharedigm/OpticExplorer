/******************************************************************************\
|                                                                              |
|                                 connection.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a connection, a subclass of user.             |
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
import DateUtils from '../../utilities/time/date-utils.js';
import TimeUtils from '../../utilities/time/time-utils.js';

export default User.extend({

	//
	// querying methods
	//

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'location':
				return this.has('location');
			case 'occupation':
				return this.has('occupation');
			case 'age':
				return this.has('birth_date');
			case 'birth_date':
				return this.has('birth_date');
			case 'join_date':
				return this.has('created_at');
			case 'connect_date':
				return this.has('accepted_at');
			default:
				return this.get(attributeName);
		}
	},

	//
	// getting methods
	//

	getAge: function() {
		if (this.has('birth_date')) {
			return TimeUtils.getElapsedTime(this.get('birth_date'), new Date(), 'years');
		}
	},

	getAgeString: function() {
		let age = this.getAge();
		return age? 'year'.toPlural(Math.floor(age)) + ' old' : null;
	},

	getFormatString: function(preferences) {
		let dateFormat = preferences? preferences.get('date_format') : undefined;
		return DateUtils.getDateFormat(dateFormat); 		
	},

	//
	// attributes getting methods
	//

	getAttribute: function(attributeName, preferences) {
		switch (attributeName) {
			case 'location':
				return this.get('location');
			case 'occupation':
				return this.get('occupation');
			case 'age':
				return this.getAgeString();
			case 'birth_date':
				return this.has('birth_date')? 'born ' + this.get('birth_date').format(this.getFormatString(preferences)) : undefined;
			case 'join_date':
				return this.has('created_at')? 'joined ' + this.get('created_at').format(this.getFormatString(preferences)) : undefined;
			case 'connect_date':
				return this.has('accepted_at')? 'connected ' + this.get('accepted_at').format(this.getFormatString(preferences)) : undefined;
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'name':
				return this.get('last_name');
			case 'location':
				return this.get('location');
			case 'occupation':
				return this.get('occupation');
			case 'age':
				return this.getAge();
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
	// fetching methods
	//

	delete: function(options) {
		application.session.user.disconnect(this, options);
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = User.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.birth_date) {
			data.birth_date = DateUtils.parse(data.birth_date, 'yyyy-mm-dd');
		}
		if (data.accepted_at) {
			data.accepted_at = DateUtils.parse(data.accepted_at);
		}
		if (data.last_login_at) {
			data.last_login_at = DateUtils.parse(data.last_login_at);
		}

		return data;
	}
});