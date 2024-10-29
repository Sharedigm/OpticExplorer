/******************************************************************************\
|                                                                              |
|                                   session.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a model of a user's login session.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import User from '../../../models/users/user.js';
import Directory from '../../../models/storage/directories/directory.js';

export default BaseModel.extend({

	//
	// attributes
	//

	url: config.servers.api + '/sessions/current',

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		this.options = options;

		// create new home directory
		//
		this.home = new Directory();
	},

	//
	// querying methods
	//

	isLoggedIn: function() {
		return this.user ? true : false;
	},

	//
	// getting methodsd
	//

	getUser: function(userId, options) {

		// fetch the user from the server
		//
		new User({
			id: userId
		}).fetch(_.extend({}, options, {

			// callbacks
			//
			success: (user) => {

				// set session attributes
				//
				this.user = user;

				// perform callback
				//
				if (options && options.success) {
					options.success(user);
				}
			}
		}));
	},

	//
	// login / begin session methods
	//

	login: function(username, password, options) {

		// initialize the session
		//
		return $.ajax(config.servers.api + '/login', _.extend({}, options, {
			type:'POST',
			dataType:'json',
			data: {
				'username': username,
				'password': password
			},

			// callbacks
			//
			success: (user) => {

				// trap session errors
				//
				this.trapErrors();

				// perform callback
				//
				if (options && options.success) {
					options.success(user);
				}
			}
		}));
	},

	relogin: function(options) {
		this.fetch({

			// callbacks
			//
			success: (data) => {
				if (data.has('user_id')) {

					// get previously logged in user
					//
					return this.getUser(data.get('user_id'), {

						// callbacks
						//
						success: (user) => {

							// set session attributes
							//
							this.user = user;

							// trap session errors
							//
							this.trapErrors();

							// perform callback
							//
							if (options && options.success) {
								options.success(user);
							}
						}
					});
				} else {

					// session has expiried
					//
					this.user = null;

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}	
				}
			},

			error: () => {

				// no response from server
				//
				this.user = null;

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}	
			}
		});
	},

	//
	// logout / end session methods
	//

	logout: function(options) {

		// remove guest user
		//
		if (this.user && this.user.guest) {
			$.removeCookie('guest-user');
			this.user = null;

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}

			return;
		}

		// delete local user info
		//
		this.user = null;

		// reset home diretory
		//
		this.home = null;

		// restore ajax handler
		//
		$.ajax = this.ajax;

		// log out from server
		//
		$.ajax(config.servers.api + '/logout', _.extend({
			type: 'POST'
		}, options));
	},

	//
	// error handling
	//

	trapErrors: function() {
		let self = this;

		// log the user out if their session is found to be invalid
		//
		/*
		$(document).ajaxError((event, jqXHR) => {
			if (self.session.user) {
				if (jqXHR.status == 401) {
					if (self.options && self.options.error) {
						self.options.error();
					}
				}
			}
		});
		*/

		// log the user out if their session is found to be invalid
		//
		/*
		$(document).ajaxError((event, jqXHR) => {
			if (self.session.user) {
				if (jqXHR.responseText == 'Session invalid.' || 
					jqXHR.responseText == 'No session.') {
					if (self.options && self.options.error) {
						self.sessionError();
					}
				}
			}
		});
		*/

		// save original ajax handler
		//
		if (!this.ajax) {
			this.ajax = $.ajax;
		}

		$.ajax = function() {
			let url, options, success, error;

			if (typeof arguments[0] == 'string') {

				// ajax call has two arguments
				//
				url = arguments[0];
				options = arguments[1];
				success = options? options.success : undefined;
				error = options? options.error : undefined;
				return self.ajax.call(this, url, _.extend(options, {

					// callbacks
					//
					success: () => {
						if (success) {
							success.apply(this, arguments);
						}
					},

					error: (jqXHR) => {
						if (jqXHR.responseText == 'Session invalid.' || 
							jqXHR.responseText == 'No session.') {

							// perform callback
							//
							if (self.options.error) {
								self.options.error();
							}
						} else {
							if (error) {
								error.apply(this, arguments);
							}
						}
					}
				}));
			} else {

				// ajax call has one argument
				//
				options = arguments[0];
				success = options? options.success : undefined;
				error = options? options.error : undefined;
				return self.ajax.call(this, _.extend(options, {

					// callbacks
					//
					success: function() {
						if (success) {
							success.apply(this, arguments);
						}
					},

					error: function(jqXHR) {
						if (jqXHR.responseText == 'Session invalid.' || 
							jqXHR.responseText == 'No session.') {

							// perform callback
							//
							if (self.options.error) {
								self.options.error();
							}
						} else {
							if (error) {
								error.apply(this, arguments);
							}
						}
					}
				}));
			}
		};
	}
});