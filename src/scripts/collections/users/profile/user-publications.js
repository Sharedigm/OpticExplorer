/******************************************************************************\
|                                                                              |
|                             user-publications.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user publications info.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseCollection from '../../../collections/base-collection.js';
import UserBooks from '../../../collections/users/profile/publications/user-books.js';
import UserArticles from '../../../collections/users/profile/publications/user-articles.js';
import UserPatents from '../../../collections/users/profile/publications/user-patents.js';

export default BaseCollection.extend({

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return new UserBooks().fetchByUser(user, {

			// callbacks
			//
			success: (collection) => {
				this.add(collection.models);
				new UserArticles().fetchByUser(user, {

					// callbacks
					//
					success: (collection) => {
						this.add(collection.models);
						new UserPatents().fetchByUser(user, {

							// callbacks
							//
							success: (collection) => {
								this.add(collection.models);
								if (options && options.success) {
									options.success(this);
								}
							}
						});
					}
				});
			}
		});
	}
});
