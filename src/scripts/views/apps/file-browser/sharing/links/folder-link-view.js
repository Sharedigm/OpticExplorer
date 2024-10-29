/******************************************************************************\
|                                                                              |
|                              folder-link-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show info about a link to a folder.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import Items from '../../../../../collections/storage/items.js';
import LinkView from '../../../../../views/apps/file-browser/sharing/links/link-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';
import Url from '../../../../../utilities/web/url.js';

export default LinkView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-folder"></i>Shared Folder</h1>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<br />
		
			<% if (message) { %>
			<p><%= username.capitalized() %> has shared the folder '<%= dirname %>' with you along with the following message: </p>
			<div class="well"><%= message %></div>
			<% } else { %>
			<p><%= username.capitalized() %> has shared the folder '<%= dirname %>' with you. </p>
			<% } %>
		
			<div class="buttons">
				<button class="view-images btn btn-lg" style="display:none">
					<i class="fa fa-image"></i>View Images
				</button>
				<button class="view-map btn btn-lg" style="display:none">
					<i class="fa fa-map"></i>View Map
				</button>
				<button class="open-folder btn btn-lg btn-primary">
					<i class="fa fa-folder"></i>Open Folder
				</button>
				<button class="download-folder btn btn-lg">
					<i class="fa fa-cloud-download-alt"></i>Download Folder
				</button>
			</div>
		</div>
	`),

	events: {
		'click .view-images': 'onClickViewImages',
		'click .view-map': 'onClickViewMap',
		'click .open-folder': 'onClickOpenFolder',
		'click .download-folder': 'onClickDownloadFolder'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			username: this.model.get('user').getName('short'),
			message: HtmlUtils.encode(this.model.get('message')),
			dirname: this.model.getDirectoryName()
		};
	},

	//
	// loading methods
	//

	loadDirectory: function(options) {
		new Directory({
			link: this.model
		}).load({

			// callbacks
			//
			success: (model) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			}
		});
	},

	//
	// downloading methods
	//

	downloadFolder: function(link, options) {

		// download folder
		//
		link.download({
			icon: options && options.icon? options.icon : '<i class="fa fa-cloud-download"></i>',
			title: options && options.title? options.title : "Downloading Folder",

			// callbacks
			//
			success: () => {

				// go to folder downloaded view
				//
				application.navigate('links/downloaded?folder=' + Url.encode(link.getDirectoryName()), {
					trigger: true
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		LinkView.prototype.onRender.call(this);

		// load directory
		//
		this.loadDirectory({

			// callbacks
			//
			success: (directory) => {
				this.onLoad(directory);
			}
		});
	},

	//
	// dialog rendering methods
	//

	showFileBrowser: function(directory) {

		// launch file browser
		//
		application.launch('file_browser', {
			model: directory,
			defaults: {
				show_sidebar: false
			}
		}, {
			maximized: true
		});
	},

	showImageViewer: function(imageFile) {

		// launch image viewer
		//
		application.launch('image_viewer', {
			model: imageFile
		}, {
			maximized: true
		});
	},

	showMapViewer: function(imageFiles) {

		// launch map viewer
		//
		application.launch('map_viewer', {
			photos: imageFiles
		}, {
			maximized: true
		});
	},

	//
	// event handling methods
	//

	onLoad: function(directory) {
		this.directory = directory;

		// show map button
		//
		if (this.directory.hasItems(Items.filters.is_geolocated)) {
			this.$el.find('.view-map').show();
			this.$el.find('.buttons .btn-primary').removeClass('btn-primary');
			this.$el.find('.view-map').addClass('btn-primary');
		}

		// show images button
		//
		if (this.directory.hasItems(Items.filters.is_image)) {
			this.$el.find('.view-images').show();
			this.$el.find('.buttons .btn-primary').removeClass('btn-primary');
			this.$el.find('.view-images').addClass('btn-primary');
		}
	},

	//
	// mouse event handling methods
	//

	onClickViewImages: function() {

		// show image viewer
		//
		this.showImageViewer(this.directory.contents.filter(Items.filters.is_image)[0]);
	},

	onClickViewMap: function() {

		// show map viewer
		//
		this.showMapViewer(this.directory.contents.filter(Items.filters.is_geolocated));
	},

	onClickOpenFolder: function() {

		// show file browser
		//
		this.showFileBrowser(new Directory({
			link: this.model
		}));
	},

	onClickDownloadFolder: function() {
		this.downloadFolder(this.model);
	}
});