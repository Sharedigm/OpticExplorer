/******************************************************************************\
|                                                                              |
|                               user-patents.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user patent publications.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPatent from '../../../../models/users/profile/publications/user-patent.js';
import BaseCollection from '../../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserPatent,

	//
	// sorting methods
	//

	comparator: function(model) {
		return model.get('title');
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/patents'
		}, options));
	}
});
