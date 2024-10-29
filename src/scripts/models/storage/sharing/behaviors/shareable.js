/******************************************************************************\
|                                                                              |
|                                 shareable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a shareable behavior mixin for file system items.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShareRequests from '../../../../collections/storage/sharing/share-requests.js';
import FileUtils from '../../../../utilities/files/file-utils.js';

export default {

	//
	// querying methods
	//

	isShared: function() {
		return this.has('path') && this.get('path').startsWith(config.apps.file_browser.shared_directory);
	},

	isOwned: function() {
		if (this.has('owner')) {
			return true;
		} else if (this.parent) {
			return this.parent.isOwned();
		} else {
			return false;
		}
	},

	isPublic: function() {
		if (this.has('public_id')) {
			return true;
		} else if (this.parent) {
			return this.parent.isPublic();
		}
	},

	isAttached: function() {
		return this.has('post_attachment_id') || 
			this.has('comment_attachment_id') ||
			this.has('reply_attachment_id') ||
			this.has('chat_attachment_id');
	},

	hasShare: function() {
		return this.has('share_id');
	},

	hasBeenShared: function() {
		if (this.hasShare()) {
			return true;
		} else if (this.parent) {
			return this.parent.hasBeenShared();
		} else {
			return this.isOwned();
		}
	},

	//
	// fetching methods
	//

	fetchShareRequests: function(options) {

		// fetch existing links to directory
		//
		return new ShareRequests().fetchByItem(this, {

			// callbacks
			//
			success: (collection) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
				}
			}
		});
	},

	deleteShareRequests: function(shareRequests, options) {
		return new ShareRequests(shareRequests).destroy({

			// callbacks
			//
			success: (collection) => {

				// decrement shares count
				//
				this.set({
					num_shares: this.get('num_shares') - collection.length
				});

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
				}
			},

			error: (response) => {

				// perform callback
				//
				if (options && options.error) {
					options.error(response);
				}
			}
		});
	},

	//
	// file system methods
	//

	transferTo: function(dest, directory, options) {
		import(
			'../../../../models/storage/directories/directory.js'
		).then((Directory) => {

			// for directories, make sure that dest path is a directory path
			//
			if (this instanceof Directory.default) {
				dest = FileUtils.toDirectoryPath(dest);
			}

			$.ajax(_.extend({}, options, {
				url: this.urlRoot + '/transfer',
				type: 'PUT',
				data: _.extend(this.getData(), {
					'share_id': this.getRelated('share_id'),
					'dest': dest,
					'dest_share_id': directory.getRelated('share_id')
				}),

				// callbacks
				//
				success: (data) => {
					import(
						'../../../../collections/storage/items.js'
					).then((Items) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(Items.default.toItem(data));
						}
					});
				},
			}));
		});
	},

	duplicateTo: function(dest, directory, options) {
		import(
			'../../../../models/storage/directories/directory.js'
		).then((Directory) => {

			// for directories, make sure that dest path is a directory path
			//
			if (this instanceof Directory.default) {
				dest = FileUtils.toDirectoryPath(dest);
			}

			$.ajax(_.extend({}, options, {
				url: this.urlRoot + '/duplicate',
				type: 'POST',
				data: _.extend(this.getData(), {
					'share_id': this.getRelated('share_id'),
					'dest': dest,
					'dest_share_id': directory.getRelated('share_id')
				}),

				// callbacks
				//
				success: (data) => {
					import(
						'../../../../collections/storage/items.js'
					).then((Items) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(Items.default.toItem(data));
						}
					});
				},
			}));
		});
	},

	//
	// rendering methods
	//

	showNewShareRequests: function(connections, options) {
		import(
			'../../../../views/apps/file-browser/sharing/share-requests/dialogs/share-items-with-connections-dialog-view.js'
		).then((ShareItemsWithConnectionsDialogView) => {

			// show share items dialog
			//
			application.show(new ShareItemsWithConnectionsDialogView.default(_.extend({
				items: [this],
				collection: connections
			}, options)));
		});
	},

	showShareRequests: function(options) {
		Promise.all([
			import('../../../../models/storage/directories/directory.js'),
			import('../../../../models/storage/media/image-file.js'),
			import('../../../../models/storage/files/file.js')
		]).then(([Directory, ImageFile, File]) => {
			this.fetchShareRequests({

				// callbacks
				//
				success: (collection) => {
					if (this instanceof Directory.default) {
						this.showDirectorySharingInfoDialogView(collection, options);
					} else if (this instanceof ImageFile.default) {
						this.showImageFileSharingInfoDialogView(collection, options);		
					} else if (this instanceof File.default) {
						this.showFileSharingInfoDialogView(collection, options);				
					}
				}
			});
		});
	},

	//
	// dialog rendering methods
	//

	showDirectorySharingInfoDialogView: function(collection, options) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/directory-info-dialog-view.js'
		).then((DirectoryInfoDialogView) => {

			// show directory info dialog
			//
			application.show(new DirectoryInfoDialogView.default(_.extend({
				model: this,
				tab: 'sharing',
				shareRequests: collection
			}, options)));
		});
	},

	showFileSharingInfoDialogView: function(collection, options) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js'
		).then((FileInfoDialogView) => {

			// show file info dialog
			//
			application.show(new FileInfoDialogView.default(_.extend({
				model: this,
				tab: 'sharing',
				shareRequests: collection
			}, options)));
		});
	},

	showImageFileSharingInfoDialogView: function(collection, options) {
		import(
			'../../../../views/apps/file-browser/dialogs/info/image-file-info-dialog-view.js'
		).then((ImageFileInfoDialogView) => {

			// show image file info dialog
			//
			application.show(new ImageFileInfoDialogView.default(_.extend({
				model: this,
				tab: 'sharing',
				shareRequests: collection
			}, options)));
		});
	}
};