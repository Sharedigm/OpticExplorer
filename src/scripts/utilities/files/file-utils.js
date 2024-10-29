/******************************************************************************\
|                                                                              |
|                                  file-utils.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose file utilities.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../scripting/string-utils.js';

export default {
	
	//
	// file querying methods
	//

	isFilePath: function(name) {
		return name && (typeof(name) == 'string') && !name.endsWith('/');
	},

	isDirectoryPath: function(name) {
		return name && (typeof(name) == 'string') && name.endsWith('/');
	},

	hasFileExtension: function(path) {
		let name = this.getFileName(path);
		return name && name.contains('.');
	},

	//
	// file getting methods
	//

	getFileName: function(path) {
		if (!path) {
			return '';
		}

		// return string after the last slash
		//
		if (path.contains('/')) {
			return path.substr(path.lastIndexOf('/') + 1, path.length);
		} else if (path.contains('\\')) {
			return path.substr(path.lastIndexOf('\\') + 1, path.length);
		} else {
			return path;
		}
	},

	getDirectoryName: function(path) {
		if (!path) {
			return '';
		}

		// remove leading tilda
		//
		if (path.startsWith('~')) {
			path = path.substr(1, path.length);
		}

		// remove trailing slash
		//
		if (path.endsWith('/')) {
			path = path.substr(0, path.length - 1);
		}

		// return string after the last slash
		//
		return this.getFileName(path);
	},

	getItemName: function(path) {
		if (this.isFilePath(path)) {
			return this.getFileName(path);
		} else {
			return this.getDirectoryName(path);
		}
	},

	getItemBaseName: function(path) {
		let name = this.getItemName(path);

		// return portion of name before the last dot
		//
		let index = name.lastIndexOf('.');
		if (index != -1) {
			return name.substr(0, index);
		} else {
			return name;
		}
	},

	getFileExtension: function(path) {
		let name = this.getFileName(path);

		// return portion of name after the last dot
		//
		if (name && name.contains('.')) {
			let index = name.lastIndexOf('.');
			return name.substr(index + 1, name.length - 1);
		} else {
			return '';
		}
	},

	getFilePath: function(path) {

		// return portion of string before the last slash
		//
		if (this.isDirectoryPath(path)) {
			return path.substr(0, path.lastIndexOf('/'));
		} else {
			return path;
		}
	},

	getDirectoryPath: function(path) {
		if (this.isFilePath(path)) {

			// return portion of string before the last slash,
			//
			return path.substr(0, path.lastIndexOf('/') + 1);
		} else {

			// return portion of string before the second to last last slash
			//
			return path.substr(0, path.substr(0, path.length - 1).lastIndexOf('/') + 1);
		}
	},

	//
	// file conversion methods
	//

	toDirectoryPath: function(path) {
		if (!this.isDirectoryPath(path)) {
			return path + '/';
		} else {
			return path;
		}
	}
};