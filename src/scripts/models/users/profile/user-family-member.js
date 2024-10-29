/******************************************************************************\
|                                                                              |
|                            user-family-member.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's family member.                       |
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

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		relationship: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/family',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	},

	//
	// getting methods
	//

	get: function(attribute) {
		let name, names;

		switch (attribute) {

			case 'first_name':
				name = this.get('name');
				names = name.split(' ');
				return names[0];

			case 'last_name':
				name = this.get('name');
				names = name.split(' ');
				return names[names.length - 1];
				
			default:
				return Timestamped.prototype.get.call(this, attribute);		
		}
	},

	//
	// converting methods
	//

	toString: function() {
		return this.get('name');
	}
});
