/******************************************************************************\
|                                                                              |
|                              file-info-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a file.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemInfoView from '../../../../../views/apps/file-browser/forms/info/item-info-view.js';
import FileInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/files/file-info-pane-view.js';
import FileIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';

export default ItemInfoView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "History",
			"icon": "fa fa-calendar-alt"
		},
		{
			"name": "Permissions",
			"icon": "fa fa-lock"
		},
		{
			"name": "Place",
			"icon": "fa fa-map-pin"
		},
		{
			"name": "Sharing",
			"icon": "fa fa-share"
		},
		{
			"name": "Links",
			"icon": "fa fa-link"
		}
	],

	//
	// getting methods
	//

	getIconView: function() {
		return FileIconView;
	},

	//
	// rendering methods
	//

	showGeneralInfo: function() {
		this.showChildView('general', new FileInfoPaneView({
			model: this.model,
			kind: 'File'
		}));
	}
});