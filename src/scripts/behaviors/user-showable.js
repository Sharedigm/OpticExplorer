/******************************************************************************\
|                                                                              |
|                               user-showable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying users.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// user showing methods
	//

	showUser: function(user) {
		if (this.desktop) {

			// show in profile viewer app
			//
			this.launch('profile_viewer', {
				model: user
			});
		} else {

			// show in new page
			//
			application.showUrl(user.getUrl());
		}
	},

	showUsers: function(users) {
		for (let i = 0; i < users.length; i++) {
			this.showUser(users[i]);
		}
	}
};