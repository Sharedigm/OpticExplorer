/******************************************************************************\
|                                                                              |
|                             cut-and-pastable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a file system behavior for cutting, copying and          |
|        pasting items.                                                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileCopyable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-copyable.js';

export default _.extend({}, FileCopyable, {

	//
	// cut and paste methods
	//

	cut: function(items, options) {
		if (items.length > 0) {
			this.clearClipboard({
				confirm: options && options.confirm != undefined? options.confirm : true,

				// callbacks
				//
				success: () => {
					this.moveItemsToClipboard(items, {

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
								message: "Could not move items to clipboard.",
								response: response
							});
						}
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

	paste: function(options) {

		// fetch clipboard directory
		//
		application.getDirectory().fetchDirectory(this.clipboardDirectoryName, {

			// callbacks
			//
			success: (model) => {

				// check if clipboard is empty
				//
				if (!model.isEmpty()) {
					let names = model.contents.getNames().remove('.Thumbs');

					// check for duplicates
					//
					if (this.model.hasAnItemNamed(names) && (options && options.replace)) {
						application.confirm({
							message: "This folder already contains one or more items with the same name as items in the clipboard.  Do you want to continue?",

							// callbacks
							//
							accept: () => {
								this.paste(_.extend({}, options, {
									replace: true
								}));
							}
						});
						return;
					}

					this.copyContents(model, this.model, _.extend({}, options, {
						replace: false,

						// callbacks
						//
						success: (items) => {

							// deselect previously selected items
							//
							let selected = this.getSelected();
							for (let i = 0; i < selected.length; i++) {
								selected[i].deselect();
							}

							// select newly pasted items
							//
							for (let i = 0; i < items.length; i++) {
								items[i].trigger('select');
							}

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
								message: "Could not copy contents of clipboard.",
								response: response
							});
						}
					}));
				} else {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-paste"></i>',
						title: "Paste",
						message: "No items to paste."
					});
				}
			}
		});
	},

	duplicate: function(items, options) {
		if (items.length > 0) {
					
			// create copy of items
			//
			this.duplicateItems(items, _.extend(options || {}, {

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
						message: "Could not duplicate items.",
						response: response
					});
				}
			}));
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

	//
	// move to clipboard methods
	//

	moveItemToClipboard: function(item, options) {

		// fetch clipboard directory
		//
		this.fetchClipboardDirectory({

			// callbacks
			//
			success: (model) => {

				// perform move
				//
				this.moveItem(item, model, options);
			},

			error: () => {
				if (this.implicitCreateClipboardDirectory) {

					// create new clipboard directory
					//
					application.getDirectory().createDirectory(this.clipboardDirectoryName, {

						// callbacks
						//
						success: (model) => {

							// perform move
							//
							this.moveItem(item, model, options);
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
						icon: '<i class="fa fa-clipboard"></i>',
						title: "Not Found",	
						message: "Could not find " + this.clipboardDirectoryName + " directory."
					});
				}
			}
		});
	},

	moveItemsToClipboard: function(items, options) {

		// fetch clipboard directory
		//
		this.fetchClipboardDirectory({

			// callbacks
			//
			success: (model) => {

				// perform move
				//
				this.moveItems(items, model, options);
			},

			error: () => {
				if (this.implicitCreateClipboardDirectory) {

					// create new clipboard directory
					//
					application.getDirectory().createDirectory(this.clipboardDirectoryName, {

						// callbacks
						//
						success: (model) => {

							// perform move
							//
							this.moveItems(items, model, options);
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
						icon: '<i class="fa fa-clipboard"></i>',
						title: "Not Found",	
						message: "Could not find " + this.clipboardDirectoryName + " directory."
					});
				}
			}
		});
	}
});