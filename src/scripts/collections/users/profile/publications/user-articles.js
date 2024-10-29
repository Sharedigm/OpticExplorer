/******************************************************************************\
|                                                                              |
|                              user-articles.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user article publications.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserArticle from '../../../../models/users/profile/publications/user-article.js';
import BaseCollection from '../../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserArticle,

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
			url: user.url() + '/articles'
		}, options));
	}
});
