/******************************************************************************\
|                                                                              |
|                           timestamped-collection.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a base collection of timestamped models.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default Backbone.Collection.extend({

	//
	// getting methods
	//

	getCreateDate: function() {
		let date = null;

		// find create date of earliest model
		//
		for (let i = 0; i < this.length; i++) {
			let item = this.at(i);
			if (!date || item.has('created_at') && item.get('created_at').getTime() < date.getTime()) {
				date = item.get('created_at');
			}
		}

		return date;
	},

	getUpdateDate: function() {
		let date = null;

		// find update date of most recently updated model
		//
		for (let i = 0; i < this.length; i++) {
			let item = this.at(i);
			if (!date || item.has('updated_at') && item.get('updated_at').getTime() > date.getTime()) {
				date = item.get('updated_at');
			}
		}

		return date;
	}
});