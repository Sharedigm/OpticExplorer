/******************************************************************************\
|                                                                              |
|                               downloadable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a downloadable behavior mixin for file system items.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../utilities/web/browser.js';

export default {

	//
	// getting methods
	//

	getDownloadUrl: function() {
		return this.urlRoot + '/download?' + this.getQueryString();
	},

	//
	// downloading methods
	//

	download: function() {

		// check file permissions
		//
		if (!this.isReadableBy(application.session.user)) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to download this item!"
			});

			return;
		}

		// download item
		//
		Browser.download(this.getDownloadUrl());
	}
};