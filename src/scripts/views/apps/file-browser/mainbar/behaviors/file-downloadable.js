/******************************************************************************\
|                                                                              |
|                             file-downloadable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for downloading items.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import Browser from '../../../../../utilities/web/browser.js';

export default {

	//
	// downloading methods
	//

	downloadItem: function(item) {

		// make sure that item is a file
		//
		if (!(item instanceof File)) {
			return;
		}

		// check file permissions
		//
		if (!item.isReadableBy(application.session.user)) {

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
		item.download();
	},

	downloadItems: function(items) {
		let urls = [];
		for (let i = 0; i < items.length; i++) {
			let item = items[i];

			// check file permissions
			//
			if (!item.isReadableBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to download this item!"
				});

				return;
			}

			urls.push(item.getDownloadUrl());
		}

		Browser.downloadAll(urls);
	},

	download: function(items) {

		// check if only one item
		//
		if (!Array.isArray(items)) {

			// download single item
			//
			this.downloadItem(items);

			return;
		}

		// check if no items
		//
		if (items.length == 0) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-mouse-pointer"></i>',
				title: "Select",
				message: "No items selected."
			});

			return;
		}

		// download multiple items
		//
		this.downloadItems(items);
	}
};