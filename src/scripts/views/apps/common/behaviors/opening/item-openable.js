/******************************************************************************\
|                                                                              |
|                               item-openable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of an app launching behavior.                     |
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
import Volume from '../../../../../models/storage/directories/volume.js';
import ArchiveFile from '../../../../../models/storage/files/archive-file.js';
import Items from '../../../../../collections/storage/items.js';

export default {

	//
	// getting methods
	//

	getCompatibleItems: function(items, extensions) {
		let compatibleItems = [];

		// get items compatible with selected app
		//
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.getFileExtension) {
				let extension = item.getFileExtension();
				if (extensions.contains(extension)) {
					compatibleItems.push(item);
				}
			}
		}

		return compatibleItems;
	},

	//
	// file opening methods
	//

	openFile: function(item, options) {
		let extension = item.getFileExtension();
		let appName = application.settings.associations.get(extension);
		this.openFileWith(appName, item, options);
	},

	openFileWith: function(appName, item, options) {
		if (appName) {

			// open item
			//
			application.launch(appName, {
				model: item
			}, options);
		} else {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-file"></i>',
				title: "Notice",
				message: "Can not open this type of file."
			});

			// perform callback
			//
			if (options && options.error) {
				options.error();
			}	
		}
	},

	openFiles: function(items, options) {
		let extension = items[0].getFileExtension();
		let appName = application.settings.associations.get(extension);
		this.openFilesWith(appName, items, options);
	},

	openFilesWith: function(appName, items, options) {
		if (appName) {
			let extensions = application.settings.associations.getFileExtensions(appName);

			// select only compatible items
			//
			if (!options || !options.all) {
				items = this.getCompatibleItems(items, extensions);
			}

			// show app
			//
			if (items.length == 1) {

				// open one item
				//
				application.launch(appName, {
					model: items[0],
				}, options);
			} else {
				let collection = new Items();
				for (let i = 0; i < items.length; i++) {
					collection.add(items[i], {
						at: i
					});
				}

				// open multiple items
				//
				application.launch(appName, {
					model: items[0],
					collection: collection
				}, options);
			}
		} else {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-file"></i>',
				title: "Notice",
				message: "Can not open this type of file."
			});

			// perform callback
			//
			if (options && options.error) {
				options.error();
			}
		}
	},

	/*
	openFilesWith: function(appName, items, options) {
		if (appName) {
			let extensions = application.settings.associations.getFileExtensions(appName);

			// select only compatible items
			//
			if (!options || !options.all) {
				items = this.getCompatibleItems(items, extensions);
			}

			// show app
			//
			if (items.length == 1) {

				// open one item
				//
				application.launch(appName, {
					model: items[0],
				}, options);
			} else {
				let collection = new Items();
				for (let i = 0; i < items.length; i++) {
					collection.add(items[i], {
						at: i
					});
				}

				// open multiple items
				//
				application.launch(appName, {
					model: items[0],
					collection: collection
				}, options);
			}
		} else {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-file"></i>',
				title: "Notice",
				message: "Can not open this type of file."
			});

			// perform callback
			//
			if (options && options.error) {
				options.error();
			}
		}
	},
	*/

	//
	// directory opening methods
	//

	openDirectory: function(directory, options) {

		// launch file browser app
		//
		application.launch('file_browser', {
			model: directory,
			favorites: options? options.favorites : undefined,
			preferences: options? options.preferences : undefined,
			selected: options? options.selected : undefined,
			parent: this
		}, null, options);
	},

	openDirectories: function(directories, options) {
		for (let i = 0; i < directories.length; i++) {
			let directory = directories[i];
			if (directory instanceof Directory) {
				this.openDirectory(directory, options);
			} 
		}
	},

	//
	// item opening methods
	//

	openItem: function(item, options) {
		if (item instanceof Directory) {

			// open directory
			//
			this.openDirectory(item, options);
		} else if (item instanceof File) {

			// open file
			//
			this.openFile(item, options);
		} else {

			// open model
			//
			this.openModel(item, options);
		}
	},

	openItems: function(items, options) {
		if (items[0] instanceof Directory) {

			// open directories
			//
			this.openDirectories(items, options);
		} else if (items[0] instanceof File) {

			// open files
			//
			this.openFiles(items, options);
		} else {

			// open model
			//
			this.openModels(items, options);
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {			
		if (item.model instanceof Directory || item.model instanceof Volume) {

			// start loading spinner
			//
			item.startLoading();

			// open folder
			//
			this.openDirectory(item.model, {

				// callbacks
				//
				success: () => {

					// stop loading spinner
					//
					item.stopLoading();
				},

				error: () => {

					// stop loading spinner
					//
					item.stopLoading();						
				}
			});
		} else if (item.model instanceof ArchiveFile) {

			// expand / uncompress archive file
			//
			this.expandFile(item.model);
		} else if (this.options.onopen) {

			// open items using callback
			//
			this.options.onopen([item.model]);
		} else {
			let selected = this.getSelectedModels();
			let items = [];

			// start loading spinner
			//
			item.startLoading();

			// add selected items to items to open
			//
			for (let i = 0; i < selected.length; i++) {
				if (selected[i] != item.model) {
					items.push(selected[i]);
				}
			}
			items.push(item.model);

			// open items using appropriate application
			//
			this.openItems(items, {
				open_folders_in_new_window: !this.isDesktop || this.isDesktop(),
				open_folders_in_new_tab: items.length > 1,

				// callbacks
				//
				success: () => {

					// stop loading spinner
					//
					item.stopLoading();
				},

				error: () => {

					// stop loading spinner
					//
					item.stopLoading();			
				}
			});
		}
	}
};