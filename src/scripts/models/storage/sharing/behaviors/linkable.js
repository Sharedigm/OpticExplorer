/******************************************************************************\
|                                                                              |
|                                  linkable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a linkable behavior mixin for file system items.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// fetching methods
	//

	createLink: function(attributes, options) {
		import(
			'../../../../models/storage/sharing/link.js'
		).then((Link) => {

			// create new link to directory
			//
			new Link.default(_.extend({
				path: this.get('path')
			}, attributes)).save(undefined, _.extend({}, options, {

				// callbacks
				//
				success: (model) => {

					// increment link count
					//
					this.set({
						num_links: this.get('num_links') + 1
					});

					// perform callback
					//
					if (options && options.success) {
						options.success(model);
					}
				},
			}));
		});
	},

	fetchLinks: function(options) {
		import(
			'../../../../collections/storage/sharing/links.js'
		).then((Links) => {

			// fetch existing links to directory
			//
			new Links.default().fetchByItem(this, {

				// callbacks
				//
				success: (collection) => {

					// set link targets
					//
					for (let i = 0; i < collection.length; i++) {
						collection.at(i).set({
							target: this
						});
					}

					// perform callback
					//
					if (options && options.success) {
						options.success(collection);
					}
				}
			});
		});
	},

	deleteLinks: function(links, options) {
		import(
			'../../../../collections/storage/sharing/links.js'
		).then((Links) => {
			let count = links.length;

			// destroy links to item
			//
			new Links.default(links).destroy({

				// callbacks
				//
				success: (collection) => {

					// decrement link count
					//
					this.set({
						num_links: this.get('num_links') - count
					});

					// perform callback
					//
					if (options && options.success) {
						options.success(collection);
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
		});
	},

	//
	// rendering methods
	//

	showLinks: function() {
		Promise.all([
			import('../../../../models/storage/directories/directory.js'),
			import('../../../../models/storage/media/image-file.js'),
			import('../../../../models/storage/files/file.js')
		]).then(([Directory, ImageFile, File]) => {
			this.fetchLinks({

				// callbacks
				//
				success: (collection) => {
					if (this instanceof Directory.default) {
						this.showDirectoryLinkInfoDialogView(collection);
					} else if (this instanceof ImageFile.default) {
						this.showImageFileLinkInfoDialogView(collection);
					} else if (this instanceof File.default) {
						this.showFileLinkInfoDialogView(collection);				
					}
				}
			});
		});
	},

	//
	// dialog rendering methods
	//

	showDirectoryLinkInfoDialogView: function(collection) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/directory-info-dialog-view.js'
		).then((DirectoryInfoDialogView) => {

			// show directory info dialog
			//
			application.show(new DirectoryInfoDialogView.default({
				model: this,
				links: collection,
				tab: 'links'
			}));
		});
	},

	showFileLinkInfoDialogView: function(collection) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js'
		).then((FileInfoDialogView) => {

			// show file info dialog
			//
			application.show(new FileInfoDialogView.default({
				model: this,
				links: collection,
				tab: 'links'
			}));
		});
	},

	showImageFileLinkInfoDialogView: function(collection) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/image-file-info-dialog-view.js'
		).then((ImageFileInfoDialogView) => {

			// show image file info dialog
			//
			application.show(new ImageFileInfoDialogView.default({
				model: this,
				links: collection,
				tab: 'links'
			}));
		});
	}
};