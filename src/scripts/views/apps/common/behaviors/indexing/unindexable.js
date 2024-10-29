/******************************************************************************\
|                                                                              |
|                                unindexable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows items to be unindexed.                 |
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
import FileIndex from '../../../../../utilities/files/file-index.js';

export default {

	//
	// unindexing methods
	//

	unindexItem: function(item) {
		if (item instanceof File) {
			this.unindexFile(item);
		} else if (item instanceof Directory) {
			this.unindexDirectory(item);
		}
	},

	unindexFile: function(file) {
		FileIndex.remove(file, {

			// callbacks
			//
			success: () => {
				file.set('index_id', undefined);

				// play remove sound
				//
				application.play('remove');
			}
		});
	},

	unindexDirectory: function(directory) {
		FileIndex.removeAll(directory, {

			// callbacks
			//
			success: () => {
				directory.set('num_indices', 0);

				// play remove sound
				//
				application.play('remove');
			}
		});
	},

	//
	// dialog rendering methods
	//

	showUnindexItemDialog: function(item) {
		if (item instanceof File) {
			this.showUnindexFileDialog(item);
		} else if (item instanceof Directory) {
			this.showUnindexDirectoryDialog(item);
		}
	},

	showUnindexFileDialog: function(file) {

		// show confirm dialog
		//
		application.confirm({
			title: "Remove from Search Index?",
			icon: '<i class="fa fa-trash-alt"></i>',
			message: "Would you like to remove this file from the search index?",

			// callbacks
			//
			accept: () => {
				this.unindexFile(file);
			}
		});
	},

	showUnindexDirectoryDialog: function(directory) {
		let numIndices = directory.get('num_indices');

		// show confirm dialog
		//
		application.confirm({
			title: "Remove from Search Index?",
			icon: '<i class="fa fa-trash-alt"></i>',
			message: "Would you like to remove " + (numIndices == 1? 'this file' : 'these ' + numIndices + ' files') + " from the search index?",

			// callbacks
			//
			accept: () => {
				this.unindexDirectory(directory);
			}
		});
	}
};