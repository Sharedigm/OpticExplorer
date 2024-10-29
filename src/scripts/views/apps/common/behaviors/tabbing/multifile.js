/******************************************************************************\
|                                                                              |
|                                 multifile.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app with tabs for multiple file views.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import Directory from '../../../../../models/storage/directories/directory.js';
import MultiDoc from '../../../../../views/apps/common/behaviors/tabbing/multidoc.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';
import Browser from '../../../../../utilities/web/browser.js';

export default _.extend({}, MultiDoc, {

	//
	// getting methods
	//

	getFileName: function() {
		let model = this.getModel();
		if (model.isNew()) {

			// new file name
			//
			return this.constructor.defaultName;
		} else {

			// get file name from path
			//
			let path = model.get('path');
			if (FileUtils.isDirectoryPath(path)) {
				path = FileUtils.getFilePath(path);
			}

			return FileUtils.getFileName(path);
		}
	},

	//
	// setting methods
	//

	setFile: function(model) {
		this.getActiveModel().set(model.attributes);
	},

	//
	// file opening methods
	//

	newFile: function() {

		// open new file
		//
		this.loadFile(new File());
	},

	openFile: function(file) {

		// check if file is already open
		//
		if (this.isAlreadyOpen(file)) {

			// activate existing tab
			//
			this.setActiveModel(file);

		// open file
		//
		} else {

			// load item
			//
			this.loadFile(file);
		}
	},

	openFiles: function(files, options) {
		for (let i = 0; i < files.length; i++) {
			this.openFile(files[i], options);
		}
	},

	openSelected: function() {
		this.openFiles(this.getSelectedModels());
	},

	//
	// directory opening nethods
	//

	openDirectory: function(directory, options) {
		application.launch('file_browser', {
			model: directory
		}, options);
	},

	//
	// item opening methods
	//

	openItem: function(item, options) {
		if (item instanceof Directory) {
			this.openDirectory(item, options);
		} else if (item instanceof File) {
			this.openFile(item, options);
		} else {
			this.openModel(item, options);
		}
	},

	openItems: function(items, options) {
		if (items.length == 1) {

			// open first item
			//
			this.openItem(items[0], options);
		} else {

			// open items
			//
			for (let i = 0; i < items.length; i++) {
				this.openItem(items[i], options);
			}
		}		
	},

	//
	// loading methods
	//

	loadFile: function(file) {

		// close help message
		//
		this.hideMessage();

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// set attributes
		//
		if (file) {
			this.model = file;
			this.directory = file.parent;
		}

		// add to currently open list of files
		//
		this.collection.add(file, {
			sort: false
		});
	},

	//
	// saving methods
	//

	save: function(options) {
		this.saveFile(this.getModel(), options);
	},

	saveFile: function(file, options) {
		file.update(this.getValue({
			file: file
		}), {

			// callbacks
			//
			success: (model) => {
				this.onSave(model);

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Could not save file.",
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
				model.write(this.getValue({
					file: model
				}), {

					// callbacks
					//
					success: () => {
						this.setFile(model);
						this.onSave(model);

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					},

					error: (response) => {

						// show error message
						//
						application.error({
							message: "Could not save file.",
							response: response
						});
					}
				});
			}
		});
	},

	saveAs: function(options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),

				// options
				//
				filename: this.getFileName(),
				extensions: options && options.extensions? options.extensions : null,

				// callbacks
				//
				save: (directory, filename) => {

					// check if file exists
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
								item.update(this.getValue({
									file: item
								}), {

									// callbacks
									//
									success: () => {
										this.setFile(item);
										this.onSave(item);

										// perform callback
										//
										if (options && options.success) {
											options.success();
										}
									},

									error: (response) => {

										// show error message
										//
										application.error({
											message: "Could not save file.",
											response: response
										});
									}
								});
							}
						});
					} else {
						this.saveNew(directory, filename, options);
					}
				}
			}));
		});
	},

	//
	// deleting methods
	//

	deleteFile: function(file, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to delete ' + file.getName() + '?',

				// callbacks
				//
				accept: () => {
					this.deleteFile(file, {
						confirm: false
					});
				}
			});
		} else {
			let index = this.collection.indexOf(file);

			// delete file
			//
			this.deleteItems([file], {

				// callbacks
				//
				success: () => {
					this.closeTab(index);

					// play delete sound
					//
					application.play('delete');

					// update menus
					//
					this.onChange();
				}
			});
		}
	},

	deleteActiveFile: function() {
		if (this.hasActiveModel()) {
			this.deleteFile(this.getActiveModel());
		}
	},

	//
	// closing methods
	//

	close: function() {

		// close current file, if one exists
		//
		if (this.hasActiveTabView()) {
			this.closeFile(() => {

				// close parent dialog
				//
				if (this.dialog) {
					this.dialog.close();
				}
			});
		} else {

			// close parent dialog
			//
			if (this.dialog) {
				this.dialog.close();
			}
		}
	},

	closeFile: function(done) {
		this.closeTab(this.getActiveIndex(), done);
	},

	closeTab: function(index, done) {
		if (index == undefined) {
			index = this.getActiveIndex();
		}

		// check if changed
		//
		if (this.getTabView(index).isDirty() && application.isSignedIn()) {

			// show prompt
			//
			application.prompt({

				// options
				//
				icon: '<i class="fa fa-save"></i>',
				title: "Save File",
				message: "This file has been changed. Would you like to save it?",

				// callbacks
				//
				accept: () => {
					let model = this.getPaneView(index).model;

					if (model.isNew()) {

						// save new file
						//
						this.saveAs({
							success: () => {
								this.removeModel(model);
								this.onCloseTab();

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
						this.saveFile(model, {
							success: () => {
								this.removeModel(model);
								this.onCloseTab();

								// perform callback
								//
								if (done) {
									done();
								}
							}
						});
					}
				},

				decline: () => {
					this.removeModel(this.getModelAt(index));
					this.onCloseTab();

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		} else {
			this.removeModel(this.getModelAt(index));
			this.onCloseTab();

			// perform callback
			//
			if (done) {
				done();
			}
		}
	},

	closeAll: function() {

		// close current item, if one exists
		//
		if (this.hasActiveTabView()) {
			this.closeTab(this.getActiveIndex(), () => {

				// close parent dialog
				//
				if (this.dialog) {
					this.dialog.close();
				}
			});
		}
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No files.", {
			icon: '<i class="far fa-file"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
	},

	//
	// event handling methods
	//

	onCloseTab: function() {

		// call superclass method
		//
		MultiDoc.onCloseTab.call(this);

		// show initial help message
		//
		if (!this.hasTabs()) {
			this.showHelpMessage();
		}
	}
});