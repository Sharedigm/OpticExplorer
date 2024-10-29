/******************************************************************************\
|                                                                              |
|                                file-movable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for moving items.                 |
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
	// file moving methods
	//

	moveItem: function(item, directory, options) {

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

			// check if moving to current directory
			//
			let source = FileUtils.getDirectoryPath(item.get('path'));
			if (source != (directory.get('path') || '')) {

				// get dest path
				//
				let name = FileUtils.getItemName(item.get('path'));
				let uniqueName = directory.getUniqueName(name);
				let dest = directory.has('path')? directory.get('path') + uniqueName : uniqueName;

				// check if we are moving or transfering the file
				//
				if ((!item.hasBeenShared() && !directory.hasBeenShared()) || item.isOwned()) {

					// move item to dest path
					//				
					item.moveTo(dest, {

						// callbacks
						//
						success: (model) => {

							// update source and target directories
							//
							item.collection.remove(item);
							directory.add(model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								message: "Could not move item.",
								response: response
							});
						}
					});
				} else {

					// transfer item to dest path / user
					//				
					item.transferTo(dest, directory, {

						// callbacks
						//
						success: (model) => {

							// update source and target directories
							//
							item.collection.remove(item);
							directory.add(model, options);
						},

						error: (model, response) => {

							// show error message
							//
							application.error({
								message: "Could not transfer item.",
								response: response
							});
						}
					});
				}
			} else {

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		} else {
			
			// load directory contents
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.moveItem(item, model, options);
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

	moveItems: function(items, directory, options) {
		let count = items.length;
		let movedItems = [];

		function moveItem(movable, item) {
			movable.moveItem(item, directory, {

				// callbacks
				//
				success: (model) => {
					if (model) {
						movedItems.push(model);
					}

					// update directory
					//
					if (movedItems.length == count) {
						// directory.trigger('change');

						// perform callback
						//
						if (options && options.success) {
							options.success(movedItems);
						}
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Cound not move items.",
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

		// return if items to be moved contains target directory
		// 
		if (items.contains(directory)) {
			return;
		}

		if (directory.loaded) {

			// transfer items to directory
			//
			for (let i = 0; i < items.length; i++) {
				moveItem(this, items[i]);
			}
		} else {

			// load directory contents
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.moveItems(items, model, options);
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
	}
};