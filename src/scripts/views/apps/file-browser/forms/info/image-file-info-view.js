/******************************************************************************\
|                                                                              |
|                           image-file-info-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about an image            |
|        file.                                                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileInfoView from '../../../../../views/apps/file-browser/forms/info/file-info-view.js';
import ImageInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/image-files/image-info-pane-view.js';
import ImageExifPaneView from '../../../../../views/apps/file-browser/forms/info/panes/image-files/image-exif-pane-view.js';
import ImageFileHistoryPaneView from '../../../../../views/apps/file-browser/forms/info/panes/image-files/image-file-history-pane-view.js';

export default FileInfoView.extend({

	//
	// attributes
	//

	className: 'form-vertical',

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "Photo",
			"icon": "fa fa-camera"
		},
		{
			"name": "Info",
			"icon": "fa fa-table"
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
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'photo':
				this.showPhotoInfo();
				break;
			case 'info':
				this.showExifInfo();
				break;
			default:
				FileInfoView.prototype.showRegion.call(this, name);
		}
	},

	showPhotoInfo: function() {
		this.showChildView('photo', new ImageInfoPaneView({
			model: this.model
		}));
	},

	showExifInfo: function() {
		this.showChildView('info', new ImageExifPaneView({
			model: this.model
		}));
	},

	showHistoryInfo: function() {
		this.showChildView('history', new ImageFileHistoryPaneView({
			model: this.model
		}));
	}
});