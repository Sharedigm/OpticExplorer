/******************************************************************************\
|                                                                              |
|                              directory-page-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory page and name.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemPageView from '../../../../../../views/apps/file-browser/mainbar/files/pages/item-page-view.js';
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default ItemPageView.extend(_.extend({}, FileDroppable, {

	//
	// attributes
	//

	attributes: {
		'data-drop-effect': 'move'
	},

	events: _.extend({}, ItemPageView.prototype.events, FileDroppable.events),

	//
	// attribute methods
	//

	className: function() {
		let name = '';

		switch (this.model.get('path')) {
			case '/':
				name = 'home';
				break;
			case '.Clipboard/':
				name = 'clipboard';
				break;
			case 'Trash/':
				name = 'trash';
				break;
		}

		// add 'system'
		//
		if (this.isHidden()) {
			if (name != '') {
				name += ' ';
			}
			name += 'system';
		}

		// add 'directory item'
		//
		if (name != '') {
			name += ' ';
		}
		name += 'directory item';

		return name;
	},

	//
	// getting methods
	//

	getSpecialIconName: function(icons) {
		if (typeof icons.icon == 'string') {
			return icons.icon;
		}

		// select empty or full icon, defaulting to empty
		//
		if (this.model.isEmpty()) {
			return icons.icon[0];
		} else if (this.model.isFull()) {
			return icons.icon[1];
		} else {
			return icons.icon[0];
		}
	},

	getCustomIconName: function(icons) {
		if (typeof icons.icon == 'string') {
			return icons.icon;
		}

		// select empty or full icon, defaulting to full
		//
		if (this.model.isEmpty()) {
			return icons.icon[0];
		} else {
			return icons.icon[1];
		}
	},

	getDefaultIconName: function() {
		if (this.model.isAudioAlbum()) {
			return config.files.folders.albums.audio.icon;
		} else if (this.model.isImageAlbum()) {
			return config.files.folders.albums.image.icon;
		} else if (this.model.isVideoAlbum()) {
			return config.files.folders.albums.video.icon;
		} else if (this.model.isEmpty()) {
			return config.files.folders.icon[0];
		} else {
			return config.files.folders.icon[1];
		}
	},

	getIconName: function() {
		let name = this.model.getName().toTitleCase();
		let icons = config.files.folders.names[name];

		// return special, custom or default icon name
		//
		if (icons && (name == 'Trash' || name == '.Clipboard')) {
			return this.getSpecialIconName(icons);
		} else if (icons) {
			return this.getCustomIconName(icons);
		} else {
			return this.getDefaultIconName();
		}
	},

	getIconUrl: function() {
		return config.servers.images + '/' + this.constructor.getIconPath() + '/' + this.getIconName();
	},

	getCustomIconId: function(icons) {
		let icon;
		if (typeof icons.icon == 'string') {
			icon = icons.icon;
		} else {

			// select empty or full icon
			//
			if (this.model.isEmpty()) {
				icon = icons.icon[0];
			} else if (this.model.isFull()) {
				icon = icons.icon[1];
			} else {
				icon = icons.icon[0];
			}
		}

		let extension = FileUtils.getFileExtension(icon);
		return icon.replace('.' + extension, '-icon');
	},

	getDefaultIconId: function() {
		if (this.model.isAudioAlbum()) {
			return 'audio-album-icon';
		} else if (this.model.isImageAlbum()) {
			return 'image-album-icon';
		} else if (this.model.isVideoAlbum()) {
			return 'video-album-icon';
		} else if (this.model.isEmpty()) {
			return 'folder-empty-icon';
		} else {
			return 'folder-full-icon';
		}
	},

	getIconId: function() {
		let name = this.model.getName().toTitleCase();
		let icons = config.files.folders.names[name];

		// return custom or standard icon id
		//
		if (icons) {
			return this.getCustomIconId(icons);
		} else {
			return this.getDefaultIconId();
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// handle parent's drop on child callback
		//
		if (this.hasParentView('items') && this.getParentView('items').onDropOnChild) {
			this.getParentView('items').onDropOnChild(items, this, {

				// callbacks
				//
				success: () => this.unhighlight()
			});
		} else {
			this.unhighlight();
		}
	}
}), {

	//
	// static methods
	//

	getIconPath: function() {
		return 'icons/folders' + (application.isBinaryTheme()? '-binary' : '');
	}
});