/******************************************************************************\
|                                                                              |
|                                  pdf-file.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a pdf file.                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';

export default File.extend({
	
	//
	// fetching methods
	//

	fetchText: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/pdf/text',
			type: 'GET',
			data: this.getData()
		}));
	}
});