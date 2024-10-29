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

	template: template(`
		<div class="items">
			<div class="icon-grid"></div>
		</div>
		
		<ul class="nav nav-tabs" role="tablist">
			
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>
		
			<li role="presentation" class="volume tab<% if (tab == 'volume') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".volume.tab-pane">
					<i class="fa fa-database"></i>
					<label>Volume</label>
				</a>
			</li>
		
			<% if (show_meta_info) { %>
			<li role="presentation" class="history tab<% if (tab == 'history') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".history.tab-pane">
					<i class="fa fa-calendar-alt"></i>
					<label>History</label>
				</a>
			</li>
			<% } %>
		
			<% if (show_meta_info) { %>
			<li role="presentation" class="permissions tab<% if (tab == 'permissions') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".permissions.tab-pane">
					<i class="fa fa-lock"></i>
					<label>Permissions</label>
				</a>
			</li>
			<% } %>
		
			<% if (show_meta_info) { %>
			<li role="presentation" class="sharing tab<% if (tab == 'sharing') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".sharing.tab-pane">
					<i class="fa fa-share"></i>
					<label>Sharing</label>
				</a>
			</li>
			<% } %>
		
			<% if (show_meta_info) { %>
			<li role="presentation" class="links tab<% if (tab == 'links') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".links.tab-pane">
					<i class="fa fa-link"></i>
					<label>Links</label>
				</a>
			</li>
			<% } %>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="volume tab-pane<% if (tab == 'volume') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="history tab-pane<% if (tab == 'history') { %> active<% } %>">
			</div>
			
			<div role="tabpanel" class="permissions tab-pane<% if (tab == 'permissions') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="sharing tab-pane<% if (tab == 'sharing') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="links tab-pane<% if (tab == 'links') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
		general: '.general.tab-pane',
		volume: '.volume.tab-pane',
		history: '.history.tab-pane',
		permissions: '.permissions.tab-pane',
		sharing: '.sharing.tab-pane',
		links: '.links.tab-pane'
	},

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