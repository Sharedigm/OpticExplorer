/******************************************************************************\
|                                                                              |
|                              photo-mappable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding photos to maps.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../models/storage/directories/directory.js';
import ImageFile from '../../../../models/storage/media/image-file.js';

export default {

	//
	// photo adding methods
	//

	addPhoto: function(item, options) {

		// check if photo has a geolocation
		//
		if (item.hasGeolocation && item.hasGeolocation()) {
			let photos = this.getActivePaneView().photos;

			// check if photo has already been added
			//
			if (!photos.containsPath(item.get('path'))) {

				// add photo to collection
				//
				photos.add(item);

				// zoom to new photo
				//
				if (options && options.zoomTo) {
					this.zoomToPlace(item.getPlace(9));
				}

				// update
				//
				this.setDirty();
			}
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-compass"></i>',
				title: 'Geolocation Error',
				message: "The photo '" + item.get('path') + "' does not have a geographical location. ",
				details: "Photos can lose their geographical location if they have been manipulated by software " +
					"that does not preserve the location. " + "For example, if you have resized, cropped, adjusted, or downloaded " +
					"a photo, it may have lost its location. " + "To ensure that your photo does not lose its " +
					"location, make sure to upload the original file as it was exported from the camera. "
			});
		}
	},
	
	removePhotos: function(photos, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to remove ' + (photos.length == 1? photos[0].getName() : 'these ' + photos.length + ' photos') + ' from the map?',

				// callbacks
				//
				accept: () => {
					this.removePhotos(photos, {
						confirm: false
					});
				}
			});
		} else if (this.hasActivePaneView()) {

			// remove photos from collection
			//
			this.getActivePaneView().photos.remove(photos);

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.setDirty();
		}
	},

	removeSelectedPhotos: function() {
		this.removePhotos(this.getSelectedLayerModels('photos'));
	},

	//
	// dialog rendering methods
	//

	showAddPhotosDialog: function() {
		import(
			'../../../../views/apps/map-viewer/dialogs/items/add-items-dialog-view.js'
		).then((AddItemsDialogView) => {

			// show open dialog
			//
			this.show(new AddItemsDialogView.default({

				// options
				//
				icon: "fa fa-image",
				title: "Add Photos",
				description: "Select a source location to add photos from: ",

				// callbacks
				//
				onselect: (source) => {
					switch (source) {
						case 'my-files':
							this.showAddLocalPhotosDialog();
							break;
						case 'upload-files':
							this.triggerUpload();
							break;
						case 'dropbox':
							this.uploadDropbox(ImageFile.extensions);
							break;
						case 'google-drive':
							this.uploadGoogleDrive();
							break;
					}
				}
			}));
		});
	},

	showAddLocalPhotosDialog: function() {
		import(
			'../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({
				model: new Directory({
					path: this.preferences.get('photos_directory')
				}),

				// options
				//
				title: "Add Photos",

				// callbacks
				//
				onopen: (items) => {
					this.addItems(items, {
						recursive: true
					});

					// play add sound
					//
					application.play('add');
				}
			}));
		});
	}
}