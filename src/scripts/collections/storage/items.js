/******************************************************************************\
|                                                                              |
|                                   items.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of files and directories.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Item from '../../models/storage/item.js';
import File from '../../models/storage/files/file.js';
import Directory from '../../models/storage/directories/directory.js';
import Volume from '../../models/storage/directories/volume.js';
import ArchiveFile from '../../models/storage/files/archive-file.js';
import PdfFile from '../../models/storage/files/pdf-file.js';
import AudioFile from '../../models/storage/media/audio-file.js';
import ImageFile from '../../models/storage/media/image-file.js';
import VideoFile from '../../models/storage/media/video-file.js';
import MapFile from '../../models/storage/files/map-file.js';
import GeolocatableCollection from '../../collections/places/geolocatable-collection.js';

export default GeolocatableCollection.extend({

	//
	// attributes
	//

	model: Item,

	//
	// querying methods
	//

	contains: function(model) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i) == model) {
				return true;
			}
		}
		return false;
	},

	containsPath: function(path) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('path') == path) {
				return true;
			}
		}
		return false;
	},

	indexOfPath: function(path) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('path') == path) {
				return i;
			}
		}		
	},

	//
	// counting methods
	//

	hasItems: function(type) {
		return this.some(this.constructor.filters['is_' + type]);
	},

	numItems: function(type) {
		return this.filter(this.constructor.filters['is_' + type]).length;
	},
	
	//
	// getting methods
	//

	getItems: function(type) {
		return this.filter(this.constructor.filters['is_' + type]);
	},

	getNames: function() {
		let names = [];
		for (let i = 0; i < this.length; i++) {
			names.push(this.at(i).getName());
		}
		return names;
	},

	getContainedBy: function(directory) {
		let path = directory.get('path');
		let items = [];
		for (let i = 0; i < this.length; i++) {
			let item = this.at(i);
			if (item.has('path') && item.get('path').startsWith(path)) {
				items.push(item);
			}
		}
		return items;
	},

	getNotContainedBy: function(directory) {
		let path = directory.get('path');
		let items = [];
		for (let i = 0; i < this.length; i++) {
			let item = this.at(i);
			if (item.has('path') && !item.get('path').startsWith(path)) {
				items.push(item);
			}
		}
		return items;
	},

	//
	// sorting methods
	//

	comparator: function(a, b) {
		let name1 = a.getName();
		
		// check for special names
		//
		if (name1 == '' || name1 == 'Home') {
			return -1;
		}
		if (name1 == 'Trash') {
			return 1;
		}

		// sort by name
		//
		let name2 = b.getName();
		if (name1 < name2) {
			return -1;
		} else if (name1 == name2) {
			return 0;
		} else {
			return 1;
		}
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {
		for (let i = 0; i < response.length; i++) {
			response[i] = this.constructor.toItem(response[i]);
		}

		return response;
	}
}, {

	//
	// static attributes
	//

	filters: _.extend({}, GeolocatableCollection.filters, {

		// directory types
		//
		is_directory: (model) => model instanceof Directory,
		is_volume: (model) => model instanceof Volume,

		// file types
		//
		is_file: (model) => model instanceof File,
		is_pdf: (model) => model instanceof PdfFile,

		// media types
		//
		is_audio: (model) => model instanceof AudioFile,
		is_image: (model) => model instanceof ImageFile,
		is_video: (model) => model instanceof VideoFile,

		// image types
		//
		is_visual: (model) => model instanceof ImageFile || 
			model instanceof VideoFile,
		is_non_visual: (model) => !(model instanceof ImageFile) && 
			!(model instanceof VideoFile),

		// file attachements
		//
		is_attached: (model) => model.isAttached(),
		is_unattached: (model) => !model.isAttached()
	}),

	//
	// static methods
	//

	toItemClass: function(path) {

		// directories
		//
		if (Directory.isValidPath(path)) {
			return Directory;
		} else if (Volume.isValidPath(path)) {
			return Volume;

		// special files
		//
		} else if (ArchiveFile.isValidPath(path)) {
			return ArchiveFile;
		} else if (PdfFile.isValidPath(path)) {
			return PdfFile;

		// media files
		//
		} else if (AudioFile.isValidPath(path)) {
			return AudioFile;
		} else if (ImageFile.isValidPath(path)) {
			return ImageFile;
		} else if (VideoFile.isValidPath(path)) {
			return VideoFile;
		} else if (MapFile.isValidPath(path)) {
			return MapFile;

		// files
		//
		} else {
			return File;
		}
	},

	toClassName: function(item) {

		// directories
		//
		if (item instanceof Directory) {
			return 'directory';
		} else if (item instanceof Volume) {
			return 'volume';

		// special files
		//
		} else if (item instanceof ArchiveFile) {
			return 'archive file';
		} else if (item instanceof PdfFile) {
			return 'pdf file';

		// media files
		//
		} else if (item instanceof AudioFile) {
			return 'audio file';
		} else if (item instanceof ImageFile) {
			return 'image file';
		} else if (item instanceof VideoFile) {
			return 'video file';
		} else if (item instanceof MapFile) {
			return 'map file';

		// files
		//
		} else {
			return 'file';
		}
	},

	toItem: function(data) {
		let itemClass = this.toItemClass(data.path);
		return new itemClass(data, {
			parse: true
		});
	},

	toItems: function(data) {
		let items = [];

		for (let i = 0; i < data.length; i++) {
			items.push(this.toItem(data[i]));
		}

		return items;
	}
});