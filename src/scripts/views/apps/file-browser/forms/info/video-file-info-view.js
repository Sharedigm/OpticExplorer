/******************************************************************************\
|                                                                              |
|                            video-file-info-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a video file.       |
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
import VideoInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/video-files/video-info-pane-view.js';

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
			"name": "Video",
			"icon": "fa fa-video"
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

	showRegion: function(name) {
		switch (name) {
			case 'video':
				this.showVideoInfo();
				break;
			default:
				FileInfoView.prototype.showRegion.call(this, name);
		}
	},

	showVideoInfo: function() {
		this.showChildView('video', new VideoInfoPaneView({
			model: this.model
		}));
	}
});