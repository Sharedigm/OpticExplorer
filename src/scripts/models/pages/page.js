/******************************************************************************\
|                                                                              |
|                                    page.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file or directory.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		pdf: undefined,
		page_number: undefined
	},

	//
	// querying methods
	//

	is: function(page) {
		return page && this.get('page_number') == page.get('page_number');
	}
});