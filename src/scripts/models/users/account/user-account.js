/******************************************************************************\
|                                                                              |
|                               user-account.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's account.                             |
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
import TimeUtils from '../../../utilities/time/time-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		user_id: undefined,
		username: undefined,
		password: undefined,
		email: undefined,

		// flags
		//
		enabled_flag: undefined,
		email_verified_flag: undefined,
		admin_flag: undefined,

		// timestamps
		//
		created_at: undefined,
		updated_at: undefined,
		penultimate_login_at: undefined,
		ultimate_login_at: undefined
	},

	//
	// ajax attributes
	//

	idAttribute: 'user_id',
	urlRoot: config.servers.authentication + '/users',

	//
	// querying methods
	//

	url: function() {
		return this.urlRoot + '/' + this.get('user_id') + '/account';
	},
	
	isCurrent: function() {
		return this.get('user_id') == application.session.user.get('id');
	},

	isVerified: function() {
		return this.get('email_verified_flag') == 1;
	},

	isPending: function() {
		return this.get('email_verified_flag') == 0;
	},

	isEnabled: function() {
		return this.get('enabled_flag') == 1;
	},

	isDisabled: function() {
		return this.get('enabled_flag') == 0;
	},

	isAdmin: function() {
		return this.get('admin_flag') == true;
	},

	hasSshAccess: function() {
		return this.get('has_ssh_access') == 1;
	},

	//
	// getting methods
	//

	getTimeSinceSignIn: function() {
		let date1 = DateUtils.UTCToLocalDate(this.get('ultimate_login_at'));
		let date2 = new Date();
		return TimeUtils.getElapsedTime(date1, date2);
	},

	getTimeSincePreviousSignIn: function() {
		let date1 = DateUtils.UTCToLocalDate(this.get('penultimate_login_at'));
		let date2 = new Date();
		return TimeUtils.getElapsedTime(date1, date2);
	},

	getStatus: function() {
		let status;
		if (this.isPending()) {
			status = 'pending';
		} else if (this.isEnabled()) {
			status = 'enabled';
		} else {
			status = 'disabled';
		}
		return status;
	},

	//
	// storage querying methods
	//

	getDiskUsed: function() {
		return this.get('disk_usage');
	},

	getDiskFree: function(precision) {
		let disk_usage = this.get('disk_usage');
		let disk_quota = this.get('disk_quota');

		if (!disk_quota) {
			return undefined;
		}
	
		// convert disk usage to bytes
		//
		if (typeof disk_usage  == 'string') {
			disk_usage = this.toBytes(disk_usage);
		}
		if (typeof disk_quota == 'string') {
			disk_quota = this.toBytes(disk_quota);
		}

		let bytes_free = disk_quota - disk_usage;
		let disk_free = this.bytesToString(Math.abs(bytes_free), precision);

		return (bytes_free < 0? '-' : '') + disk_free;
	},

	getPercentDiskUsed: function() {
		let disk_usage = this.get('disk_usage');
		let disk_quota = this.get('disk_quota');

		if (!disk_quota) {
			return 0;
		}

		// convert disk usage to bytes
		//
		if (typeof disk_usage  == 'string') {
			disk_usage = this.toBytes(disk_usage);
		}
		if (typeof disk_quota == 'string') {
			disk_quota = this.toBytes(disk_quota);
		}

		return disk_usage / disk_quota * 100;
	},

	getPercentDiskFree: function() {
		return 100 - this.getPercentDiskUsed();
	},

	//
	// converting methods
	//

	toBytes: function(string) {
		let value;

		// convert disk usage to bytes
		//
		if (string.endsWith('K')) {
			value = parseFloat(string.slice(0, -1)) * 1024;
		} else if (string.endsWith('M')) {
			value = parseFloat(string.slice(0, -1)) * 1024 * 1024;
		} else if (string.endsWith('G')) {
			value = parseFloat(string.slice(0, -1)) * 1024 * 1024 * 1024;
		} else {
			value = parseFloat(string);
		}

		return value;
	},

	bytesToString: function(bytes, precision) {

		// set optional parameter defaults
		//
		if (precision == undefined) {
			precision = 3;
		}

		if (bytes > 1024 * 1024 * 1024) {
			return (bytes / (1024 * 1024 * 1024)).toPrecision(precision) + 'G';
		} else if (bytes > 1024 * 1024) {
			return (bytes / (1024 * 1024)).toPrecision(precision) + 'M';
		} else if (bytes > 1024) {
			return (bytes / 1024).toPrecision(precision) + 'K';
		} else {
			return bytes + ' bytes';
		}
	},

	//
	// setting methods
	//

	setStatus: function(status) {
		switch (status) {
			case 'pending':
				this.set({
					enabled_flag: false
				});
				break;
			case 'enabled':
				this.set({
					enabled_flag: true,
					email_verified_flag: true
				});
				break;
			case 'disabled':
				this.set({
					enabled_flag: false
				});
				break;
		}
	},

	setAdmin: function(isAdmin) {
		if (isAdmin) {
			this.set({
				admin_flag: true
			});
		} else {
			this.set({
				admin_flag: false
			});
		}
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: this.urlRoot + '/' + user.get('id') + '/account'
		}, options));
	},

	fetchByCurrentUser: function(options) {
		this.fetchByUser(application.session.user, options);
	},

	//
	// updating methods
	//

	checkValidation: function(data, options) {
		return $.ajax(_.extend({
			url: config.servers.authentication + '/users/accounts/validate',
			type: 'POST',
			dataType: 'json',
			data: _.extend({
				user_id: this.get('user_id')
			}, data)
		}, options));
	},

	changePassword: function(oldPassword, newPassword, options) {
		return $.ajax(_.extend({
			url: config.servers.authentication + '/users/' + this.get('user_id') + '/change-password',
			type: 'PUT',
			data: {
				id: options.id,
				key: options.key,
				old_password: oldPassword,
				new_password: newPassword
			}
		}, options));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse timestamps
		//
		if (data.ultimate_login_at) {
			data.ultimate_login_at = DateUtils.parse(data.ultimate_login_at);
		}
		if (data.penultimate_login_at) {
			data.penultimate_login_at = DateUtils.parse(data.penultimate_login_at);
		}

		return data;
	}
});