/******************************************************************************\
|                                                                              |
|                               user-storage.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's storage.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		id: undefined,
		user_id: undefined,

		// storage attributes
		//
		host: undefined,
		key: undefined,
		secret: undefined,
		region: undefined,
		bucket: undefined,

		// timestamps
		//
		created_at: undefined,
		updated_at: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.authentication + '/storage',
});