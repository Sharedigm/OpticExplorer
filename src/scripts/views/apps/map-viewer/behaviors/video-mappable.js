/******************************************************************************\
|                                                                              |
|                              video-mappable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding videos to maps.                      |
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
import VideoFile from '../../../../models/storage/media/video-file.js';

export default {

	//
	// video adding methods
	//

	addVideo: function(item, options) {

		// check if photo has a geolocation
		//
		if (item.hasGeolocation && item.hasGeolocation()) {
			let videos = this.getActivePaneView().videos;

			// check if video has already been added
			//
			if (!videos.containsPath(item.get('path'))) {

				// add video to collection
				//
				videos.add(item);

				// zoom to new video
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
				message: "The video '" + item.get('path') + "' does not have a geographical location. ",
				details: "Note:  Videos can lose their geographical location if they have been manipulated by software " +
					"that does not preserve the location. " + "For example, if you have resized, cropped, adjusted, or downloaded " +
					"a video, it may have lost its location. " + "To ensure that your video does not lose its " +
					"location, make sure to upload the original file as it was exported from the camera. "
			});
		}
	},
	
	removeVideos: function(videos, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to remove ' + (videos.length == 1? videos[0].getName() : 'these ' + videos.length + ' photos') + ' from the map?',

				// callbacks
				//
				accept: () => {
					this.removeVideos(videos, {
						confirm: false
					});
				}
			});
		} else if (this.hasActivePaneView()) {

			// remove photos from collection
			//
			this.getActivePaneView().videos.remove(videos);

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.setDirty();
		}
	},

	removeSelectedVideos: function() {
		this.removeVideos(this.getSelectedLayerModels('videos'));
	},

	//
	// dialog rendering methods
	//

	showAddVideosDialog: function() {
		import(
			'../../../../views/apps/map-viewer/dialogs/items/add-items-dialog-view.js'
		).then((AddItemsDialogView) => {

			// show open dialog
			//
			this.show(new AddItemsDialogView.default({

				// options
				//
				icon: "fa fa-video-camera",
				title: "Add Videos",
				description: "Select a source location to add videos from: ",

				// callbacks
				//
				onselect: (source) => {
					switch (source) {
						case 'my-files':
							this.showAddLocalVideosDialog();
							break;
						case 'upload-files':
							this.triggerUpload();
							break;
						case 'dropbox':
							this.uploadDropbox(VideoFile.extensions);
							break;
						case 'google-drive':
							this.uploadGoogleDrive();
							break;
					}
				}
			}));
		});
	},

	showAddLocalVideosDialog: function() {
		import(
			'../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({
				model: new Directory({
					path: this.preferences.get('videos_directory')
				}),

				// options
				//
				title: "Add Videos",

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