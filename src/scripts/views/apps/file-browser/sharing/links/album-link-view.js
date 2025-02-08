/******************************************************************************\
|                                                                              |
|                              album-link-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show info about a link to an album.            |
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
import FolderLinkView from '../../../../../views/apps/file-browser/sharing/links/folder-link-view.js';

export default FolderLinkView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-volume-up"></i>Shared Album</h1>
		
		<div class="content">
			<div class="user-profile-header"></div>
			<br />
		
			<% if (message) { %>
			<p><%= username.capitalized() %> has shared the album '<%= dirname %>' with you along with the following message: </p>
			<div class="well"><%= message %></div>
			<% } else { %>
			<p><%= username.capitalized() %> has shared the album '<%= dirname %>' with you. </p>
			<% } %>
		
			<div class="buttons">
				<button class="play-album btn btn-primary btn-lg">
					<i class="fa fa-volume-up"></i>Play Album
				</button>
				<button class="open-album btn btn-lg">
					<i class="fa fa-folder"></i>Open Album
				</button>
				<button class="download-album btn btn-lg">
					<i class="fa fa-cloud-download-alt"></i>Download Album
				</button>
			</div>
		</div>
	`),

	events: {
		'click .play-album': 'onClickPlayAlbum',
		'click .open-album': 'onClickOpenAlbum',
		'click .download-album': 'onClickDownloadAlbum'
	},

	//
	// downloading methods
	//

	downloadAlbum: function(link) {
		this.downloadFolder(link, {
			title: "Downloading Album"
		});
	},

	//
	// dialog rendering methods
	//

	showAudioPlayer: function(directory) {
		application.launch('audio_player', {
			collection: directory.contents
		}, {
			maximized: true
		});
	},

	showFileBrowser: function(directory) {
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
	// mouse event handling methods
	//

	onClickPlayAlbum: function() {
		new Directory({
			link: this.model
		}).load({

			// callbacks
			//
			success: (directory) => {

				// show audio player
				//
				this.showAudioPlayer(directory);
			}
		});
	},

	onClickOpenAlbum: function() {

		// show file browser
		//
		this.showFileBrowser(new Directory({
			link: this.model
		}));
	},

	onClickDownloadAlbum: function() {
		this.downloadAlbum(this.model);
	}
});