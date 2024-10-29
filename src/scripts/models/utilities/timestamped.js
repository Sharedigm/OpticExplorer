/******************************************************************************\
|                                                                              |
|                                  timestamped.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a base time stamped base model.               |
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
import DateUtils from '../../utilities/time/date-utils.js';
import '../../utilities/time/iso8601.js';

export default BaseModel.extend({

	//
	// querying methods
	//

	isUpdated: function() {
		return this.has('created_at') && this.has('updated_at') &&
			this.get('created_at').getTime() != this.get('updated_at').getTime();
	},

	//
	// date querying methods
	//

	hasCreateDate: function() {
		return this.has('created_at');
	},

	hasUpdateDate: function() {
		return this.has('updated_at');
	},

	hasDeleteDate: function() {
		return this.has('deleted_at');
	},

	//
	// date getting methods
	//

	getCreateDate: function() {
		if (this.has('created_at')) {
			return this.get('created_at');
		}
	},

	getUpdateDate: function() {
		if (this.has('updated_at')) {
			return this.get('updated_at');
		}
	},

	getDeleteDate: function() {
		if (this.has('deleted_at')) {
			return this.get('deleted_at');
		}
	},

	//
	// converting methods
	//

	toDate: function(date) {

		// handle string types
		//
		if (typeof(date) === 'string') {

			// handle null string
			//
			if (date === '0000-00-00 00:00:00') {
				date = new Date(0);

			// parse date string
			//
			} else {
				date = Date.parseIso8601(date);
			}
			
		// handle object types
		//
		} else if (typeof(date) === 'object') {
			if (date.date) {
				date = Date.parseIso8601(date.date);
			}
		}

		return date;
	},

	when: function(options) {
		return DateUtils.when(this.get('created_at'), options);
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// convert laravel dates
		//
		if (response.created_at) {
			response.created_at = this.toDate(response.created_at);
		}
		if (response.updated_at) {
			response.updated_at = this.toDate(response.updated_at);
		}
		if (response.deleted_at) {
			response.deleted_at = this.toDate(response.deleted_at);
		}

		return response;
	}
});
