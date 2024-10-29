/******************************************************************************\
|                                                                              |
|                            dropbox-uploadable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for uploading files from Dropbox.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default {

	//
	// attributes
	//

	dropBoxDirectory: new Directory({
		path: 'Dropbox/'
	}),

	//
	// uploading methods
	//

	getDropboxImageObject(imgObj, options) {
		$.ajax(_.extend({}, options, {
			url:  imgObj.link,
			method: "GET",
			xhrFields: {
				withCredentials: false,
				responseType: 'blob'
			}
		}));
	},

	uploadDropbox: function(extensions) {
		import(
			'https://www.dropbox.com/static/api/2/dropins.js'
		).then(() => {

			// configure API
			//
			Dropbox.appKey = config.storage.dropbox.appKey;

			// show Dropbox chooser dialog
			//
			Dropbox.choose({
				linkType: "direct", 	// "preview" or "direct"
				multiselect: true,
				extensions: extensions,
				sizeLimit: 1024 * 1024 * 20, 	// size limit for each file , 20M
				
				// callbacks
				//
				success: (items) => {
					let images = [];

					// get images
					//
					items.forEach((item) => {
						this.getDropboxImageObject(item, {

							// callbacks
							//
							success: (blob) => {
								let mimeType;
								let extension = FileUtils.getFileExtension(item.name).toLowerCase();

								// find mime type from file extension
								//
								if (extension == 'png') {
									mimeType = 'image/png';
								} else if (['jpeg', 'jpg'].includes(extension)) {
									mimeType = 'image/jpeg';
								}

								// convert image object to file
								//
								let file = new File([blob], item.name, {
									type: mimeType
								});

								// add file to list
								//
								images.push(file);

								// once we have received all images, upload them
								//
								if (images.length == items.length) {
									this.uploadCloudItems(images, this.dropBoxDirectory);
								}
							},

							error: (jqXHR, textStatus, errorThrown) => {
								console.log("request failed:", jqXHR, textStatus, errorThrown);
							}
						});
					});
				}
			});
		});
	}
};