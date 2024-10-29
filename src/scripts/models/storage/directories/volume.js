/******************************************************************************\
|                                                                              |
|                                   volume.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a remote directory structure.                 |
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
import Directory from '../../../models/storage/directories/directory.js';
import Containable from '../../../models/storage/behaviors/containable.js';
import Countable from '../../../models/storage/behaviors/countable.js';
import Nestable from '../../../models/storage/behaviors/nestable.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default File.extend(_.extend({}, Containable, Countable, Nestable, {

	//
	// attributes
	//

	defaults: _.extend({}, File.prototype.defaults, Countable.defaults),

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/volume',

	//
	// constructor
	//

	initialize: function(attributes) {

		// set attributes
		//
		this.set(attributes);

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

	hasRelated: function(name) {
		if (name == 'volume') {
			return true;
		}

		return Directory.prototype.hasRelated.call(this, name);
	},

	//
	// getting methods
	//

	getUrl: function(options) {
		return this.urlRoot + "/read?" + this.getQueryString(options);
	},

	getRelated: function(name) {
		if (name == 'volume') {
			return this.get('path');
		}
		
		return Directory.prototype.getRelated.call(this, name);
	},

	getData: function(data) {
		let data2 = File.prototype.getData.call(this, data);
		delete data2.volume;
		return data2;
	},

	//
	// setting methods
	//

	setPath: function(path, options) {
		this.set({
			path: path
		}, options);
	},

	//
	// ajax methods
	//

	read: function(options) {
		return $.ajax(_.extend({}, options, {
			url: this.getUrl(),
			type: 'GET'
		}));
	},

	write: function(contents, options) {
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/write?' + this.getQueryString(),
			type: 'POST',
			data: {
				'contents': contents
			}
		}));
	},

	moveTo: function(dest, options) {

		// move / rename file
		//
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/move',
			type: 'PUT',
			data: _.extend(this.getData(), {
				dest: FileUtils.getFilePath(dest),
			}),

			// callbacks
			//
			success: (data) => {

				// update model
				//
				this.set(data);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	},

	copyTo: function(dest, options) {

		// copy file to new location
		//
		import(
			'../../../collections/storage/items.js'
		).then((Items) => {
			return $.ajax(_.extend({}, options, {
				url: this.urlRoot + '/copy',
				type: 'POST',
				data: _.extend(this.getData(), {
					dest: dest,
					replace: options && options.replace? true : false,
				}),
				
				// callbacks
				//
				success: (data) => {

					// perform callback
					//
					if (options && options.success) {
						options.success(Items.default.toItem(data));
					}
				}
			}));
		});
	},

	fetchContents: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/contents' + (options && options.recursive? '/all' : ''),
			type: 'GET',
			data: _.extend(this.getData(), {
				volume: this.get('path'),
				path: '/'
			}, options.search)
		}));
	}
}), {

	//
	// static attributes
	//

	extensions: Object.keys(config.files.volumes.extensions),

	//
	// static methods
	//

	isValidExtension: function(extension) {
		return extension && this.extensions.contains(extension.toLowerCase());
	},

	isValidPath: function(path) {
		return this.isValidExtension(FileUtils.getFileExtension(path));
	}
});