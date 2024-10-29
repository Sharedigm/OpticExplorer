/******************************************************************************\
|                                                                              |
|                                 moveable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for movable file system items.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileUtils from '../../../utilities/files/file-utils.js';

export default {

	//
	// moving methods
	//

	moveTo: function(dest, options) {
		import(
			'../../../models/storage/directories/directory.js'
		).then((Directory) => {

			// adjust path, if necessary
			//
			if (this instanceof Directory.default) {
				dest = FileUtils.toDirectoryPath(dest);
			}

			// move / rename item
			//
			return $.ajax(_.extend({}, options, {
				url: this.urlRoot + '/move',
				type: 'PUT',
				data: _.extend(this.getData(), {
					dest: dest,
				}),

				// callbacks
				//
				success: (data) => {

					// update model
					//
					this.set(this.parse(data));

					// perform callback
					//
					if (options && options.success) {
						options.success(this);
					}
				}
			}));
		});
	}
};
