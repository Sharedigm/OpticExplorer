/******************************************************************************\
|                                                                              |
|                               text-editor-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing text files.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import AppView from '../../../views/apps/common/app-view.js';
import FindReplaceable from '../../../views/apps/common/behaviors/finding/find-replaceable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import HeaderBarView from '../../../views/apps/text-editor/header-bar/header-bar-view.js';
import EditableTextView from '../../../views/apps/text-editor/mainbar/editable-text-view.js';
import FooterBarView from '../../../views/apps/text-editor/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/text-editor/forms/preferences/preferences-form-view.js'
import FileUtils from '../../../utilities/files/file-utils.js';

export default AppView.extend(_.extend({}, FindReplaceable, ItemShareable, {

	//
	// attributes
	//

	name: 'text_editor',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.model) {
			this.model = new File();
		}
	},

	//
	// attribute methods
	//

	title: function() {
		return this.model? this.getNewFileName(): config.apps[this.name].name;
	},

	extensions: function() {
		return application.settings.associations.getFileExtensions('text_editor');
	},
	
	//
	// querying methods
	//

	isDirty: function() {
		return this.hasChildView('contents') && this.getChildView('contents').changed;
	},
	
	hasSelected: function() {
		if (this.hasChildView('contents')) {
			return this.getChildView('contents').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('contents').getSelected();
	},

	getFileName: function() {
		if (this.model.isNew()) {

			// new file name
			//
			return File.defaultName + '.txt';
		} else {

			// get file name from path
			//
			let path = this.model.get('path');
			if (FileUtils.isDirectoryPath(path)) {
				path = FileUtils.getFilePath(path);
			}

			return FileUtils.getFileName(path);
		}
	},

	getHomeDirectory: function() {
		if (this.model && this.model.parent) {

			// use file's directory
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getNewFileName: function() {
		return this.model.getName() || this.constructor.defaultName;
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.getChildView('contents').select(which);
	},

	selectRange: function() {
		let lineNumber = this.getChildView('contents').getLineNumber();
		let numLines = this.getChildView('contents').numLines();

		import(
			'../../../views/apps/common/dialogs/selection/select-range-dialog-view.js'
		).then((SelectRangeDialogView) => {

			// show select range dialog
			//
			application.show(new SelectRangeDialogView.default({
				start: lineNumber != numLines? lineNumber : undefined,
				end: lineNumber == numLines? lineNumber : undefined,

				// callbacks
				//
				accept: (start, end) => {
					if (!start) {
						start = 1;
					}
					if (!end) {
						end = numLines;
					}
					this.getChildView('contents contents').selectRange(start, end);
				}
			}));
		});
	},

	deselect: function() {
		this.getChildView('contents').deselect();
	},

	//
	// creating methods
	//

	newFile: function() {

		// close current file
		//
		this.closeFile(() => {

			// set dialog title
			//
			this.setTitle(this.constructor.defaultName);

			// open new file
			//
			this.loadFile(new File());
		});
	},

	//
	// opening methods
	//

	openFile: function() {

		// close current file
		//
		this.closeFile(() => {

			// open new file
			//
			this.showOpenDialog();
		});
	},

	openItems: function(items) {

		// find first item that is a file
		//
		let index = items.length - 1;
		let item = items[index];
		let found = item instanceof File;
		while (!found && index > 0) {
			index--;
			item = items[index];
			found = item instanceof File;
		}

		if (found) {
			this.openItem(item);
		}
	},
	
	openItem: function(item, options) {

		// set attributes
		//
		this.model = item;

		// load item
		//
		this.loadFile(this.model, options);
	},

	loadFile: function(model, options) {

		// set attributes
		//
		if (model) {
			this.model = model;
		}

		// set dialog title
		//
		this.setTitle(this.model.getName());

		// read text file contents
		//
		if (!this.model.isNew()) {
			this.model.read({

				// callbacks
				//
				success: (data) => {
					this.getChildView('contents').set(data);

					// perform callback
					//
					if (options && options.success) {
						options.success(this.model);
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read text file.",
						response: response
					});
				}
			});
		} else {
			this.getChildView('contents').set(this.model.get('contents'));
		}

		this.onLoad();
	},

	//
	// saving methods
	//

	save: function(options) {
		this.model.update(this.getChildView('contents').get(), {

			// callbacks
			//
			success: () => {
				this.onSave(this.model);

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}, 

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save text file.",
					response: response
				});
			}
		});
	},

	saveNew: function(directory, filename, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(this.getChildView('contents').get(), {

					// callbacks
					//
					success: () => {
						this.setModel(model);
						this.onSave(model);

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					}, 

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not save text file.",
							response: response
						});
					}
				});
			}
		});
	},

	saveAs: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				filename: this.getFileName(),

				// callbacks
				//
				save: (directory, filename) => {

					// check for exiting item with name
					//
					if (directory.hasItemNamed(filename)) {

						// show confirm
						//
						application.confirm({
							title: "Overwrite File",
							message: "A file already exists with this name.  Would you like to overwrite it?",

							// callbacks
							//
							accept: () => {
								let item = directory.getItemNamed(filename);

								// update existing file
								//
								item.update(this.getChildView('contents').get(), {

									// callbacks
									//
									success: () => {
										this.setModel(item);
										this.onSave(item);

										// perform callback
										//
										if (options && options.success) {
											options.success();
										}
									}
								});
							}
						});
					} else {
						this.saveNew(directory, filename, {

							// callbacks
							//
							success: () => {

								// perform callback
								//
								if (options && options.success) {
									options.success();
								}
							}
						});
					}
				}
			}));
		});
	},

	//
	// closing methods
	//

	close: function() {

		// close current file
		//
		this.closeFile(() => {

			// close parent dialog
			//
			this.dialog.close();
		});
	},

	closeFile: function(done) {

		// check if changed
		//
		if (this.isDirty()) {

			// show prompt
			//
			application.prompt({
				icon: '<i class="fa fa-save"></i>',
				title: "Save File",
				message: "This file has been changed. Would you like to save it?",

				// callbacks
				//
				accept: () => {
					if (this.model.isNew()) {

						// save new file
						//
						this.saveAs({
							success: () => {

								// perform callback
								//
								if (done) {
									done();
								}					
							}
						});
					} else {

						// save existing file
						//
						this.save({
							success: () => {

								// perform callback
								//
								if (done) {
									done();
								}					
							}
						});
					}
				},

				decline: function() {

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		} else {

			// perform callback
			//
			if (done) {
				done();
			}
		}
	},

	//
	// editing methods
	//

	cut: function() {
		application.clipboard = this.getChildView('contents').cut();
	},

	copy: function() {
		application.clipboard = this.getChildView('contents').getSelected();
	},

	paste: function() {
		this.getChildView('contents').paste(application.clipboard);
	},

	delete: function() {
		this.getChildView('contents').cut();
	},

	//
	// finding / replacing methods
	//

	find: function(needle, options) {

		// find needle in text
		//
		return this.getChildView('contents').find(needle, options);
	},

	replace: function(replacement) {

		// replace selected text with replacement text
		//
		return this.getChildView('contents').replace(replacement);
	},

	findReplace: function(replacement, options) {

		// replace selected text with replacement and find next
		//
		return this.getChildView('contents').findReplace(replacement, options);
	},

	replaceAll: function(replacement, options) {

		// replace all occurances of selected text with replacement
		//
		return this.getChildView('contents').replaceAll(replacement, options);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppView.prototype.onRender.call(this);

		// show child views
		//
		this.showHeaderBar();
		this.showContents();
		this.showFooterBar();

		// load initial file
		//
		if (this.model) {
			this.loadFile(this.model, this.collection);
		}
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getContentsView: function() {
		return new EditableTextView({
			model: this.model,

			// options
			//
			preferences: this.preferences,

			// callbacks
			//
			onmouseup: () => this.onMouseUp(),
			onchange: () => this.onChange(),
			onselect: () => this.onSelect(),
			ondeselect: () => this.onDeselect()
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../views/apps/text-editor/dialogs/files/open-text-file-dialog-view.js'
		).then((OpenTextFileDialogView) => {

			// show open dialog
			//
			this.show(new OpenTextFileDialogView.default({
				model: this.getHomeDirectory(),

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},

	showInfoDialog: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js'
		).then((FileInfoDialogView) => {

			// show file info dialog
			//
			this.show(new FileInfoDialogView.default(_.extend({
				model: this.model
			}, options)));				
		});	
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/text-editor/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// show content info
		//
		this.getChildView('contents').changed = false;

		// call superclass method
		//
		AppView.prototype.onLoad.call(this);
	},

	//
	// mouse event handling methods
	//

	onMouseUp: function() {
		this.getChildView('footer status').showCursorInfo();
	},

	//
	// file event handling methods
	//

	onSave: function() {
		this.getChildView('contents').changed = false;
		this.getChildView('header menu').onSave();
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});