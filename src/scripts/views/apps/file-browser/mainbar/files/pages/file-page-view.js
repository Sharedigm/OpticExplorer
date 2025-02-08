/******************************************************************************\
|                                                                              |
|                               file-page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file page and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AudioFile from '../../../../../../models/storage/media/audio-file.js';
import ImageFile from '../../../../../../models/storage/media/image-file.js';
import VideoFile from '../../../../../../models/storage/media/video-file.js';
import ItemPageView from '../../../../../../views/apps/file-browser/mainbar/files/pages/item-page-view.js';

export default ItemPageView.extend({

	//
	// attribute methods
	//

	className: function() {
		let name = '';

		// add system tag
		//
		if (this.isHidden()) {
			name += 'system';
		}

		// tag media file icons
		//
		if (this.model instanceof AudioFile) {
			if (name != '') {
				name += ' ';
			}
			name += 'audio';
		} else if (this.model instanceof ImageFile) {
			if (name != '') {
				name += ' ';
			}
			name += 'image';
		} else if (this.model instanceof VideoFile) {
			if (name != '') {
				name += ' ';
			}
			name += 'video';
		}

		// add 'file item'
		//
		if (name != '') {
			name += ' ';
		}
		name += 'file item';

		// add preview tag
		//
		if (this.model.hasThumbnail()) {
			if (name != '') {
				name += ' ';
			}
			name += 'preview';
		}

		return name;
	},

	//
	// querying methods
	//

	hasThumbnail: function() {
		return (!this.options.preferences || this.options.preferences.get('show_thumbnails')) && this.model.hasThumbnail();
	},

	canShowThumbnail: function() {
		let size = this.model.get('size');
		if (size != undefined) {
			let maxSize = config.apps.file_browser.max_thumbnail_file_size;
			
			if (this.model.getFileExtension() == 'svg') {
				let maxSvgSize = config.apps.file_browser.max_thumbnail_svg_file_size;
				if (size > maxSvgSize) {
					return false;
				}
			}

			return size < maxSize;
		}
	},
	
	//
	// getting methods
	//

	getName: function() {
		if (this.options.preferences && this.options.preferences.get('show_file_extensions')) {
			return this.model.getName();
		} else {
			return this.model.getBaseName();
		}
	},

	getThumbnailUrl: function() {
		return this.model.getThumbnailUrl({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},
	
	getThumbnail: function() {
		if (this.model.getFileExtension().toLowerCase() == 'svg') {
			return '<img class="thumbnail svg" src="' + this.model.getUrl() + '" />';
		} else if (this.model instanceof ImageFile) {
			return '<img class="' + (this.model.hasPageOrientation()? this.model.getPageOrientation() : '') + ' photo thumbnail" src="' + this.model.getUrl() + '" />';
		} else {
			return '<img class="thumbnail photo" src="' + this.getThumbnailUrl() + '" />';
		}
	},

	getIconName: function() {
		let name = this.model.getName().toLowerCase();

		if (config.files.files.names[name]) {

			// get icon by file name
			//
			return config.files.files.names[name].icon;
		} else {

			// get icon by file extension
			//
			let extension = this.model.getFileExtension().toLowerCase();

			// get icon
			//
			if (config.files.files.extensions[extension]) {
				return config.files.files.extensions[extension].icon;
			} else {
				return config.files.files.icon;
			}
		}
	},

	getIconUrl: function() {
		return config.servers.images + '/' + this.constructor.getIconPath() + '/' + this.getIconName();
	},

	getIconId: function() {
		let name = this.model.getName().toLowerCase();

		if (config.files.files.names[name]) {

			// get icon by file name
			//
			return name + '-file-icon';
		} else {

			// get icon by file extension
			//
			let extension = this.model.getFileExtension().toLowerCase();
			return extension + '-file-icon';
		}			
	},

	//
	// setting methods
	//

	setName: function(name) {

		// append extension if hiding extensions
		//
		if (!this.options.preferences.get('show_file_extensions')) {
			let extension = this.model.getFileExtension();
			if (extension) {
				name = name + '.' + extension;
			}
		}

		// call superclass method
		//
		ItemPageView.prototype.setName.call(this, name);
	}
}, {
	
	//
	// static methods
	//

	getIconPath: function() {
		return 'icons/files' + (application.isBinaryTheme()? '-binary' : '');
	}
});