/******************************************************************************\
|                                                                              |
|                              gallery-link-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show info about a link to a gallery.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Items from '../../../../../collections/storage/items.js';
import FolderLinkView from '../../../../../views/apps/file-browser/sharing/links/folder-link-view.js';
import ImageGalleryView from '../../../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-view.js';
import Browser from '../../../../../utilities/web/browser.js';

export default FolderLinkView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-image"></i>Shared Image Gallery</h1>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<br />
		
			<% if (message) { %>
			<p><%= username.capitalized() %> has shared the image gallery '<%= dirname %>' with you along with the following message: </p>
			<div class="well"><%= message %></div>
			<% } else { %>
			<p><%= username.capitalized() %> has shared the folder '<%= dirname %>' with you. </p>
			<% } %>
		
			<div class="buttons">
				<button class="open-images btn btn-primary btn-lg">
					<i class="fa fa-image"></i>Open Images
				</button>
				<button class="open-map btn btn-lg" style="display:none">
					<i class="fa fa-map"></i>Open Map
				</button>
				<button class="open-folder btn btn btn-lg">
					<i class="fa fa-folder"></i>Open Folder
				</button>
				<button class="download-images btn btn-lg">
					<i class="fa fa-cloud-download-alt"></i>Download Images
				</button>
			</div>
		
			<div class="gallery well loading">
				<div class="spinner"></div>
			</div>
		</div>
	`),

	regions: {
		header: '.user-profile-header',
		gallery: '.gallery'
	},

	events: {
		'mousedown': 'onMouseDown',
		'click .open-images': 'onClickOpenImages',
		'click .open-map': 'onClickOpenMap',
		'click .view-slide-show': 'onClickViewSlideShow',
		'click .open-folder': 'onClickOpenFolder',
		'click .download-images': 'onClickDownloadImages',
		'tap': 'onTap'
	},

	//
	// downloading methods
	//

	downloadImages: function(link) {
		this.downloadFolder(link, {
			title: "Downloading Images"
		});
	},

	showGallery: function(collection) {
		
		// hide buttons
		//
		if (this.directory.contents.filter(Items.filters.is_image).length > 1) {
			this.$el.find('.view-slide-show').show();
		}

		// show image gallery
		//
		this.showChildView('gallery', new ImageGalleryView({
			collection: collection,

			// options
			//
			inline: true,
			lightbox: true,
			max_size: 512,
			defaults: {
				layout: {
					itemSpacing: 10,
					idealRowHeight: 300,
					justifyLastRow: true
				},
			}
		}));

		this.$el.find('.gallery').removeClass('loading');
	},

	//
	// dialog rendering methods
	//

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

	showSlideShow: function(imageFile) {

		// launch image viewer in slide show mode
		//
		application.launch('image_viewer', {
			model: imageFile,
			defaults: {
				show_sidebar: false
			},
			slide_show: true
		}, {
			maximized: true,
			full_screen: true,
		});
	},

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

	//
	// event handling methods
	//

	onLoad: function(directory) {
		this.directory = directory;

		// show image gallery
		//
		this.showGallery(new Items(directory.contents.filter(Items.filters.is_image)));

		// show map button
		//
		if (this.directory.hasItems(Items.filters.is_geolocated)) {
			this.$el.find('.open-map').show();
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function() {
		if (Browser.is_touch_enabled) {
			return;
		}

		if (this.hasChildView('gallery')) {
			this.getChildView('gallery').deselectAll();
		}
	},

	onClickOpenImages: function() {

		// show image viewer
		//
		this.showImageViewer(this.directory.contents.filter(Items.filters.is_image)[0]);
	},

	onClickOpenMap: function() {

		// show map viewer
		//
		this.showMapViewer(this.directory.contents.filter(Items.filters.is_geolocated));
	},

	onClickViewSlideShow: function() {

		// show image viewer
		//
		this.showSlideShow(this.directory.contents.filter(Items.filters.is_image)[0]);
	},

	onClickOpenFolder: function() {

		// show file browser
		//
		this.showFileBrowser(this.directory.clone());
	},

	onClickDownloadImages: function() {
		this.downloadImages(this.model);
	},

	//
	// touch event handling methods
	//

	onTap: function() {
		if (this.hasChildView('gallery')) {
			this.getChildView('gallery').deselectAll();
		}
	}
});