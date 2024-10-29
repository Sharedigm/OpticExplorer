/******************************************************************************\
|                                                                              |
|                                 countable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for counting items contained by other         |
|        items.                                                                |
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
import AudioFile from '../../../models/storage/media/audio-file.js';
import ImageFile from '../../../models/storage/media/image-file.js';
import VideoFile from '../../../models/storage/media/video-file.js';
import Directory from '../../../models/storage/directories/directory.js';

export default {

	//
	// querying methods
	//

	isEmpty: function(includeHidden) {

		// examine counts
		//
		let numFiles = this.get('num_files');
		let numDirectories = this.get('num_directories');

		// check if counts are defined
		//
		if (!numFiles) {
			return this.get('is_empty');
		}

		// set optional parameter defaults
		//
		if (includeHidden == undefined) {
			includeHidden = false;
		}

		if (includeHidden) {
			return numFiles.all == 0 && numDirectories.all == 0;
		} else {
			return numFiles.all == numFiles.hidden &&
				numDirectories.all == numDirectories.hidden;
		}
	},

	isAllThumbs: function(includeHidden) {
		let numDirectories = this.numVisibleDirectories(includeHidden);
		if (numDirectories > 0) {
			return false;
		}

		let numFiles = this.numVisibleFiles(includeHidden);
		return numFiles > 0 && this.numThumbnails() == numFiles;
	},

	isAudioAlbum: function() {
		let numFiles = this.get('num_files');
		return (numFiles && numFiles.audio > 0) &&
			(numFiles.audio == numFiles.all - numFiles.hidden);
	},

	isImageAlbum: function() {
		let numFiles = this.get('num_files');
		return (numFiles && numFiles.image > 0) &&
			(numFiles.image == numFiles.all - numFiles.hidden);
	},

	isVideoAlbum: function() {
		let numFiles = this.get('num_files');
		return (numFiles && numFiles.video > 0) &&
			(numFiles.video == numFiles.all - numFiles.hidden);
	},

	//
	// counting methods
	//

	numFiles: function(options) {
		if (this.has('num_files')) {
			if (!options || !options.type) {
				return this.get('num_files').all || 0;
			} else {
				return this.get('num_files')[options.type] || 0;
			}
		}
	},

	numDirectories: function(options) {
		if (this.has('num_directories')) {
			if (!options || !options.type) {
				return this.get('num_directories').all || 0;
			} else {
				return this.get('num_directories')[options.type] || 0;
			}
		}
	},

	numDirectoryItems: function(options) {
		return this.numFiles(options) + this.numDirectories(options);
	},

	//
	// hidden counting files
	//

	numHiddenFiles: function() {
		return this.numFiles({
			type: 'hidden'
		});
	},

	numHiddenDirectories: function() {
		return this.numDirectories({
			type: 'hidden'
		});
	},

	//
	// visible counting methods
	//

	numVisibleFiles: function(includeHidden) {
		if (this.has('num_files')) {
			let numFiles = this.get('num_files');
			if (includeHidden) {
				return numFiles.all;
			} else {
				return numFiles.all - numFiles.hidden;
			}
		}
	},

	numVisibleDirectories: function(includeHidden) {
		if (this.has('num_directories')) {
			let numDirectories = this.get('num_directories');
			if (includeHidden) {
				return numDirectories.all;
			} else {
				return numDirectories.all - numDirectories.hidden;
			}
		}
	},

	//
	// getting methods
	//

	getItemCount: function() {
		return this.contents.length;
	},

	getFileCount: function(options) {
		let num = 0;

		if (!options || options.type == 'all') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof File) {
					num++;
				}
			}
		} else if (options && options.type == 'hidden') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof File && item.isHidden()) {
					num++;
				}
			}
		} else if (options && options.type == 'audio') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof AudioFile) {
					num++;
				}
			}
		} else if (options && options.type == 'image') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof ImageFile) {
					num++;
				}
			}
		} else if (options && options.type == 'video') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof VideoFile) {
					num++;
				}
			}
		}

		return num;
	},

	getDirectoryCount: function(options) {
		let num = 0;

		if (!options || options.type == 'all') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof Directory) {
					num++;
				}
			}
		} else if (options && options.type == 'hidden') {
			for (let i = 0; i < this.contents.length; i++) {
				let item = this.contents.at(i);
				if (item instanceof Directory && item.isHidden()) {
					num++;
				}
			}
		}

		return num;
	},

	getFileCounts: function() {
		let counts = {
			all: 0,
			audio: 0,
			image: 0,
			video: 0,
			hidden: 0
		};

		// count number of each item type
		//
		for (let i = 0; i < this.contents.length; i++) {
			let item = this.contents.at(i);
			if (item instanceof File) {
				counts.all++;

				if (item.isHidden()) {
					counts.hidden++;
				}

				if (item instanceof AudioFile) {
					counts.audio++;
				} else if (item instanceof ImageFile) {
					counts.image++;
				} else if (item instanceof VideoFile) {
					counts.video++;
				}
			}
		}

		return counts;
	},

	getDirectoryCounts: function() {
		let counts = {
			all: 0,
			hidden: 0
		};

		// count number of each item type
		//
		for (let i = 0; i < this.contents.length; i++) {
			let item = this.contents.at(i);
			if (item instanceof Directory) {
				counts.all++;
				
				if (item.isHidden()) {
					counts.hidden++;
				}
			}
		}

		return counts;
	},

	getSize: function(showHidden) {
		let numFiles = this.numFiles() || 0;
		let numDirectories = this.numDirectories() || 0;

		// deduct hidden files from counts
		//
		if (!showHidden) {
			numFiles -= this.numHiddenFiles() || 0;
			numDirectories -= this.numHiddenDirectories() || 0;
		}

		if (numFiles || numDirectories) {
			let contents = '';

			// add number of files
			//
			if (numFiles) {
				contents = numFiles + ' ' + (numFiles == 1? 'file' : 'files');
			}

			// add number of directories
			//
			if (numDirectories) {
				if (numFiles) {
					contents += ', ';
				}
				contents += numDirectories + ' ' + (numDirectories == 1? 'folder' : 'folders');
			}

			return contents;
		} else {
			return '0 files';
		}
	},

	getSortableSize: function(showHidden) {
		let numFiles = this.numFiles();
		let numDirectories = this.numDirectories();

		// deduct hidden files from counts
		//
		if (!showHidden) {
			numFiles -= this.numHiddenFiles();
			numDirectories -= this.numHiddenDirectories();
		}

		return numFiles.all + numDirectories.all;
	},

	//
	// updating methods
	//

	updateCounts: function() {
		this.set({
			num_files: this.getFileCounts(),
			num_directories: this.getDirectoryCounts()
		});
	},

	incrementCounts: function(item) {
		let numFiles = _.extend({}, this.get('num_files'));
		let numDirectories = _.extend({}, this.get('num_directories'));

		// increment counts
		//
		if (item instanceof this.constructor) {
			numDirectories.all++;
			if (item.isHidden()) {
				numDirectories.hidden++;
			}
		} else if (item instanceof File) {
			numFiles.all++;
			if (item.isHidden()) {
				numFiles.hidden++;
			}

			if (item instanceof AudioFile) {
				numFiles.audio++;
			} else if (item instanceof ImageFile) {
				numFiles.image++;
			} else if (item instanceof VideoFile) {
				numFiles.video++;
			}
		}

		this.set({
			num_files: numFiles,
			num_directories: numDirectories
		});
	},

	decrementCounts: function(item) {
		let numFiles = _.extend({}, this.get('num_files'));
		let numDirectories = _.extend({}, this.get('num_directories'));

		// increment counts
		//
		if (item instanceof this.constructor) {
			numDirectories.all--;
			if (item.isHidden()) {
				numDirectories.hidden--;
			}
		} else if (item instanceof File) {
			numFiles.all--;
			if (item.isHidden()) {
				numFiles.hidden--;
			}

			if (item instanceof AudioFile) {
				numFiles.audio--;
			} else if (item instanceof ImageFile) {
				numFiles.image--;
			} else if (item instanceof VideoFile) {
				numFiles.video--;
			}
		}

		this.set({
			num_files: numFiles,
			num_directories: numDirectories
		});
	},

	clearCounts: function() {
		this.set({
			num_files: {
				all: 0,
				audio: 0,
				image: 0,
				video: 0,
				hidden: 0
			},
			num_directories: {
				all: 0,
				hidden: 0
			}
		});
	},

	//
	// event handling methods
	//

	onAdd: function(item) {

		// increment contents counts
		//
		this.incrementCounts(item);

		// update flag
		//
		this.set('is_empty', this.contents.length == 0);
	},

	onRemove: function(item) {

		// decrement contents counts
		//
		this.decrementCounts(item);

		// update flag
		//
		this.set('is_empty', this.contents.length == 0);
	}
};