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
		<div class="notation-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Notation Size (%)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Notation Size" data-content="This is the size of the musical notation."></i>
				</div>
			</div>
		</div>
		
		<div class="fit-width form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Fit Width</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (fit_width) { %> checked<% } %> />
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Fit Width" data-content="This is whether or not to rescale the tune to fit the available width."></i>
			</div>
		</div>
		
		<div class="tune-looping form-group">
			<label class="control-label"><i class="fa fa-redo"></i>Tune Looping</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<input type="checkbox"<% if (tune_looping) { %> checked<% } %> />
				</div>
				
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tune Looping" data-content="This is whether or not to play the tune in a repeating loop."></i>
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
		notation_size: '.notation-size .range-input',
		volume: '.default-volume .range-input',
	},

	events: {
		'click .fit-width input[type="checkbox"]': 'onClickFitWidth',
		'click .tune-looping input[type="checkbox"]': 'onClickTuneLooping',
		'click .home-directory button.change': 'onClickChangeHomeDirectory',
		'click .home-directory button.clear': 'onClickClearHomeDirectory'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'notation_size':
				return this.getChildView('notation_size').getValue();
			case 'fit_width':
				return this.$el.find('.fit-width input[type="checkbox"]').is(':checked');
			case 'tune_looping':
				return this.$el.find('.track-looping input[type="checkbox"]').is(':checked');
			case 'home_directory':
				return this.$el.find('.home-directory .name').text();
		}
	},

	getValues: function() {
		return {
			notation_size: this.getValue('notation_size'),
			fit_width: this.getValue('fit_width'),
			tune_looping: this.getValue('tune_looping'),
			home_directory: this.getValue('home_directory')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'notation_size':
				this.getChildView('notation_size').setValue(value);
				break;
			case 'fit_width':
				this.$el.find('.fit-width input[type="checkbox"]').prop('checked', value);
				break;
			case 'tune_looping':
				this.$el.find('.track-looping input[type="checkbox"]').prop('checked', value);
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
			case 'notation_size':
				this.showNotationSize();
				break;
		}
	},

	showNotationSize: function() {
		this.showChildView('notation_size', new RangeInputView({

			// options
			//
			value: this.model.get('notation_size'),
			min: 50,
			max: 150,
			step: 10,

			// callbacks
			//
			onchange: (value) => this.onChangeValue('notation_size', value)
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

	onClickFitWidth: function() {
		this.onChangeValue('fit_width', this.getValue('fit_width'));
	},

	onClickTuneLooping: function() {
		this.onChangeValue('tune_looping', this.getValue('tune_looping'));
	},

	onClickChangeHomeDirectory: function() {
		this.setHomeDirectory();
	},

	onClickClearHomeDirectory: function() {
		this.setValue('home_directory', '/');
	}
});
