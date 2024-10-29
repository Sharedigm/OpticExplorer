/******************************************************************************\
|                                                                              |
|                             identity-provider.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model for a federated (auth) identity provider.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// Backbone attributes
	//

	urlRoot: config.servers.api + '/idps'
});
