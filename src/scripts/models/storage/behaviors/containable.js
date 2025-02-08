/******************************************************************************\
|                                                                              |
|                                containable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for items containing other items.             |
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
let Items;

export default {

	//
	// constructor
	//

	initialize: function(attributes) {

		// create contents
		//
		if (!Items) {
			import('../../../collections/storage/items.js').then((Module) => {
				Items = Module.default;
				this.contents = new Items(attributes? attributes.contents : null);
				this.contents.directory = this;
			});
		} else {
			this.contents = new Items(attributes? attributes.contents : null);
			this.contents.directory = this;
		}
	},

	//
	// querying methods
	//

	isEmpty: function() {
		return this.get('is_empty') == true;
	},

	isFull: function() {
		return this.get('is_empty') == false;
	},

	contains: function(model, options) {

		// check for empty directory
		//
		if (this.contents.length == 0) {
			return false;
		} else {

			// check contents
			//
			for (let i = 0; i < this.contents.length; i++) {
				if (this.contents.at(i).is(model)) {
					return true;
				} else if (options && options.recursive) {
					if (model.has('path') && model.get('path').startsWith(this.get('path'))) {
						return true;
					}
				}
			}
			return false;
		}
	},

	hasItems: function(filter) {
		if (!this.isEmpty()) {
			if (filter) {
				return this.contents.filter(filter).length > 0;
			} else {
				return this.contents.length > 0;
			}
		}
		return false;
	},

	hasItem: function(path) {
		for (let i = 0; i < this.contents.length; i++) {
			let model = this.contents.at(i);
			if (path == model.get('path')) {
				return true;
			}
		}
		return false;
	},

	hasItemNamed: function(name) {
		for (let i = 0; i < this.contents.length; i++) {
			let model = this.contents.at(i);
			if (name == FileUtils.getItemName(model.get('path'))) {
				return true;
			}
		}
		return false;
	},

	hasAnItemNamed: function(names) {
		for (let i = 0; i < names.length; i++) {
			if (this.hasItemNamed(names[i])) {
				return true;
			}
		}
		return false;
	},

	//
	// counting methods
	//

	numItems: function(filter) {

		// check if contents are loaded
		//
		if (!this.loaded) {
			return;
		}

		if (filter) {
			return this.contents.filter(filter).length;
		} else {
			return this.contents.length;
		}
	},

	numVisibleItems: function(countHidden) {

		// check if contents are loaded
		//
		if (!this.loaded) {
			return;
		}

		// set optional parameter defaults
		//
		if (countHidden == undefined) {
			countHidden = false;
		}

		// count visible items
		//
		if (countHidden) {
			return this.numItems();
		} else {
			return this.numItems((model) => {
				return !model.isHidden();
			});
		}
	},

	numThumbnails: function() {

		// check if contents are loaded
		//
		if (!this.loaded) {
			return;
		}

		let num = 0;
		for (let i = 0; i < this.contents.length; i++) {
			let item = this.contents.at(i);
			if (item instanceof File && item.hasThumbnail()) {
				num++;
			}
		}
		return num;
	},

	//
	// getting methods
	//

	getUniqueName: function(name) {

		// find unused name
		//
		if (this.hasItemNamed(name)) {
			let baseName = FileUtils.getItemBaseName(name);
			let extension = FileUtils.getFileExtension(name);

			// add index
			//
			let index = 2;
			while (this.hasItemNamed(this.getIndexedName(baseName, index, extension))) {
				index++;
			}
			name = this.getIndexedName(baseName, index, extension);
		}

		return name;
	},

	getItems: function(filter) {
		if (filter) {
			return this.contents.filter(filter);
		} else {
			return this.contents;
		}
	},

	getItem: function(path) {
		for (let i = 0; i < this.contents.length; i++) {
			let model = this.contents.at(i);
			if (path == model.get('path')) {
				return model;
			}
		}
	},

	getItemNamed: function(name) {
		for (let i = 0; i < this.contents.length; i++) {
			let model = this.contents.at(i);
			if (name == FileUtils.getItemName(model.get('path'))) {
				return model;
			}
		}
	},

	getPaths: function(filter) {
		let paths = [];
		for (let i = 0; i < this.contents.length; i++) {
			let path = this.contents.at(i).get('path');
			if (!filter || filter(path)) {
				paths.push(path);
			}
		}
		return paths;
	},

	//
	// getting methods
	//

	getDetailsAttribute: function(details) {
		switch (details) {
			case 'size':
				return 'size';

			// timestamp attributes
			//
			case 'create_date':
				return 'created_at';
			case 'modify_date':
				return 'modified_at';
			case 'access_date':
				return 'accessed_at';

			// photo attributes
			//
			case 'resolution':
				return 'resolution';
			case 'focal_length':
			case 'exposure':
			case 'aperture':
			case 'iso':
			case 'make_model':
			case 'capture_date':
				return 'exif';

			// audio attributes
			//
			case 'album':
			case 'artist':
			case 'band':
			case 'comment':
			case 'composer':
			case 'encoded_by':
			case 'genre':
			case 'length':
			case 'part_of_a_set':
			case 'publisher':
			case 'title':
			case 'track_number':
			case 'year':
				return 'id3';

			// video attributes
			//
			case 'duration':
			case 'bit_rate':
				return 'tags';

			// file attributes
			//
			case 'places':
				return 'place';
			case 'links':
				return 'num_links';
			case 'shares':
				return 'num_shares';
			case 'owners':
				return 'owner';
			case 'indices':
				return 'num_indices';
		}
	},

	getDetailsAttributes: function(details) {

		// check if only a single detail
		//
		if (typeof (details) == 'string') {
			return [this.getDetailsAttribute(details)];
		}

		// get attributes for multiple details
		//
		let attributes = [];
		if (details) {
			for (let i = 0; i < details.length; i++) {
				let attribute = this.getDetailsAttribute(details[i]);
				if (attribute && !attributes.includes(attribute)) {
					attributes.push(attribute);
				}
			}
		}

		return attributes;
	},

	//
	// setting methods
	//

	setContents: function(contents) {

		// set contents
		//
		this.contents.set(contents);

		// set parent of models
		//
		for (let i = 0; i < this.contents.length; i++) {
			this.contents.at(i).parent = this;
		}

		// update number of files and directories
		//
		if (this.updateCounts) {
			this.updateCounts();
		}
		this.set('empty', this.contents.length == 0);
	},

	//
	// creating methods
	//

	addEventListeners: function() {

		// listen for changes in contents
		//
		this.listenTo(this.contents, 'add', (item) => {
			if (this.onAdd) {
				this.onAdd(item);
			}
		});
		this.listenTo(this.contents, 'remove', (item) => {
			if (this.onRemove) {
				this.onRemove(item);
			}
		});
	},

	//
	// adding methods
	//

	add: function(item, options) {

		// check if item is an array
		//
		if (Array.isArray(item)) {
			this.addItems(item, options);
		} else {
			this.addItem(item, options);
		}
	},

	addItem: function(item, options) {
		if (this.contents) {
			let name = item.getName();

			// add item to contents
			//
			if (this.hasItemNamed(name)) {
				this.removeItem(this.getItemNamed(name));
			}
			this.contents.add(item);
			item.parent = this;

			// update item path
			//
			item.setPath((this.has('path')? this.get('path') : '') + item.getName(), {
				silent: true
			});

			// update
			//
			if (this.incrementCounts) {
				this.incrementCounts(item);
			}

			// update
			//
			if (this.onAdd) {
				this.onAdd(item);
			}

			// perform callback
			//
			if (options && options.success) {
				options.success(item);
			}
		} else {
			
			// load directory contents
			//
			this.load({

				// callbacks
				//
				success: () => this.addItem(item, options)
			});
		}

		// perform callback
		//
		if (this.onAdd) {
			this.onAdd();
		}
	},

	addItems: function(items, options) {
		let count = 0;

		function addItem(item, directory) {
			directory.addItem(item, {

				// callbacks
				//
				success: () => {

					// check if we are finished
					//
					count++;
					if (count == items.length) {

						// perform callback
						//
						if (options && options.success) {
							options.success(items);
						}	
					}
				}
			});
		}

		// add items individually
		//
		for (let i = 0; i < items.length; i++) {
			addItem(items[i], this);
		}
	},

	//
	// removing methods
	//

	remove: function(item, options) {

		// check if item is an array
		//
		if (Array.isArray(item)) {
			this.removeItems(item, options);
		} else {
			this.removeItem(item, options);
		}
	},

	removeItem: function(item, options) {
		if (this.contents) {

			// remove item from contents
			//
			this.contents.remove(item);
			item.parent = null;

			// update
			//
			if (this.onRemove) {
				this.onRemove(item);
			}

			// perform callback
			//
			if (options && options.success) {
				options.success(item);
			}
		} else {

			// load directory contents
			//
			this.load({

				// callbacks
				//
				success: () => {
					this.removeItem(item, options);
				}
			});
		}	
	},

	removeItems: function(items, options) {
		let count = 0;

		function removeItem(item, directory) {
			directory.removeItem(item, {

				// callbacks
				//
				success: () => {

					// check if we are finished
					//
					count++;
					if (count == items.length) {

						// perform callback
						//
						if (options && options.success) {
							options.success(items);
						}	
					}
				}
			});
		}

		// remove items individually
		//
		for (let i = 0; i < items.length; i++) {
			removeItem(items[i], this);
		}
	},

	//
	// loading methods
	//

	load: function(options) {

		// set state
		//
		this.loading = true;

		// fetch directory contents
		//
		return this.fetchContents({
			search: options.search,
			recursive: options.recursive,
			details: options.details,

			// callbacks
			//
			success: (data) => {
				import(
					'../../../collections/storage/items.js'
				).then((Items) => {

					// create contents
					//
					this.setContents(Items.default.toItems(data));

					// update state
					//
					this.loaded = true;
					this.loading = false;

					// perform callback
					//
					if (options && options.success) {
						options.success(this);
					}
				});
			},

			error: (response) => {

				// perform callback
				//
				if (options && options.error) {
					options.error(this, response);
				} else {

					// show error message
					//
					application.error({
						icon: '<i class="fa fa-folder"></i>',
						title: "Directory Loading Error",
						message: "Could not get contents of '" + this.getName() + "'.",
						response: response
					});
				}
			}
		});
	},

	//
	// fetching methods
	//

	fetchDirectory: function(name, options) {
		if (this.loaded) {

			// check directory contents
			//
			let item = this.getItemNamed(name);

			// perform callback
			//
			if (item) {
				item.load(options);
			} else {

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}
			}
		} else {

			// load directory contents
			//
			return this.load({
				
				// callbacks
				//
				success: () => {
					this.fetchDirectory(name, options);
				},

				error: () => {
					if (options && options.error) {
						options.error();
					}
				}
			});
		}
	},

	fetchFiles: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/files' + (options && options.recursive? '/all' : ''),
			type: 'GET',
			data: _.extend(this.getData(), options.search)
		}));
	},

	fetchNumFiles: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/files' + (options && options.recursive? '/all' : '') + '/num',
			type: 'GET',
			data: _.extend(this.getData(), options.search)
		}));
	},

	fetchDirectories: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/directories' + (options && options.recursive? '/all' : ''),
			type: 'GET',
			data: _.extend(this.getData(), options.search)
		}));
	},

	fetchNumDirectories: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/directories' + (options && options.recursive? '/all' : '') + '/num',
			type: 'GET',
			data: _.extend(this.getData(), options.search)
		}));
	},

	fetchContents: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/contents' + (options && options.recursive? '/all' : ''),
			type: 'GET',
			data: _.extend(this.getData(), options.search, options.details? {
				details: this.getDetailsAttributes(options.details).join(',')
			} : {})
		}));
	},

	fetchNumContents: function(options) {
		return $.ajax(_.extend(options, {
			url: this.urlRoot + '/contents' + (options && options.recursive? '/all' : '') + '/num',
			type: 'GET',
			data: _.extend(this.getData(), options.search)
		}));
	},
	
	//
	// clearing methods
	//

	clear: function(options) {

		// clear items
		//
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/clear',
			type: 'POST',
			data: this.getData(),

			// callbacks
			//
			success: () => {
				this.setContents([]);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			},
		}));
	},

	clearAll: function(options) {
		let count = this.contents? this.contents.length : 0;

		// recursively clear items
		//
		function clearItem(item, directory) {
			item.destroy({

				// callbacks
				//
				success: () => {

					// check if directory is empty
					//
					count--;
					if (count == 0) {

						// update counts
						//
						directory.clearCounts();

						// perform callback
						//
						if (options && options.success) {
							options.success(directory);
						}
					}
				}, 

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not clear items. " + (response.responseText && response.status != 500? response.responseText : '')
					});
				}
			});			
		}

		if (this.loaded) {

			// destroy items
			//
			if (this.contents.length > 0) {
				while (this.contents.length > 0) {
					clearItem(this.contents.at(this.contents.length - 1), this);
				}
			} else {

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		} else {
			this.load({

				// callbacks
				//
				success: (directory) => directory.clearAll(options),

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not load contents. " + (response.responseText && response.status != 500? response.responseText : '')
					});
				}
			});
		}
	},

	//
	// event handling methods
	//

	onAdd: function() {
		this.set('is_empty', this.contents.length == 0);
	},

	onRemove: function() {
		this.set('is_empty', this.contents.length == 0);
	}
};