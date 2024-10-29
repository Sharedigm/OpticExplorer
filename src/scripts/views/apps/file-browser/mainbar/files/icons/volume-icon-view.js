/******************************************************************************\
|                                                                              |
|                              volume-icon-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a volume icon and name.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';

export default FileIconView.extend(_.extend({}, FileDroppable, {

	//
	// attributes
	//

	events: _.extend({}, FileIconView.prototype.events, FileDroppable.events),

	//
	// attribute methods
	//

	className: function() {
		return "volume item";
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

	getIconUrl: function() {
		return config.servers.images + '/' + this.constructor.getIconPath() + '/' + this.getIconName();
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

	getIconId: function() {
		let extension = this.model.getFileExtension();
		return extension + '-volume-icon';
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