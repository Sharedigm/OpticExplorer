/******************************************************************************\
|                                                                              |
|                               file-copyable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for copying items.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileUtils from '../../../../../utilities/files/file-utils.js';

export default {

	//
	// clipboard attributes
	//

	clipboardDirectoryName: '.Clipboard',
	implicitCreateClipboardDirectory: true,

	//
	// querying methods
	//

	isClipboardEmpty: function() {
		return !this.hasClipboardDirectory() || this.getClipboardDirectory().isEmpty();
	},

	isClipboardDirectory: function(item) {
		return FileUtils.getItemName(item.get('path')) == this.clipboardDirectoryName;
	},

	isInClipboardDirectory: function(item) {
		return FileUtils.getDirectoryName(item.get('path')) == this.clipboardDirectoryName;
	},

	hasClipboardDirectory: function() {
		return application.hasDirectory(this.clipboardDirectoryName + '/');
	},

	//
	// getting methods
	//

	getClipboardDirectory: function() {
		return application.getDirectory(this.clipboardDirectoryName + '/');
	},

	//
	// file copying methods
	//

	copy: function(items, options) {
		
		// check if there are items to copy
		//
		if (items.length > 0) {	

			// clear existing items first
			//			
			this.clearClipboard({
				confirm: options && options.confirm != undefined? options.confirm : true,

				// callbacks
				//
				success: () => {
					this.copyItemsToClipboard(items, {

						// callback
						//
						success: (items) => {
			
							// perform callback
							//
							if (options && options.success) {
								options.success(items);
							}
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								message: "Could not copy items to clipboard.",
								response: response
							});
						}
					});
				},

				error: (response) => {

					// show error message
					//
					application.error({
						message: "Could not clear clipboard.",
						response: response
					});
				}
			});
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-mouse-pointer"></i>',
				title: "Select",
				message: "No items selected."
			});
		}
	},

	copyItem: function(item, directory, options) {

		// check that there is something to do
		//
		if (!item) {

			// perform callback if no items
			//
			if (options && options.success) {
				options.success();
			}

			return;
		}

		if (directory.loaded) {

			// get item name
			//
			let name = FileUtils.getItemName(item.get('path'));

			// make sure name is unique, if necessary
			//
			if (!options || !options.replace) {
				name = directory.getCopyName(name);
			}
			
			// compose dest path
			//
			let dest = directory.has('path')? directory.get('path') + name : name;

			// check if we are copying or duplicating the file
			//
			if (!item.hasBeenShared() && !directory.hasBeenShared() &&
				!item.isPublic() && !directory.isPublic()) {

				// copy item to dest path
				//
				item.copyTo(dest, {
					replace: options? options.replace : false,

					// callbacks
					//
					success: (model) => {
						
						// remove exiting directory entry, if necessary
						//
						if (options && options.replace) {
							if (directory.contains(name)) {
								directory.removeItem(name);
							}
						}

						// update directory
						//
						directory.addItem(model);

						// perform callback
						//
						if (options && options.success) {
							options.success(model);
						}
					},

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not copy item.",
							response: response
						});
					}
				});
			} else {

				// duplicate item to dest path / user
				//
				item.duplicateTo(dest, directory, {

					// callbacks
					//
					success: (model) => {
						
						// update directory
						//
						directory.add(model);
						// model.trigger('select');

						// perform callback
						//
						if (options && options.success) {
							options.success(model);
						}
					},

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not duplicate item.",
							response: response
						});
					}
				});
			}
		} else {

			// load directory contents
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.copyItem(item, model, options);
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not load directory contents.",
						response: response
					});
				}
			});
		}
	},

	copyItems: function(items, directory, options) {
		let copiedItems = [];

		function copyItem(item, copyable) {
			copyable.copyItem(item, directory, {
				replace: options? options.replace : undefined,

				// callbacks
				//
				success: (model) => {
					copiedItems.push(model);

					// update directory
					//
					if (copiedItems.length == items.length) {
						// directory.trigger('change');

						// perform callback
						//
						if (options && options.success) {
							options.success(copiedItems);
						}
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not copy items.",
						response: response
					});
				}
			});
		}

		// check that there is something to do
		//
		if (!items || items.length == 0) {

			// perform callback if no items
			//
			if (options && options.success) {
				options.success();
			}

			return;
		}

		if (directory.loaded) {

			// transfer items to directory
			//
			for (let i = 0; i < items.length; i++) {
				copyItem(items[i], this);
			}
		} else {

			// load directory contents
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.copyItems(items, model, options);
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not load directory contents.",
						response: response
					});
				}
			});
		}
	},

	duplicateItems: function(items, options) {
		this.copyItems(items, this.model, options);
	},

	copyContents: function(directory, destDirectory, options) {
		if (directory.loaded) {

			// skip thumbnail directories
			//
			let items = directory.contents.toArray().filter((item) => {
				return item.getName() != '.Thumbs';
			});

			// copy directory contents
			//
			this.copyItems(items, destDirectory, options);
		} else {

			// load directory contents
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.copyContents(model, destDirectory, options);
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not load directory contents.",
						response: response
					});
				}
			});
		}
	},

	//
	// copy to clipboard methods
	//

	copyItemToClipboard: function(item, options) {

		// fetch clipboard directory
		//
		this.fetchClipboardDirectory({

			// callbacks
			//
			success: (model) => {

				// perform copy
				//
				this.copyItem(item, model, options);
			},

			error: () => {
				if (this.implicitCreateClipboardDirectory) {

					// create new clipboard directory
					//
					this.createClipboardDirectory({
						permissions: application.getDirectory().has('link')? '777' : '755',

						// callbacks
						//
						success: (model) => {

							// perform copy
							//
							this.copyItem(item, model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								message: "Could not create clipboard directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-copy"></i>',
						title: "Not Found",	
						message: "Could not find " + this.clipboardDirectoryName + " directory."
					});		
				}
			}
		});
	},

	copyItemsToClipboard: function(items, options) {

		// fetch clipboard directory
		//
		this.fetchClipboardDirectory({

			// callbacks
			//
			success: (clipboard) => {

				// perform copy
				//
				this.copyItems(items, clipboard, options);
			},

			error: () => {
				if (this.implicitCreateClipboardDirectory) {
					let homeDirectory = application.getDirectory();

					// create new clipboard directory
					//
					homeDirectory.createDirectory(this.clipboardDirectoryName, {
						permissions: homeDirectory.has('link')? '777' : '755',

						// callbacks
						//
						success: (model) => {

							// perform copy
							//
							this.copyItems(items, model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								message: "Could not create new clipboard directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-copy"></i>',
						title: "Not Found",	
						message: "Could not find " + this.clipboardDirectoryName + " directory."
					});		
				}
			}
		});
	},

	//
	// clipboard methods
	//

	createClipboardDirectory: function(options) {
		application.getDirectory().createDirectory(this.clipboardDirectoryName, options);
	},

	fetchClipboardDirectory: function(options) {
		application.getDirectory().fetchDirectory(this.clipboardDirectoryName, options);
	},

	clearClipboard: function(options) {

		// fetch clipboard directory
		//
		this.fetchClipboardDirectory({

			// callbacks
			//
			success: (model) => {
				if (options && options.confirm && !model.isEmpty()) {

					// show confirmation
					//
					import(
						'../../../../../views/apps/file-browser/dialogs/files/clipboard-confirm-dialog-view.js'
					).then((ClipboardConfirmDialogView) => {
						application.show(new ClipboardConfirmDialogView.default({
							model: model,

							// callbacks
							//
							replace: function() {

								// perform clear
								//
								model.clear(options);		
							},

							merge: function() {

								// perform callback
								//
								if (options && options.success) {
									options.success();
								}	
							}
						}));
					});
				} else {

					// perform clear
					//
					model.clear(options);
				}
			},

			error: () => {
				if (this.implicitCreateClipboardDirectory) {

					// create new clipboard directory
					//
					this.createClipboardDirectory({
						permissions: application.getDirectory().has('link')? '777' : '755',

						// callbacks
						//
						success: (model) => {

							// perform clear
							//
							model.clear(options);
						},

						error: (model, response) => {

							// show error
							//
							application.error({
								message: "Could not create new clipboard directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-copy"></i>',
						title: "Not Found",	
						message: "Could not find " + this.clipboardDirectoryName + " directory."
					});	
				}
			}
		});
	}
};