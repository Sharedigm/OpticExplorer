/******************************************************************************\
|                                                                              |
|                              volume-info-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a volume.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import ItemInfoView from '../../../../../views/apps/file-browser/forms/info/item-info-view.js';
import DirectoryInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/directories/directory-info-pane-view.js';
import S3VolumeInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/volumes/s3-volume-info-pane-view.js';
import FtpVolumeInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/volumes/ftp-volume-info-pane-view.js';
import SftpVolumeInfoPaneView from '../../../../../views/apps/file-browser/forms/info/panes/volumes/sftp-volume-info-pane-view.js';
import VolumeIconView from '../../../../../views/apps/file-browser/mainbar/files/icons/volume-icon-view.js';

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
			"name": "Volume",
			"icon": "fa fa-database"
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
		return VolumeIconView;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ItemInfoView.prototype.onRender.call(this);

		// show audio info
		//
		this.model.read({

			// callbacks
			//
			success: (data) => {
				this.showVolumeInfo(new BaseModel(JSON.parse(data)));
			}
		});
	},

	showGeneralInfo: function() {
		this.showChildView('general', new DirectoryInfoPaneView({
			model: this.model,
			kind: 'Volume'
		}));
	},

	showVolumeInfo: function(model) {
		switch (this.model.getFileExtension()) {
			case 's3':
				this.showS3VolumeInfo(model);
				break;
			case 'ftp':
				this.showFtpVolumeInfo(model);
				break;
			case 'sftp':
				this.showSftpVolumeInfo(model);
				break;
		}
	},

	showS3VolumeInfo: function(model) {
		this.showChildView('volume', new S3VolumeInfoPaneView({
			model: model
		}));
	},

	showFtpVolumeInfo: function(model) {
		this.showChildView('volume', new FtpVolumeInfoPaneView({
			model: model
		}));
	},

	showSftpVolumeInfo: function(model) {
		this.showChildView('volume', new SftpVolumeInfoPaneView({
			model: model
		}));
	}
});