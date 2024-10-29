/******************************************************************************\
|                                                                              |
|                              volume-item-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a volume within a directory list.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryItemView from '../../../../../../views/apps/file-browser/mainbar/files/lists/directory-item-view.js';

export default DirectoryItemView.extend({

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
	
	getIcon: function() {
		return '<i class="fa fa-database"></i>';
	}
});