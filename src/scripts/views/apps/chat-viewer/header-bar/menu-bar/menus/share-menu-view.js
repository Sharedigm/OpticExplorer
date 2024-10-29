/******************************************************************************\
|                                                                              |
|                              share-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="share-chat"><i class="fa fa-comments"></i>Chat</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<% if (features && features.files) { %>
		<li role="presentation">
			<a class="share-files"><i class="fa fa-file"></i>Files</a>
		</li>
		<% } %>
		
		<% if (features && features.audio) { %>
		<li role="presentation">
			<a class="share-audio"><i class="fa fa-volume-up"></i>Audio</a>
		</li>
		<% } %>
		
		<% if (features && features.music) { %>
		<li role="presentation">
			<a class="share-music"><i class="fa fa-music"></i>Music</a>
		</li>
		<% } %>
		
		<% if (features && features.pictures) { %>
		<li role="presentation">
			<a class="share-pictures"><i class="fa fa-image"></i>Pictures</a>
		</li>
		<% } %>
		
		<% if (features && features.video) { %>
		<li role="presentation">
			<a class="share-videos"><i class="fa fa-video"></i>Videos</a>
		</li>
		<% } %>
		
		<% if (features && features.maps) { %>
		<li role="presentation">
			<a class="share-maps"><i class="fa fa-map"></i>Maps</a>
		</li>
		<% } %>
		
		<% if (features && features.locations) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-location"><i class="fa fa-map-marker-alt"></i>Location</a>
		</li>
		<% } %>
	`),

	events: {

		// share chat
		//
		'click .share-chat': 'onClickShareChat',

		// share items
		//
		'click .share-files': 'onClickShareFiles',
		'click .share-audio': 'onClickShareAudio',
		'click .share-music': 'onClickShareMusic',
		'click .share-pictures': 'onClickSharePictures',
		'click .share-videos': 'onClickShareVideos',
		'click .share-maps': 'onClickShareMaps',
		'click .share-location': 'onClickShareLocation'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasChat = this.parent.app.collection.length > 0;

		return {
			'share-files': isSignedIn && hasChat,
			'share-audio': isSignedIn && hasChat,
			'share-music': isSignedIn && hasChat,
			'share-pictures': isSignedIn && hasChat,
			'share-videos': isSignedIn && hasChat,
			'share-maps': isSignedIn && hasChat,
			'share-location': isSignedIn && hasChat,
			'share-chat': isSignedIn && hasChat
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			features: config.apps.chat_viewer.features
		}
	},

	//
	// mouse event handling methods
	//

	onClickShareChat: function() {
		this.parent.app.showChatInvitationsDialog(this.parent.app.getActiveModel());
	},

	onClickShareFiles: function() {
		this.parent.app.shareItemsWithChat();
	},

	onClickShareAudio: function() {
		this.parent.app.shareAudioWithChat();
	},

	onClickShareMusic: function() {
		this.parent.app.shareMusicWithChat();
	},

	onClickSharePictures: function() {
		this.parent.app.sharePicturesWithChat();
	},

	onClickShareVideos: function() {
		this.parent.app.shareVideosWithChat();
	},

	onClickShareMaps: function() {
		this.parent.app.shareMapsWithChat();
	},

	onClickShareLocation: function() {
		this.parent.app.shareLocationWithChat();
	}
});