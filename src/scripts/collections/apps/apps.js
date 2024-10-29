/******************************************************************************\
|                                                                              |
|                                    apps.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a collection of applications.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import App from '../../models/apps/app.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: App,

	//
	// methods
	//

	getByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('name') == name) {
				return model;
			}
		}
	},

	getById: function(id) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('id') == id) {
				return model;
			}
		}
	},

	getByIds: function(ids) {
		let apps = [];
		for (let i = 0; i < ids.length; i++) {
			let app = this.getById(ids[i]);
			if (app) {
				apps.push(app);
			}
		}

		return new this.constructor(apps);
	},
});