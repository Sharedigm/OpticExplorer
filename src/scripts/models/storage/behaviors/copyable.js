/******************************************************************************\
|                                                                              |
|                                 copyable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for copyable file system items.                 |
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
	// copying methods
	//

	copyTo: function(dest, options) {
		import(
			'../../../models/storage/directories/directory.js'
		).then((Directory) => {

			// adjust path, if necessary
			//
			if (this instanceof Directory.default) {
				dest = FileUtils.toDirectoryPath(dest);
			}

			// copy item to new location
			//
			return $.ajax(_.extend({}, options, {
				url: this.urlRoot + '/copy',
				type: 'POST',
				data: _.extend(this.getData(), {
					dest: dest,
					replace: options && options.replace? true : false,
				}),
				
				// callbacks
				//
				success: (data) => {

					// perform callback
					//
					if (options && options.success) {
						options.success(new this.constructor(data));
					}
				}
			}));
		});
	}
};
