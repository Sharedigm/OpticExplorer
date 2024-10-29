/******************************************************************************\
|                                                                              |
|                                    file.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file.                                       |
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
import Readable from '../../../models/storage/behaviors/readable.js';
import Writable from '../../../models/storage/behaviors/writable.js';
import Uploadable from '../../../models/storage/behaviors/uploadable.js';
import Movable from '../../../models/storage/behaviors/movable.js';
import Copyable from '../../../models/storage/behaviors/copyable.js';
import FileUtils from '../../../utilities/files/file-utils.js';
import QueryString from '../../../utilities/web/query-string.js';

export default Item.extend(_.extend({}, Readable, Writable, Uploadable, Movable, Copyable, {

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/file',

	//
	// querying methods
	//

	is: function(model) {
		return model && model instanceof this.constructor && this.get('path') == model.get('path');
	},

	isIndexable: function() {
		return this.getFileExtension() == 'pdf' && !this.hasIndex();
	},

	hasThumbnail: function() {

		// check for path
		//
		if (!this.has('path') || this.get('path').length == 0) {
			return false;
		}

		// check extensions
		//
		let name = this.getName();
		let extension = this.constructor.getFileExtension(name).toLowerCase();
		return this.constructor.thumbnailExtensions.contains(extension);
	},

	hasInherited: function(name) {

		// find if item's directory or an ancestor has attribute
		//
		return this.collection && this.collection.directory && this.collection.directory.hasRelated(name);
	},

	hasRelated: function(name) {

		// find if item or an ancestor has attribute
		//
		return this.has(name) || this.hasInherited(name);
	},

	url: function(offset) {
		return this.urlRoot + (offset? offset : '') + "?" + this.getQueryString();
	},

	//
	// getting methods
	//

	getUrl: function(options) {
		return this.urlRoot + "/read?" + this.getQueryString(options);
	},
	
	getName: function() {
		return FileUtils.getFileName(this.get('path')) || this.constructor.defaultName;
	},
	
	getFileExtension: function() {
		return FileUtils.getFileExtension(this.getName()).toLowerCase();
	},

	getThumbnailUrl: function(options) {
		return config.servers.api + '/file/thumb?' + QueryString.encode(this.getData(options));
	},

	getRelated: function(name) {

		// get attribute from item or item directory's ancestor
		//
		return this.get(name) || (this.collection && this.collection.directory && this.collection.directory.getRelated(name));
	},

	//
	// attribute getting methods
	//

	getSize: function(options) {
		let bytes = this.get('size');
		let size;

		if (bytes > 1000000) {
			size = Math.floor(bytes  / 1000000) + ' MB';
			if (options && options.detailed) {
				size += ' (' + bytes + ' bytes)';
			}
		} else if (bytes > 1000) {
			size = Math.floor(bytes  / 1000) + ' KB';
			if (options && options.detailed) {
				size += ' (' + bytes + ' bytes)';
			}
		} else if (bytes != undefined) {
			size = bytes + ' bytes';
		}

		return size;
	},

	getSortableSize: function() {
		return this.get('size');
	},
	
	//
	// setting methods
	//

	setPath: function(path, options) {
		this.set({
			path: path
		}, options);
	},

	setPlace: function(place, options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/file/place',
			type: 'POST',
			data: _.extend({
				path: this.get('path')
			}, place.attributes)
		}));
	},

	deletePlace: function(options) {
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/file/place',
			type: 'DELETE',
			data: {
				path: this.get('path')
			}
		}));
	},

	//
	// fetching methods
	//

	fetch: function(options) {
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot,
			type: 'GET',
			data: this.getData(),

			// callbacks
			//
			success: (data) => {
				this.set(this.parse(data));

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	}
}), {

	//
	// static attributes
	//

	thumbnailExtensions: [
		'pdf'
	],

	defaultName: 'Untitled',

	//
	// static methods
	//

	getFileExtension: function(path) {
		let name = Item.getBaseName(path);

		// return portion of name after the last dot
		//
		if (name && name.contains('.')) {
			let index = name.lastIndexOf('.');
			return name.substr(index + 1, name.length - 1);
		} else {
			return '';
		}
	},

	isValidPath: function(path) {
		return path && (typeof(path) == 'string') && !path.endsWith('/');
	}
});