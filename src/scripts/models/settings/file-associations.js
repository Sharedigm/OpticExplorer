/******************************************************************************\
|                                                                              |
|                             file-associations.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of file association settings.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';

function getFileAssociations() {
	let associations = {};
	let keys = Object.keys(config.files.files.extensions);
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		associations[key] = config.files.files.extensions[key].app;
	}
	return associations;
}

export default UserSettings.extend({

	//
	// attributes
	//

	category: 'file_association',
	defaults: getFileAssociations(),

	//
	// getting methods
	//

	getFileExtensions: function(app) {
		let extensions = [];
		for (let i = 0; i < Object.keys(this.attributes).length; i++) {
			let extension = Object.keys(this.attributes)[i];
			if (this.get(extension) == app) {
				extensions.push(extension);
			}
		}
		return extensions;
	}
});