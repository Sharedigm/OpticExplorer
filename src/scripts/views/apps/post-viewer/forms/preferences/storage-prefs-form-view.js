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
		
		<div class="storage-directory form-group">
			<label class="control-label"><i class="fa fa-folder"></i>Storage Folder</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="name"><%= storage_directory %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Storage Folder" data-content="This is the directory to use when storing files."></i>
			</div>
		</div>
	`),

	events: {
		'click .uploads-directory button.change': 'onClickChangeUploadsDirectory',
		'click .uploads-directory button.clear': 'onClickClearUploadsDirectory',
		'change .copy-attachments input': 'onChangeCopyAttachments',
		'click .storage-directory button.change': 'onClickChangeStorageDirectory',
		'click .storage-directory button.clear': 'onClickClearStorageDirectory'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'uploads_directory':
				return this.$el.find('.uploads-directory .name').text();
			case 'copy_attachments':
				return this.$el.find('.copy-attachments input').is(':checked');
			case 'storage_directory':
				return this.$el.find('.storage-directory .name').text();
		}
	},

	getValues: function() {
		return {
			uploads_directory: this.getValue('uploads_directory'),
			copy_attachments: this.getValue('copy_attachments'),
			storage_directory: this.getValue('storage_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'uploads_directory':
				this.$el.find('.uploads-directory .name').text(value);
				break;
			case 'copy_attachments':
				this.$el.find('.copy-attachments input').prop('checked', value);
				break;
			case 'storage_directory':
				this.$el.find('.storage-directory .name').text(value);
				break;
		}
	},

	setUploadsDirectory: function() {
		let directory = this.model.get('uploads_directory');
		let dirname = FileUtils.default.getDirectoryName(directory);

		// load uploads directory
		//
		new Directory.default({
			path: FileUtils.default.getDirectoryPath(directory)
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from directory's parent
				//
				this.showSelectUploadsDialog(model, {
					selected: model.getItemNamed(dirname)
				});
			},

			error: () => {

				// select from home directory
				//
				this.showSelectUploadsDialog(application.getDirectory());
			}
		});
	},
	
	setStorageDirectory: function() {
		let directory = this.model.get('storage_directory');
		let dirname = FileUtils.default.getDirectoryName(directory);

		// load storage directory
		//
		new Directory.default({
			path: FileUtils.default.getDirectoryPath(directory)
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from directory's parent
				//
				this.showSelectStorageDialog(model, {
					selected: model.getItemNamed(dirname)
				});
			},

			error: () => {

				// select from home directory
				//
				this.showSelectStorageDialog(application.getDirectory());
			}
		});
	},

	//
	// dialog rendering methods
	//

	showSelectUploadsDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select uploads dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: "Select Uploads Directory",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {
					if (items.length > 0) {
						this.setValue('uploads_directory', items[0].get('path'));
					}
				}
			}));
		});
	},

	showSelectStorageDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select home dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: "Select Storage Directory",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {
					if (items.length > 0) {
						this.setValue('storage_directory', items[0].get('path'));
					}
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickChangeUploadsDirectory: function() {
		this.setUploadsDirectory();
	},

	onClickClearUploadsDirectory: function() {
		this.setValue('uploads_directory', '/');
	},

	onChangeCopyAttachments: function() {
		this.onChangeValue('copy_attachments', this.getValue('copy_attachments'));
	},

	onClickChangeStorageDirectory: function() {
		this.setStorageDirectory();
	},

	onClickClearStorageDirectory: function() {
		this.setValue('storage_directory', '/');
	}
});