/******************************************************************************\
|                                                                              |
|                               file-tile-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file tile and name.                          |
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
import ItemTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/item-tile-view.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default ItemTileView.extend({

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

		// add formatting
		//
		if (this.isPdf()) {
			name += ' letterboxed';
		}

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

	isVector: function() {
		return this.model.getFileExtension() == 'svg';
	},

	isPdf: function() {
		return this.model.getFileExtension() == 'pdf';
	},

	isLetterboxed: function() {
		return this.parent.options.letterboxed || this.isPdf();
	},

	hasThumbnail: function() {
		return (!this.options.preferences || this.options.preferences.get('show_thumbnails')) && this.model.hasThumbnail();
	},
	
	canShowThumbnail: function() {
		let size = this.model.get('size');
		if (size != undefined) {
			let maxSize = config.apps.file_browser.max_thumbnail_file_size;
			
			if (this.isVector()) {
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
		let tileSize = this.parent.options.preferences? this.parent.options.preferences.get('tile_size') : undefined;
		if (this.isLetterboxed()) {
			return this.model.getThumbnailUrl({
				max_size: Math.floor(this.constructor.getTileResolution(tileSize) * (window.devicePixelRatio || 1))
			});
		} else {
			return this.model.getThumbnailUrl({
				min_size: Math.floor(this.constructor.getTileResolution(tileSize) * (window.devicePixelRatio || 1))
			});
		}
	},
	
	getThumbnail: function() {
		if (this.model.getFileExtension().toLowerCase() == 'svg') {
			return '<div class="thumbnail svg" style="background-image:url(' + this.model.getUrl() + ')"></div>';
		} else {
			return '<div class="thumbnail photo" style="background-image:url(' + this.getThumbnailUrl() + ')"></div>';
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
			let extension = FileUtils.getFileExtension(name).toLowerCase();

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

			// get id by file name
			//
			return name + '-file-tile';
		} else {
			
			// get id by file extension
			//
			let extension = FileUtils.getFileExtension(name).toLowerCase();
			return extension + '-file-tile';
		}
	},

	getSvgIcon: function() {
		let name = this.model.getName().toLowerCase();
		if (config.files.files.names[name]) {

			// get icon by file name
			//
			this.id = name + '-file-tile';
			return this.getSvg(config.servers.images + '/' + this.constructor.getIconPath() + '/' + config.files.files.names[name].icon, this.id);
		} else {
			
			// get icon by file extension
			//
			let extension = FileUtils.getFileExtension(name).toLowerCase();
			this.id = extension + '-file-tile';

			// get icon
			//
			if (config.files.files.extensions[extension]) {
				return this.getSvg(config.servers.images + '/' + this.constructor.getIconPath() + '/' + config.files.files.extensions[extension].icon, this.id);
			} else {
				return this.getSvg(config.servers.images + '/' + this.constructor.getIconPath() + '/' + config.files.files.icon, this.id);
			}
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
		ItemTileView.prototype.setName.call(this, name);
	},

	setTileColor: function(color) {
		this.$el.find('.tile .icon').css('background-color', color || '');
	}
}, {

	//
	// static methods
	//

	getIconPath: function() {
		return 'tiles/files' + (application.isBinaryTheme()? '-binary' : '');
	},

	getTileResolution: function(tileSize) {
		switch (tileSize || 'medium') {
			case 'small':
				return 75;
			case 'medium':
				return 100;
			case 'large':
				return 150;
		}
	}
});