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
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="background-color form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Background</label>
			<div class="controls">
				
				<div class="checkbox-inline">
					<input type="checkbox"<% if (background_color) { %> checked<% } %> />
					<input type="color"<% if (background_color) { %> value="<%= background_color %>"<% } else { %> value="black"<% } %><% if (!background_color) { %> style="display:none"<% } %> />
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Background" data-content="This is the color used for the viewer background."></i>
			</div>
		</div>
		
		<div class="zoom-duration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Zoom Duration (ms)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Duration" data-content="This is how long to take when zooming a page in or out."></i>
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

	regions: {
		zoom_duration: '.zoom-duration .range-input'
	},

	events: {
		'click .background-color input[type="checkbox"]': 'onClickBackgroundColorCheckbox',
		'change .background-color input': 'onChangeBackgroundColor',
		'click .home-directory button.change': 'onClickChangeHomeDirectory',
		'click .home-directory button.clear': 'onClickClearHomeDirectory'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'use_custom_color':
				return this.$el.find('.background-color input[type="checkbox"]').is(':checked');
			case 'background_color':
				return this.getValue('use_custom_color')? this.$el.find('.background-color input[type="color"]').val() : undefined;
			case 'zoom_duration':
				return this.getChildView('zoom_duration').getValue();
			case 'home_directory':
				return this.$el.find('.home-directory .name').text();
		}
	},

	getValues: function() {
		return {
			background_color: this.getValue('background_color'),
			zoom_duration: this.getValue('zoom_duration'),
			home_directory: this.getValue('home_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'zoom_duration':
				this.getChildView('zoom_duration').setValue(value);
				break;
			case 'home_directory':
				this.$el.find('.home-directory .name').text(value);
				break;
		}
	},

	setHomeDirectory: function() {
		let homeDirectory = this.model.get('home_directory');
		let homeDirname = FileUtils.default.getDirectoryName(homeDirectory);

		// load home directory
		//
		new Directory.default({
			path: FileUtils.default.getDirectoryPath(homeDirectory)
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
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'zoom_duration':
				this.showZoomDuration();
				break;
		}
	},

	showZoomDuration: function() {
		this.showChildView('zoom_duration', new RangeInputView({

			// options
			//
			value: this.model.get('zoom_duration'),
			min: 0,
			max: 1000,
			step: 100
		}));
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

	onClickBackgroundColorCheckbox: function() {
		if (this.getValue('use_custom_color')) {
			this.$el.find('.background-color input[type="color"]').show();
		} else {
			this.$el.find('.background-color input[type="color"]').hide();
		}
		this.onChangeValue('background_color', this.getValue('use_custom_color')? this.getValue('background_color') : undefined);
	},

	onChangeBackgroundColor: function() {
		this.onChangeValue('background_color', this.getValue('background_color'));
	},

	onClickChangeHomeDirectory: function() {
		this.setHomeDirectory();
	},

	onClickClearHomeDirectory: function() {
		this.setValue('home_directory', '/');
	}
});
