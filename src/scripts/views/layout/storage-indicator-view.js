/******************************************************************************\
|                                                                              |
|                          storage-indicator-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAccount from '../../models/users/account/user-account.js';
import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template('<i class="fa fa-database"></i><div class="amount"></div>' +
		'<div class="bar"><div class="inner"></div></div>'),

	className: 'indicator',
	
	events: {
		'click': 'onClick'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.model = new UserAccount();
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.fetchUserAccount((userAccount) => {
			let percentage = Math.floor(userAccount.getPercentDiskFree());
			this.$el.find('.amount').html(percentage + '% free');
			this.$el.find('.inner').css('width', percentage + '%');
		});
	},

	//
	// ajax methods
	//

	fetchUserAccount: function(callback) {
		this.model.fetchByUser(application.session.user, {

			// callbacks
			//
			success: (model) => {
				callback(model);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's account.",
					response: response
				});
			}
		});
	},
});