/******************************************************************************\
|                                                                              |
|                          storage-prefs-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
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
import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="home-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Home Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= home_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Home Folder" data-content="This is the initial folder to use when opening map files."></i>
			</div>
		</div>
		
		<div class="photos-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Photos Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= photos_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Photos Folder" data-content="This is the initial folder to use when opening local photos."></i>
			</div>
		</div>
		
		<div class="videos-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Videos Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= videos_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Videos Folder" data-content="This is the initial folder to use when opening local videos."></i>
			</div>
		</div>
		
		<div class="uploads-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Uploads Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= uploads_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Uploads Folder" data-content="This is the directory to use when uploading files."></i>
			</div>
		</div>
		
		<div class="dropbox-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Dropbox Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= dropbox_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dropbox Folder" data-content="This is the directory to use when uploading files from Dropbox."></i>
			</div>
		</div>
		
		<div class="google-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Google Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= google_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Google Folder" data-content="This is the directory to use when uploading files from Google."></i>
			</div>
		</div>
	`),

	events: {
		'click .home-directory button.change': 'onClickChangeHomeDirectory',
		'click .home-directory button.clear': 'onClickClearHomeDirectory',
		'click .photos-directory button.change': 'onClickChangePhotosDirectory',
		'click .photos-directory button.clear': 'onClickClearPhotosDirectory',
		'click .videos-directory button.change': 'onClickChangeVideosDirectory',
		'click .videos-directory button.clear': 'onClickClearVideosDirectory',
		'click .uploads-directory button.change': 'onClickChangeUploadsDirectory',
		'click .uploads-directory button.clear': 'onClickClearUploadsDirectory',
		'click .dropbox-directory button.change': 'onClickChangeDropboxDirectory',
		'click .dropbox-directory button.clear': 'onClickClearDropboxDirectory',
		'click .google-directory button.change': 'onClickChangeGoogleDirectory',
		'click .google-directory button.clear': 'onClickClearGoogleDirectory',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'home_directory':
				return this.$el.find('.home-directory .name').text();
			case 'photos_directory':
				return this.$el.find('.photos-directory .name').text();
			case 'videos_directory':
				return this.$el.find('.videos-directory .name').text();
			case 'uploads_directory':
				return this.$el.find('.uploads-directory .name').text();
			case 'dropbox_directory':
				return this.$el.find('.dropbox-directory .name').text();
			case 'google_directory':
				return this.$el.find('.google-directory .name').text();
		}
	},

	getValues: function() {
		return {
			home_directory: this.getValue('home_directory'),
			photos_directory: this.getValue('photos_directory'),
			videos_directory: this.getValue('videos_directory'),
			uploads_directory: this.getValue('uploads_directory'),
			dropbox_directory: this.getValue('dropbox_directory'),
			google_directory: this.getValue('google_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'home_directory':
				this.$el.find('.home-directory .name').text(value);
				break;
			case 'photos_directory':
				this.$el.find('.photos-directory .name').text(value);
				break;
			case 'videos_directory':
				this.$el.find('.videos-directory .name').text(value);
				break;
			case 'uploads_directory':
				this.$el.find('.uploads-directory .name').text(value);
				break;
			case 'dropbox_directory':
				this.$el.find('.dropbox-directory .name').text(value);
				break;
			case 'google_directory':
				this.$el.find('.google-directory .name').text(value);
				break;
		}
	},

	//
	// dialog rendering methods
	//

	selectDirectory: function(name, options) {
		let directory = this.model.get(name);
		let dirname = FileUtils.getDirectoryName(directory);

		// load home directory
		//
		new Directory({
			path: FileUtils.getDirectoryPath(directory)
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from app's home directory's parent
				//
				this.showSelectDirectoryDialog(model, {
					title: options && options.title? options.title : 'Select Directory',
					name: name,
					selected: model.getItemNamed(dirname)
				});
			},

			error: () => {

				// select from home directory
				//
				this.showSelectDirectoryDialog(application.getDirectory(), {
					title: options && options.title? options.title : 'Select Directory',
					name: name
				});
			}
		});
	},

	showSelectDirectoryDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select home dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: options? options.title : "Select Directory",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {
					if (items.length > 0) {
						this.setValue(options && options.name? options.name : 'home_directory', items[0].get('path'));
					}
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickChangeHomeDirectory: function() {
		this.selectDirectory('home_directory', {
			title: "Select Home Directory"
		});
	},

	onClickClearHomeDirectory: function() {
		this.setValue('home_directory', '/');
	},

	onClickChangePhotosDirectory: function() {
		this.selectDirectory('photos_directory', {
			title: "Select Photos Directory"
		});
	},

	onClickClearPhotosDirectory: function() {
		this.setValue('photos_directory', '/');
	},

	onClickChangeVideosDirectory: function() {
		this.selectDirectory('videos_directory', {
			title: "Select Videos Directory"
		});
	},

	onClickClearVideosDirectory: function() {
		this.setValue('videos_directory', '/');
	},

	onClickChangeUploadsDirectory: function() {
		this.selectDirectory('uploads_directory', {
			title: "Select Uploads Directory"
		});
	},

	onClickClearUploadsDirectory: function() {
		this.setValue('uploads_directory', '/');
	},

	onClickChangeDropboxDirectory: function() {
		this.selectDirectory('dropbox_directory', {
			title: "Select Dropbox Directory"
		});
	},

	onClickClearDropboxDirectory: function() {
		this.setValue('dropbox_directory', '/');
	},

	onClickChangeGoogleDirectory: function() {
		this.selectDirectory('google_directory', {
			title: "Select Google Directory"
		});
	},

	onClickClearGoogleDirectory: function() {
		this.setValue('google_directory', '/');
	}
});
