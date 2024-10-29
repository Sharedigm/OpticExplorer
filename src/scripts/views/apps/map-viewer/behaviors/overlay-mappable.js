/******************************************************************************\
|                                                                              |
|                             overlay-mappable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding overlays to maps.                    |
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

	addOverlay: function(item, options) {

		// check if photo has a geoposition
		//
		if (item.hasGeoposition && item.hasGeoposition()) {
			let overlays = this.getActivePaneView().overlays;

			// check if overlay has already been added
			//
			if (!overlays.containsPath(item.get('path'))) {

				// add overlay to collection
				//
				overlays.add(item);

				// zoom to new overlay
				//
				if (options && options.zoomTo) {
					this.zoomToPlace(item.getPlace(5));
				}

				this.getActivePaneView().getChildView('content').addOverlay(item);

				// update
				//
				this.setDirty();
			}
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-compass"></i>',
				title: 'Geoposition Error',
				message: "The photo '" + item.get('path') + "' does not have a geographical position. ",
				details: "Check to see if this photo is a ortho positioned photo (such as a GeoTiff). "
			});
		}
	},
	
	removeOverlays: function(overlays, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to remove ' + (overlays.length == 1? overlays[0].getName() : 'these ' + overlays.length + ' overlays') + ' from the map?',

				// callbacks
				//
				accept: () => {
					this.removeOverlays(overlays, {
						confirm: false
					});
				}
			});
		} else if (this.hasActivePaneView()) {

			// remove overlays from collection
			//
			this.getActivePaneView().overlays.remove(overlays);

			// remove overlays from view
			//
			this.getActiveView().removeOverlays(overlays);

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.setDirty();
		}
	},

	removeSelectedOverlays: function() {
		this.removeOverlays(this.getSelectedLayerModels('overlays'));
	},

	//
	// dialog rendering methods
	//

	showAddOverlaysDialog: function() {
		import(
			'../../../../views/apps/map-viewer/dialogs/items/add-items-dialog-view.js'
		).then((AddItemsDialogView) => {

			// show open dialog
			//
			this.show(new AddItemsDialogView.default({

				// options
				//
				icon: "fa fa-image",
				title: "Add Overlays",
				description: "Select a source location to add overlays from: ",

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

	showAddLocalOverlaysDialog: function() {
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
				title: "Add Overlays",

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