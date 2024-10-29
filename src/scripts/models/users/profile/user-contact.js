/******************************************************************************\
|                                                                              |
|                               user-contact.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base model of a user's contact info.         |
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
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	}
});
