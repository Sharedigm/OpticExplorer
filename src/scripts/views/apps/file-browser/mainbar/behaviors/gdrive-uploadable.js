/******************************************************************************\
|                                                                              |
|                             gdrive-uploadable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for uploading files from Google Drive.        |
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
//
// private variables
//
let scope = 'https://www.googleapis.com/auth/drive.readonly';
let oauthType;
let oauthToken;

export default {

	//
	// attributes
	//

	googleDirectory: new Directory({
		path: 'Google/'
	}),

	//
	// methods
	//

	showGooglePicker() {
		let self = this;

		function callback(data) {
			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				self.processGoogleDocs(data[google.picker.Response.DOCUMENTS]);
			}
		}

		gapi.load('picker', {
			callback: () => {
				if (oauthToken) {
					let view = new google.picker.DocsView().setParent('root');
					view.setMimeTypes("image/png,image/jpeg,image/jpg");
					view.setIncludeFolders(true);
					view.setSelectFolderEnabled(true);
					let picker = new google.picker.PickerBuilder()
						.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
						.setAppId(config.storage.google.appId)
						.setOAuthToken(oauthToken)
						.addView(view)
						.setDeveloperKey(config.storage.google.developerKey)
						.setCallback(callback)
						.build();
					picker.setVisible(true);
				}
			}
		});
	},

	processGoogleDocs(docs) {
		let images = [];
		let self = this;

		function processGoogleDoc(doc) {
			$.ajax({
				url: 'https://www.googleapis.com/drive/v2/files/' + doc.id,
				method: 'GET',
				key: config.storage.google.developerKey,
				fields: 'imageMediaMetadata, Thumbnail',
				headers: {
					'Authorization': `${oauthType} ${oauthToken}`
				},

				// callbacks
				//
				success: (imgObj) => {
					self.getGDriveImageObject(docs, imgObj, images);
				},

				error: (jqXHR, textStatus, errorThrown) => {
					console.log("request failed:", jqXHR, textStatus, errorThrown);
				}
			});
		}

		// process all docs
		//
		for (let doc of docs) {
			processGoogleDoc(doc);
		}
	},

	getGDriveImageObject(docs, imgObj, images) {
		$.ajax(_.extend({}, {
			url:  imgObj.downloadUrl,
			method: "GET",
			xhrFields: {
				withCredentials: false,
				responseType: 'blob'
			},
			headers: {
				'Authorization': `${oauthType} ${oauthToken}`
			},

			// callbacks
			//
			success: (blob) => {
				let mimeType;
				let extension = FileUtils.getFileExtension(imgObj.originalFilename).toLowerCase();

				// find mime type from file extension
				//
				if (extension == 'png') {
					mimeType = 'image/png';
				} else if (['jpeg', 'jpg'].includes(extension)) {
					mimeType = 'image/jpeg';
				}

				// convert image object to file
				//
				let file = new File([blob], imgObj.originalFilename, {
					type: mimeType
				});

				// add file to list
				//
				images.push(file);

				// once we have received all images, upload them
				//
				if (images.length == docs.length) {
					this.uploadCloudItems(images, this.googleDirectory);
				}
			},

			error: (jqXHR, textStatus, errorThrown) => {
				console.log("request failed:", jqXHR, textStatus, errorThrown);
			}   
		}));
	},
	
	uploadGoogleDrive: function() {
		import(
			'https://apis.google.com/js/api.js'
		).then(() => {
			gapi.load('auth', {
				callback: () => {
					gapi.auth.authorize({
						'client_id': config.storage.google.clientId,
						'scope': scope,
						'immediate': false
					}, (authResult) => {
						if (authResult && !authResult.error) {
							oauthType = authResult.token_type;
							oauthToken = authResult.access_token;
							this.showGooglePicker();
						}
					});
				}
			});
		});
	}
};