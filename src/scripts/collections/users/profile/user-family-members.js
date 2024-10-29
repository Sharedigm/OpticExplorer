/******************************************************************************\
|                                                                              |
|                            user-family-members.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user family members.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserFamilyMember from '../../../models/users/profile/user-family-member.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserFamilyMember,

	//
	// sorting methods
	//

	comparator: function(model) {
		return model.get('name');
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/family'
		}, options));
	}
});
