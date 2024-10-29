/******************************************************************************\
|                                                                              |
|                                   likes.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of likes.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Like from '../../models/comments/like.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Like,

	//
	// querying methods
	//

	contains: function(user) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('user').is(user)) {
				return true;
			}
		}
		return false;	
	},

	//
	// converting methods
	//

	toString: function() {
		let string = '';
		for (let i = 0; i < this.length; i++) {
			let user = this.at(i).get('user');

			if (i > 0) {
				if (i == this.length - 1) {
					string += ' and ';
				} else {
					string += ', ';
				}
			}

			if (user.isCurrent()) {
				string += 'you';
			} else {
				string += user.get('short_name');
			}
		}
		return string;
	}
});