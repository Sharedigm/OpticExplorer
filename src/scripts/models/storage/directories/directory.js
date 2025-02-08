/******************************************************************************\
|                                                                              |
|                                 directory.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a recursive directory structure.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Item from '../../../models/storage/item.js';
import Containable from '../../../models/storage/behaviors/containable.js';
import Countable from '../../../models/storage/behaviors/countable.js';
import Nestable from '../../../models/storage/behaviors/nestable.js';
import Movable from '../../../models/storage/behaviors/movable.js';
import Copyable from '../../../models/storage/behaviors/copyable.js';
import FileUtils from '../../../utilities/files/file-utils.js';
import Url from '../../../utilities/web/url.js';

export default Item.extend(_.extend({}, Containable, Countable, Nestable, Movable, Copyable, {

	//
	// attributes
	//

	defaults: _.extend({}, Item.prototype.defaults, Countable.defaults),

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/directory',

	//
	// constructor
	//

	initialize: function(attributes) {

		// set attributes
		//
		this.set(attributes);

		// set root
		//
		if (this.isRoot()) {
			this.constructor.root = this;
		}

		// make sure that path ends in a slash
		//
		if (this.has('path')) {
			this.set('path', FileUtils.toDirectoryPath(this.get('path')));
		}

		// initialize contents
		//
		Containable.initialize.call(this, attributes);

		// listen for changes in contents
		//
		this.addEventListeners();
	},

	//
	// querying methods
	//

	is: function(model) {
		return model && model instanceof this.constructor && this.get('path') == model.get('path');
	},

	isIndexable: function() {
		return !this.isRoot();
	},

	isHome: function() {
		if (this.has('path')) {
			let path = this.get('path');
			return path == '/' || path == '';
		} else if (this.has('link')) {
			return this.get('link').get('target').isHome();		
		} else {
			return true;
		}
	},

	url: function(offset) {
		return this.urlRoot + (offset? offset : '') + (!this.isNew()? '?' + this.getQueryString() : '');
	},

	//
	// getting methods
	//

	getName: function() {
		if (this.has('path')) {
			return FileUtils.getDirectoryName(this.get('path'));
		} else if (this.has('link')) {
			return this.get('link').get('target').getName();		
		}
	},

	getUniqueName: function(name) {
		return Containable.getUniqueName.call(this, name || this.constructor.defaultName);
	},

	getLinkUrl: function() {
		if (this.has('link')) {

			// directory has been linked directly
			//
			return this.get('link').getUrl();
		} else {

			// directory is part of a linked directory
			//
			return this.getTop().getUrl() + 
				(this.has('path')? '?path=' + Url.encode(this.get('path')) : '');
		}
	},

	//
	// path getting methods
	//

	getPathTo: function(path) {

		// clear leading slashes
		//
		if (path.startsWith('/')) {
			path = this.constructor.subpath(path);
		}

		let targetPath = this.constructor.toPath(this.get('path'));
		if (path == '.') {
			return targetPath;
		} else {

			// dereference path
			//
			while (path.startsWith('../')) {
				targetPath = this.constructor.dirname(targetPath) + '/';
				path = this.constructor.subpath(path);
			}

			// append
			//
			targetPath += path;
		}

		return targetPath;
	},
	
	getRelativePathTo: function(path) {
		let sourcePath = this.constructor.toPath(this.get('name'));
		let targetPath = path;
		return this.constructor.getRelativePathBetween(sourcePath, targetPath);
	},

	//
	// name getting methods
	//

	getIndexedName: function(name, index, extension) {

		// add index to name
		//
		name += ' (' + index + ')';

		// add extension to name
		//
		if (extension && extension != '') {
			name += '.' + extension;
		}

		return name;
	},

	getCopyName: function(name) {

		// find unused name
		//
		if (this.hasItemNamed(name)) {
			let baseName = FileUtils.getItemBaseName(name);
			let extension = FileUtils.getFileExtension(name);

			// create copy name
			//
			if (!baseName.endsWith('copy')) {
				if (baseName && baseName != '') {
					baseName += ' ';
				}
				baseName += 'copy';
			}
			if (extension && extension != '') {
				name = baseName + '.' + extension;
			} else {
				name = baseName;
			}

			if (this.hasItemNamed(name)) {

				// add index
				//
				let index = 2;
				while (this.hasItemNamed(this.getIndexedName(baseName, index, extension))) {
					index++;
				}
				name = this.getIndexedName(baseName, index, extension);
			}
		}

		return name;
	},

	//
	// setting methods
	//

	setPath: function(path) {

		// make sure that directory paths end in a slash
		//
		this.set({
			path: path + (this instanceof this.constructor? '/' : '')
		});
	},

	setPlace: function(place, options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/directory/place',
			type: 'POST',
			data: _.extend({
				path: this.get('path')
			}, place.attributes)
		}));
	},

	deletePlace: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/directory/place',
			type: 'DELETE',
			data: {
				path: this.get('path')
			}
		}));
	},

	//
	// creating methods
	//

	create: function(options) {
		if (this.loaded && !options.details) {

			// perform callback
			//
			if (options && options.success) {
				options.success(this);
			}
		} else {

			// load directory
			//
			return this.load({
				details: options? options.details : undefined,

				// callbacks
				//
				success: () => {

					// perform callback
					//
					if (options && options.success) {
						options.success(this);
					}
				},

				error: (model) => {

					// create new directory
					//
					this.saveAs(this.get('path'), {

						// callbacks
						//
						success: (model) => {

							// perform callback
							//
							if (options && options.success) {
								options.success(model);
							}
						},

						error: () => {

							// perform callback
							//
							if (options && options.error) {
								options.error(model);
							}
						}
					});
				}
			});
		}
	},

	newDirectory: function(options) {
		this.createDirectory(this.getUniqueName(), options);
	},

	createDirectory: function(name, options) {

		// check if item with same name already exists
		//
		if (this.hasItemNamed(name) && !(options && options.overwrite)) {
			application.confirm({
				icon: '<i class="fa fa-copy"></i>',
				title: "Copy",
				message: "This location already contains an item named '" + name + "'.  Would you like to replace it?",
				
				// callbacks
				//
				accept: () => {

					// replace directory
					//
					this.getItemNamed(name).destroy({

						// callbacks
						//
						success: () => this.createDirectory(name, options)
					});
				}
			});

			return;
		}

		// make sure that directory is writable
		//
		if (!this.isWritable()) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to write to this directory."
			});

			return;
		}

		// create new directory
		//
		let dirname = this.get('path') || '';
		let path = dirname + FileUtils.toDirectoryPath(name);
		let directory = new this.constructor({
			permissions: options && options.permissions? options.permissions : this.get('permissions')
		});
		let link = this.getRelated('link');

		// set attributes
		//
		directory.parent = this;
		directory.loaded = true;

		// save new model
		//
		return directory.saveAs(path, {
			link: link,

			// callbacks
			//
			success: (model) => {

				// remove trailing slash
				//
				if (name.endsWith('/')) {
					name = name.substr(0, name.length - 1);
				}

				// add new directory to directory contents
				//
				if (!name.contains('/')) {
					this.add(model);
				}

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (model, response) => {

				// perform callback
				//
				if (options && options.error) {
					options.error(model, response);
				} else {

					// show error message
					//
					application.error({
						message: "Could not create directory."
					});
				}
			}
		});
	},
	
	//
	// saving methods
	//

	save: function(options) {
		return this.saveAs(this.get('path'), options);
	},

	saveAs: function(path, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// save new directory
		//
		return $.ajax({
			url: this.urlRoot + '?path=' + Url.encode(path) + 
				(options && options.link? '&' + options.link.getQueryString() : ''),
			type: 'POST',
			data: _.extend(this.getData({
				permissions: this.get('permissions')
			}), options.search),

			// callbacks
			//
			success: (response) => {

				// set attributes
				//
				this.set(this.parse(response));
				this.loaded = true;

				// perform callback
				//
				if (options && options.success) {
					options.success(this, response);
				}
			},

			error: (response) => {

				// perform callback
				//
				if (options && options.success) {
					options.error(response);
				}
			}
		});
	},

	//
	// ajax methods
	//

	fetchNumFiles: function(options) {
		return $.ajax({
			url: this.urlRoot + '/files' + (options.recursive? '/all' : '') + '/num?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchNumDirectories: function(options) {
		return $.ajax({
			url: this.urlRoot + '/directories/' + (options.recursive? '/all' : '') + '/num?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchNumItems: function(options) {
		return $.ajax({
			url: this.urlRoot + '/contents/' + (options.recursive? '/all' : '') + '/num?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchIndexedFiles: function(options) {
		return $.ajax({
			url: this.urlRoot + '/files/indexed' + (options.recursive? '/all' : '') + '?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchNumIndexedFiles: function(options) {
		return $.ajax({
			url: this.urlRoot + '/files/indexed' + (options.recursive? '/all' : '') + '/num?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchIndexableFiles: function(options) {
		return $.ajax({
			url: this.urlRoot + '/files/indexable' + (options.recursive? '/all' : '') + '?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	},

	fetchNumIndexableFiles: function(options) {
		return $.ajax({
			url: this.urlRoot + '/files/indexable' + (options.recursive? '/all' : '') + '/num?' + this.getQueryString() + (options.kind? '&kind=' + options.kind : ''),
			type: 'GET',
			success: options.success,
			error: options.error
		});
	}
}), {

	//
	// static attributes
	//
	
	defaultName: 'Untitled',

	//
	// static methods
	//

	isValidPath: function(path) {
		return path && (typeof(path) == 'string') && path.endsWith('/');
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

	getDirectoryPath: function(path) {

		// strip off last slash of directory names
		//
		if (path && path.endsWith('/')) {
			return path.substr(0, path.length - 1);
		} else {
			return path;
		}
	},

	dirname: function(path) {
		let directoryPath = this.getDirectoryPath(path);

		// get directory name
		//
		return directoryPath.substr(0, directoryPath.lastIndexOf('/'));	
	},

	subpath: function(path) {
		return path.substr(path.indexOf('/') + 1, path.length - 1);				
	},

	rootPath: function(path) {
		return path.substr(0, path.indexOf('/'));
	},

	toPath: function(path) {
		if (!path.endsWith('/')) {
			path += '/';
		}
		return path;
	},

	getRelativePathBetween: function(sourcePath, targetPath) {
		let path;

		// clear leading slashes
		//
		if (sourcePath.startsWith('/')) {
			sourcePath = this.subpath(sourcePath);
		}
		if (targetPath.startsWith('/')) {
			targetPath = this.subpath(targetPath);
		}

		// clear leading single dots
		//
		if (sourcePath.startsWith('./')) {
			sourcePath = this.subpath(sourcePath);
		}

		// source path is current directory
		//
		if (sourcePath == '.' || sourcePath == '/') {
			path = targetPath;

		// target path is the same as source path
		//
		} else if (targetPath == sourcePath) {
			path = '.';

		// target path starts with source path
		//
		} else if (targetPath.startsWith(sourcePath)) {
			path = targetPath.replace(sourcePath, '');

		// target path is contained by source path
		//
		} else if (sourcePath.contains(targetPath)) {
			sourcePath = sourcePath.replace(targetPath, '');
			path = '';
			for (let i = 1; i < sourcePath.split('/').length; i++) {
				path = '../' + path;
			}

		// handle .. paths
		//
		} else if (this.rootPath(targetPath) == '..') {
			while (this.rootPath(targetPath) == '..') {
				sourcePath = this.dirname(sourcePath);
				targetPath = this.subpath(targetPath);
			}
			path = sourcePath + '/' + targetPath;

		// target path is outside of source path
		//
		} else {

			// go up one level
			//
			path = '../' + this.constructor.getRelativePathBetween(this.dirname(sourcePath) + '/', targetPath);
		}

		return path;
	}
});