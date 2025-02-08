/******************************************************************************\
|                                                                              |
|                              file-disposable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for disposing of items.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileMovable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-movable.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default _.extend({}, FileMovable, {

	//
	// trash attributes
	//

	trashDirectoryName: 'Trash',
	implicitCreateTrashDirectory: true,

	//
	// querying methods
	//

	isTrashEmpty: function() {
		return !this.hasTrashDirectory() || this.getTrashDirectory().isEmpty();
	},

	isTrashDirectory: function(item) {
		return FileUtils.getItemName(item.get('path')) == this.trashDirectoryName;
	},

	isInTrashDirectory: function(item) {
		return FileUtils.getDirectoryName(item.get('path')) == this.trashDirectoryName;
	},

	isShowingTrashDirectory: function() {
		return this.model && this.model.getName() == this.trashDirectoryName;
	},

	isRecyclable: function() {
		return !this.isShowingTrashDirectory() && application.isSignedIn();
	},

	hasTrashDirectory: function() {
		return application.hasDirectory(this.trashDirectoryName + '/');
	},
	
	//
	// getting methods
	//

	getDirectory: function(name) {
		let directory = application.getDirectory(name);
		if (this.model && this.model.has('link')) {
			directory.set('link', this.model.get('link'));
		}
		return directory;
	},

	getTrashDirectory: function() {
		return this.getDirectory(this.trashDirectoryName + '/');
	},

	//
	// file deleting methods
	//

	deleteItems: function(items, options) {

		// recycle items
		//
		if (this.isRecyclable()) {

			// move items to trash
			//
			this.disposeOfItems(items, _.extend({}, options, {

				// callback
				//
				success: () => {

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
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Delete Error',
						message: "Could not dispose of items.",
						response: response
					});
				}
			}));
		} else {

			// destroy (permanently delete) items
			//
			this.destroyItems(items, _.extend({}, options, {

				// callbacks
				//
				success: () => {

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
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Delete Error',
						message: "Could not destroy items.",
						response: response
					});
				}
			}));
		}
	},

	destroyItems: function(items, options) {
		let count = items.length;

		function destroyItem(item) {
			item.destroy({

				// callbacks
				//
				success: (model) => {

					// check if we are finished
					//
					count--;
					if (count == 0) {

						// perform callback
						//
						if (options && options.success) {
							options.success(model);
						}
					}
				},

				error: (model, response) => {

					// perform callback
					//
					if (options && options.error) {
						options.error(model, response);
					}
				}
			});
		}

		// destroy items individually
		//
		for (let i = 0; i < count; i++) {
			destroyItem(items[i]);
		}
	},

	//
	// trash methods
	//

	createTrashDirectory: function(options) {
		this.getDirectory().createDirectory(this.trashDirectoryName, options);
	},

	fetchTrashDirectory: function(options) {
		this.getDirectory().fetchDirectory(this.trashDirectoryName, options);
	},

	disposeOfItem: function(item, options) {

		// check if item is the trash or is in the trash
		//
		if (this.isTrashDirectory(item) || this.isInTrashDirectory(item) || item.hasShare()) {
			item.destroy(options);
			return;
		}

		// fetch trash directory
		//
		this.fetchTrashDirectory({

			// callbacks
			//
			success: (model) => {
				this.moveItem(item, model, options);
			},

			error: () => {
				if (this.implicitCreateTrashDirectory) {

					// create new trash directory
					//
					this.createTrashDirectory({

						// callbacks
						//
						success: (model) => {

							// perform dispose
							//
							this.moveItem(item, model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								icon: '<i class="fa fa-trash-alt"></i>',
								title: 'Delete Error',
								message: "Could not create new trash directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Delete Error',
						message: "Could not find " + this.trashDirectoryName + " directory."
					});
				}
			}
		});
	},

	disposeOfItems: function(items, options) {

		if (items.length == 1) {
			this.disposeOfItem(items[0], options);
			return;
		}

		// fetch trash directory
		//
		this.fetchTrashDirectory({

			// callbacks
			//
			success: (model) => {
				this.moveItems(items, model, options);
			},

			error: () => {
				if (this.implicitCreateTrashDirectory) {

					// create new trash directory
					//
					this.createTrashDirectory({

						// callbacks
						//
						success: (model) => {

							// perform dispose
							//
							this.moveItems(items, model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								icon: '<i class="fa fa-trash-alt"></i>',
								title: 'Delete Error',
								message: "Could not create new trash directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Delete Error',
						message: "Could not find " + this.trashDirectoryName + " directory."
					});
				}
			}
		});
	},

	emptyTrash: function(options) {

		// fetch trash directory
		//
		this.fetchTrashDirectory({

			// callbacks
			//
			success: (model) => {
				model.clear({

					// callbacks
					//
					success: () => {

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
							icon: '<i class="fa fa-trash-alt"></i>',
							title: 'Delete Error',
							message: "Could not clear trash directory.",
							response: response
						});
					}
				});
			},

			error: () => {
				if (this.implicitCreateTrashDirectory) {

					// create new trash directory
					//
					this.createTrashDirectory({

						// callbacks
						//
						success: () => {

							// perform empty
							//
							this.emptyTrash(options);
						},

						error: (model, response) => {

							// show error
							//
							application.error({
								icon: '<i class="fa fa-trash-alt"></i>',
								title: 'Delete Error',
								message: "Could not create new trash directory.",
								response: response
							});
						}
					});
				} else {

					// show alert message
					//
					application.alert({
						icon: '<i class="fa fa-trash-alt"></i>',
						title: 'Delete Error',
						message: "Could not find " + this.trashDirectoryName + " directory."
					});
				}
			}
		});
	}
});