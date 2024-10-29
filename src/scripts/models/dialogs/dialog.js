/******************************************************************************\
|                                                                              |
|                                   dialog.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a (modal or dialog) window.                   |
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

	icon: null,
	title: "Untitled"
});