/******************************************************************************\
|                                                                              |
|                               file-favorites.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's favorites.                  |
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
import Items from '../../collections/storage/items.js';

export default UserFavorites.extend({

	//
	// attributes
	//

	category: 'file',

	//
	// setting methods
	//

	setPaths: function(paths) {
		let attributes = {};
		for (let i = 0; i < paths.length; i++) {
			attributes['#' + (i + 1)] = paths[i];
		}
		this.clear({
			silent: true
		});
		this.set(attributes);
	},

	apply: function(view) {
		this.view = view;

		// create favorites from settings
		//
		let paths = this.toPaths();
		let data = [];
		for (let i = 0; i < paths.length; i++) {
			data.push({
				path: paths[i]
			});
		}

		// update view
		//
		view.collection.set(new Items(data, {
			parse: true
		}).toArray());
	},

	//
	// converting methods
	//

	toPaths: function() {
		let paths = [];
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			paths.push(value);
		}
		return paths;
	},

	toItems: function() {
		let items = new Items();
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = this.get(key);
			items.add(Items.toItem({
				path: value
			}));
		}
		return items;	
	}
});