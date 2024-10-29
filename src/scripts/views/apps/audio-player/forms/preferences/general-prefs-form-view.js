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
		<div class="default-volume form-group">
			<label class="control-label"><i class="fa fa-volume-up"></i>Default Volume</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Default Volume" data-content="This is the initial audio volume to use."></i>
				</div>
			</div>
		</div>
		
		<div class="looping form-group">
			<label class="control-label"><i class="fa fa-redo"></i>Looping</label>
			<div class="controls">
		
				<div class="track-looping checkbox-inline">
					<label><input type="checkbox"<% if (track_looping) { %> checked<% } %> />Track</label>
				</div>
		
				<div class="album-looping checkbox-inline">
					<label><input type="checkbox"<% if (album_looping) { %> checked<% } %> />Album</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Looping" data-content="This is whether or not to play the track or album in a repeating loop."></i>
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
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Home Folder" data-content="This is the initial folder to use when opening files."></i>
			</div>
		</div>
	`),

	regions: {
		volume: '.default-volume .range-input',
	},

	events: {
		'click .track-looping input[type="checkbox"]': 'onClickTrackLooping',
		'click .album-looping input[type="checkbox"]': 'onClickAlbumLooping',
		'click .home-directory button.change': 'onClickChangeHomeDirectory',
		'click .home-directory button.clear': 'onClickClearHomeDirectory'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'default_volume':
				return this.getChildView('volume').getValue();
			case 'track_looping':
				return this.$el.find('.track-looping input[type="checkbox"]').is(':checked');
			case 'album_looping':
				return this.$el.find('.album-looping input[type="checkbox"]').is(':checked');
			case 'home_directory':
				return this.$el.find('.home-directory .name').text();
		}
	},

	getValues: function() {
		return {
			volume: this.getValue('default_volume'),
			track_looping: this.getValue('track_looping'),
			album_looping: this.getValue('album_looping'),
			home_directory: this.getValue('home_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'default_value':
				this.getChildView('volume').setValue(value);
				break;
			case 'track_looping':
				this.$el.find('.track-looping input[type="checkbox"]').prop('checked', value);
				break;
			case 'album_looping':
				this.$el.find('.album-looping input[type="checkbox"]').prop('checked', value);
				break;
			case 'home_directory':
				this.$el.find('.home-directory .name').text(value);
				break;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'volume':
				this.showVolume();
				break;
		}
	},

	showVolume: function() {
		this.showChildView('volume', new RangeInputView({

			// options
			//
			value: this.model.get('volume'),
			min: 0,
			max: 11,
			step: 1,

			// callbacks
			//
			onchange: (value) => this.onChangeValue('volume', value)
		}));
	},

	//
	// dialog rendering methods
	//

	showSelectHomeDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select home dialog
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

	onClickTrackLooping: function() {
		this.onChangeValue('track_looping', this.getValue('track_looping'));
	},

	onClickAlbumLooping: function() {
		this.onChangeValue('album_looping', this.getValue('album_looping'));
	},

	onClickChangeHomeDirectory: function() {
		let homeDirectory = this.model.get('home_directory');
		let homeDirname = FileUtils.default.getDirectoryName(homeDirectory);

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

	onClickClearHomeDirectory: function() {
		this.setValue('home_directory', '/');
	}
});
