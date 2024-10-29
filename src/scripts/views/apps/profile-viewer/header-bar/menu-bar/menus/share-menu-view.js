/******************************************************************************\
|                                                                              |
|                               share-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying share dropdown menus.                   |
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
			<a class="share-files"><i class="fa fa-file"></i>Files</a>
		</li>
		
		<li role="presentation">
			<a class="share-audio"><i class="fa fa-volume-up"></i>Audio</a>
		</li>
		
		<li role="presentation">
			<a class="share-music"><i class="fa fa-music"></i>Music</a>
		</li>
		
		<li role="presentation">
			<a class="share-pictures"><i class="fa fa-image"></i>Pictures</a>
		</li>
		
		<li role="presentation">
			<a class="share-videos"><i class="fa fa-video"></i>Videos</a>
		</li>
		
		<li role="presentation">
			<a class="share-maps"><i class="fa fa-map"></i>Maps</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-message"><i class="fa fa-comment"></i>Message</a>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="share-gesture dropdown-toggle"><i class="fa fa-hand-pointer"></i>Gesture<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" type="detail-kind">
					<a class="poke gesture"><i class="fa fa-hand-pointer"></i>Poke</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="wink gesture"><i class="fa fa-eye"></i>Wink</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="wave gesture"><i class="fa fa-hand-paper"></i>Wave</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="peace-sign gesture"><i class="fa fa-hand-peace"></i>Peace</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="live-long-and-prosper gesture"><i class="fa fa-hand-spock"></i>Live Long and Prosper</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="hug gesture"><i class="fa fa-user-circle"></i>Hug</a>
				</li>
		
				<li role="presentation" type="detail-kind">
					<a class="kiss gesture"><i class="fa fa-heart"></i>Kiss</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-by-topic"><i class="fa fa-newspaper"></i>By Discussion Topic</a>
		</li>
		
		<li role="presentation">
			<a class="share-by-message"><i class="fa fa-comments"></i>By Chat Messsage</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
		</li>
		
		<li role="presentation">
			<a class="share-by-email"><i class="fa fa-envelope"></i>By Email</a>
		</li>
	`),

	events: {
		// share items
		//
		'click .share-files': 'onClickShareFiles',
		'click .share-audio': 'onClickShareAudio',
		'click .share-music': 'onClickShareMusic',
		'click .share-pictures': 'onClickSharePictures',
		'click .share-videos': 'onClickShareVideos',
		'click .share-maps': 'onClickShareMaps',

		// share with connections
		//
		'click .share-message': 'onClickShareMessage',
		'click .gesture': 'onClickShareGesture',
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail'
	},

	//
	// querying methods
	//
	
	disabled: function() {
		let isCurrent = !this.parent.app.model.isCurrent();

		// set initial state
		//
		return {
			'share-files': !isCurrent,
			'share-audio': !isCurrent,
			'share-music': !isCurrent,
			'share-pictures': !isCurrent,
			'share-videos': !isCurrent,
			'share-maps': !isCurrent,

			'share-message': !isCurrent,
			'share-gesture': !isCurrent,
			'share-by-topic': !isCurrent,
			'share-by-message': !isCurrent,

			'share-by-link': !isCurrent,
			'share-by-email': !isCurrent
		};
	},

	//
	// mouse event handling methods
	//

	onClickShareFiles: function() {
		this.parent.app.shareFiles();
	},

	onClickShareAudio: function() {
		this.parent.app.shareAudio();
	},

	onClickShareMusic: function() {
		this.parent.app.shareMusic();
	},

	onClickSharePictures: function() {
		this.parent.app.sharePictures();
	},

	onClickShareVideos: function() {
		this.parent.app.shareVideos();
	},

	onClickShareMaps: function() {
		this.parent.app.shareMaps();
	},

	onClickShareMessage: function() {
		this.parent.app.shareMessage();
	},

	onClickShareGesture: function() {
		let kind = $(event.target).attr('class').replace(' gesture', '');
		this.parent.app.shareGesture(kind);
	},

	onClickShareByTopic: function() {
		this.parent.app.shareByTopic();
	},

	onClickShareByMessage: function() {
		this.parent.app.shareByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareByEmail();
	}
});