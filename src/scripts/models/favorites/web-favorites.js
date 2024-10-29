/******************************************************************************\
|                                                                              |
|                                web-favorites.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's web favorites.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserFavorites from '../../models/favorites/user-favorites.js';
import BaseModel from '../../models/base-model.js';

export default UserFavorites.extend({

	// attributes
	//
	category: 'web',

	//
	// constructor
	//

	initialize: function(favorites) {
		this.defaults = favorites;
	},

	//
	// converting methods
	//

	toItems: function() {
		let items = [];
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			items.push(new BaseModel({
				name: key,
				url: value
			}));
		}
		return items;	
	},
});