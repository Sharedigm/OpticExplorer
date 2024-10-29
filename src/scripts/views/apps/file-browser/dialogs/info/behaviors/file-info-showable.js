/******************************************************************************\
|                                                                              |
|                             file-info-showable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing file item information.            |
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

	showFileInfoDialog: function(file, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js'
		).then((FileInfoDialogView) => {

			// show file info dialog
			//
			this.show(new FileInfoDialogView.default(_.extend({
				model: file
			}, options)));				
		});		
	},

	showAudioFileInfoDialog: function(audioFile, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/audio-file-info-dialog-view.js'
		).then((AudioFileInfoDialogView) => {

			// show audio file info dialog
			//
			this.show(new AudioFileInfoDialogView.default(_.extend({
				model: audioFile
			}, options)));				
		});		
	},

	showImageFileInfoDialog: function(imageFile, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/image-file-info-dialog-view.js'
		).then((ImageFileInfoDialogView) => {

			// show image file info dialog
			//
			this.show(new ImageFileInfoDialogView.default(_.extend({
				model: imageFile
			}, options)));				
		});		
	},

	showVideoFileInfoDialog: function(videoFile, options) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/info/video-file-info-dialog-view.js'
		).then((VideoFileInfoDialogView) => {

			// show video file info dialog
			//
			this.show(new VideoFileInfoDialogView.default(_.extend({
				model: videoFile
			}, options)));				
		});		
	}
};