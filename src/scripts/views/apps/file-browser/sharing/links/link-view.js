/******************************************************************************\
|                                                                              |
|                                  link-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view to show a link to a file or folder.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserProfile from '../../../../../models/users/profile/user-profile.js';
import BaseView from '../../../../../views/base-view.js';
import UserProfileHeaderView from '../../../../../views/users/profile/user-profile-header-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	regions: {
		header: '.user-profile-header'
	},

	//
	// rendering methods
	//

	templateContext: function() {			
		return {
			username: this.model.get('user').getName('short'),
			message: HtmlUtils.encode(this.model.get('message'))
		};
	},

	onRender: function() {

		// fetch user profile
		//
		new UserProfile().fetchByUser(this.model.get('user'), {

			// callbacks
			//
			success: (model) => {

				// show child view
				//
				this.showUserProfileHeader(model);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's profile.",
					response: response
				});
			}
		});
	},

	showUserProfileHeader: function(profile) {

		// show user profile header
		//
		this.showChildView('header', new UserProfileHeaderView({
			model: this.model.get('user'),
			profile: profile,
			heading: 'From' + '<hr />' + this.model.get('user').getName('full')
		}));	
	}
});