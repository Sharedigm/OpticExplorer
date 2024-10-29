/******************************************************************************\
|                                                                              |
|                                archive-file.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an archive file.                              |
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
import FileUtils from '../../../utilities/files/file-utils.js';

export default File.extend({

	//
	// attributes
	//

	defaults: {
		owner: undefined,
		num_shares: 0,
		num_links: 0
	},
	
	//
	// fetching methods
	//

	fetchContents: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/archive/contents?' + this.getQueryString(),
			type: 'GET'
		}));
	},

	extract: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/archive/extract?' + this.getQueryString(),
			type: 'POST'
		}));
	}
}, {

	//
	// static attributes
	//

	extensions: config.files.archives.extensions,

	//
	// static methods
	//

	getItemDescription: function(item) {
		if (item.path.endsWith('/')) {
			return '1 folder named "' + item.path + '"';
		} else {
			return '1 file named "' + item.path + '"';
		}	
	},

	getItemsDescription: function(items) {
		let numFiles = 0;
		let numFolders = 0;
		let description = '';
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.path.endsWith('/')) {
				numFolders++;
			} else {
				numFiles++;
			}
		}
		if (numFolders) {
			description = numFolders + ' ' + (numFolders == 1? 'folder' : 'folders');
		}
		if (numFiles) {
			if (numFolders) {
				description += ' and ';
			}
			description += numFiles + ' ' + (numFiles == 1? 'file' : 'files');
		}
		return description;
	},

	getContentsDescription: function(contents) {
		if (contents.length == 1) {
			return this.getItemDescription(contents[0]);
		} else {
			return this.getItemsDescription(contents);
		}
	},

	isValidExtension: function(extension) {
		return extension && this.extensions.contains(extension.toLowerCase());
	},

	isValidPath: function(path) {
		return this.isValidExtension(FileUtils.getFileExtension(path));
	}
});