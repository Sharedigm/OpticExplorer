/******************************************************************************\
|                                                                              |
|                              directory-tile-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory tile and name.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/item-tile-view.js';
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

let TileTemplate = `
	<svg
		xmlns:svg="http://www.w3.org/2000/svg"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 16 48 48">

		<g transform="translate(24,24),scale(0.6),translate(-24,-24)">
			<g transform="translate(0,24)">
				<%= icon %>
			</g>
		</g>
	</svg>
`;

export default ItemTileView.extend(_.extend({}, FileDroppable, {

	//
	// attributes
	//

	attributes: {
		'data-drop-effect': 'move'
	},

	events: _.extend({}, ItemTileView.prototype.events, FileDroppable.events),

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

	getName: function() {
		return this.model.getName() || 'Home';
	},

	getCustomIconName: function(name, icons) {

		// use for custom icon
		//
		if (typeof icons.icon == 'string') {
			return icons.icon;
		}

		if (name == 'Trash' || name == '.Clipboard') {

			// select empty or full icon, defaulting to empty
			//
			if (this.model.isEmpty()) {
				return icons.icon[0];
			} else if (this.model.isFull()) {
				return icons.icon[1];
			} else {
				return icons.icon[0];
			}
		} else {

			// select empty or full icon, defaulting to full
			//
			if (this.model.isEmpty()) {
				return icons.icon[0];
			} else {
				return icons.icon[1];
			}
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

		if (icons) {
			return this.getCustomIconName(name, icons);
		} else {
			return this.getDefaultIconName();
		}
	},

	getIconUrl: function() {
		return config.servers.images + '/' + this.constructor.getIconPath() + '/' + this.getIconName();
	},

	getSpecialIconId: function(icons) {
		let icon;
		if (typeof icons.icon == 'string') {
			icon = icons.icon;
		} else {

			// select empty or full icon, defaulting to empty
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
		return icon.replace('.' + extension, '-tile');
	},

	getCustomIconId: function(icons) {
		let icon;
		if (typeof icons.icon == 'string') {
			icon = icons.icon;
		} else {

			// select empty or full icon, defaulting to full
			//
			if (this.model.isEmpty()) {
				icon = icons.icon[0];
			} else {
				icon = icons.icon[1];
			}
		}

		let extension = FileUtils.getFileExtension(icon);
		return icon.replace('.' + extension, '-tile');
	},

	getDefaultIconId: function() {
		if (this.model.isEmpty()) {
			return 'folder-empty-tile';
		} else if (this.model.isAudioAlbum()) {
			return 'audio-album-tile';
		} else if (this.model.isImageAlbum()) {
			return 'image-album-tile';
		} else if (this.model.isVideoAlbum()) {
			return 'video-album-tile';
		} else if (this.model.isFull()) {
			return 'folder-full-tile';
		} else {
			return 'folder-empty-tile';
		}
	},

	getIconId: function() {
		let name = this.model.getName().toTitleCase();
		let icons = config.files.folders.names[name];

		// return special, custom or default icon id
		//
		if (icons && (name == 'Trash' || name == '.Clipboard')) {
			return this.getSpecialIconId(icons);
		} else if (icons) {
			return this.getCustomIconId(icons);
		} else {
			return this.getDefaultIconId();
		}
	},

	getSvgIcon: function() {
		return TileTemplate.replace('<%= icon %>', ItemTileView.prototype.getSvgIcon.call(this));
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