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
import FileTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/file-tile-view.js';
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
let TileTemplate = 	
	'<svg' +
	'	xmlns:svg="http://www.w3.org/2000/svg"' +
	'	xmlns="http://www.w3.org/2000/svg"' +
	'	viewBox="0 16 48 48">' +
	'	' +
	'	<g transform="translate(24,24),scale(0.5),translate(-24,-24)">' +
	'		<g transform="translate(0,26)">' +
	'			<%= icon %>' +
	'		</g>' +
	'	</g>' +
	'</svg>';

export default FileTileView.extend(_.extend({}, FileDroppable, {

	//
	// attributes
	//

	events: _.extend({}, FileTileView.prototype.events, FileDroppable.events),

	//
	// attribute methods
	//

	className: function() {
		return 'volume item';
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
	
	getIconName: function() {

		// get icon by file extension
		//
		let extension = this.model.getFileExtension().toLowerCase();

		// get icon
		//
		if (config.files.volumes.extensions[extension]) {
			return config.files.volumes.extensions[extension].icon;
		} else {
			return config.files.volumes.icon;
		}
	},

	getIconUrl: function() {
		return config.servers.images + '/' + this.constructor.getIconPath() + '/' + this.getIconName();
	},

	getIconId: function() {
		let extension = this.model.getFileExtension();
		return extension + '-volume-icon';
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
		return 'icons/volumes' + (application.isBinaryTheme()? '-binary' : '');
	}
});