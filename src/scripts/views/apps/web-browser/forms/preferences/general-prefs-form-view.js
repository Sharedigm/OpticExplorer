/******************************************************************************\
|                                                                              |
|                          general-prefs-form-view.js                          |
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
		<div class="homepage form-group">
			<label class="control-label"><i class="fa fa-home"></i>Homepage</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= homepage %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Homepage" data-content="This is the web page initially loaded by the web browser."></i>
					</div>
				</div>
			</div>
		</div>
		
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
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Home Folder" data-content="This is the initial directory to use when opening files."></i>
			</div>
		</div>
	`),

	events: {
		'change .homepage input': 'onChangeHomepage',
		'click .home-directory button.change': 'onClickChangeHomeDirectory',
		'click .home-directory button.clear': 'onClickClearHomeDirectory'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'homepage':
				return this.$el.find('.homepage input').val();
			case 'home_directory':
				return this.$el.find('.home-directory .name').text();
		}
	},

	getValues: function() {
		return {
			homepage: this.getValue('homepage'),
			home_directory: this.getValue('home_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'homepage':
				this.$el.find('.homepage input').text(value);
				break;
			case 'home_directory':
				this.$el.find('.home-directory .name').text(value);
				break;
		}
	},

	setHomeDirectory: function() {
		let homeDirectory = this.model.get('home_directory');
		let homeDirname = FileUtils.getDirectoryName(homeDirectory);

		// load home directory
		//
		new Directory({
			path: FileUtils.getDirectoryPath(homeDirectory)
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from app's home directory's parent
				//
				this.showSelectHomeDialog(model, {
					selected: model.getItemNamed(homeDirname)
				});
			},

			error: () => {

				// select from home directory
				//
				this.showSelectHomeDialog(application.getDirectory());
			}
		});
	},

	//
	// dialog rendering methods
	//
	
	showSelectHomeDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: "Select Home Directory",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {
					if (items.length > 0) {
						this.setValue('home_directory', items[0].get('path'));
					}
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickChangeHomeDirectory: function() {
		this.setHomeDirectory();
	},

	onClickClearHomeDirectory: function() {
		this.setValue('home_directory', '/');
	}
});
