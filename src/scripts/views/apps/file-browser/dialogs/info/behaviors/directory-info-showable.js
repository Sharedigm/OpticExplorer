/******************************************************************************\
|                                                                              |
|                          directory-info-showable.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing directory item information.       |
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
	// dialog rendering methods
	//

	showDirectoryInfoDialog: function(directory, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/directory-info-dialog-view.js'
		).then((DirectoryInfoDialogView) => {

			// show directory info dialog
			//
			this.show(new DirectoryInfoDialogView.default(_.extend({
				model: directory
			}, options)));				
		});
	},

	showVolumeInfoDialog: function(volume, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/volume-info-dialog-view.js'
		).then((VolumeInfoDialogView) => {

			// show directory info dialog
			//
			this.show(new VolumeInfoDialogView.default(_.extend({
				model: volume
			}, options)));				
		});
	}
};