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
			<a class="share-message"><i class="fa fa-comments"></i>Message</a>
		</li>
		
		<li role="presentation">
			<a class="share-gesture"><i class="fa fa-hand-pointer"></i>Gesture</a>
		</li>
	`),
	
	events: {
		'click .share-files': 'onClickShareFiles',
		'click .share-audio': 'onClickShareAudio',
		'click .share-music': 'onClickShareMusic',
		'click .share-pictures': 'onClickSharePictures',
		'click .share-videos': 'onClickShareVideos',
		'click .share-maps': 'onClickShareMaps',
		'click .share-message': 'onClickShareMessage',
		'click .share-gesture': 'onClickShareGesture'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();
		let oneSelected = this.parent.app.numSelected() == 1;
	
		return {
			'share-files': hasSelected,
			'share-audio': hasSelected,
			'share-music': hasSelected,
			'share-pictures': hasSelected,
			'share-videos': hasSelected,
			'share-maps': hasSelected,
			'share-message': oneSelected,
			'share-gesture': oneSelected
		};
	},

	//
	// mouse event handling methods
	//

	onClickShareFiles: function() {
		this.parent.app.shareWithSelected();
	},

	onClickShareAudio: function() {
		this.parent.app.shareAudioWithSelected();
	},

	onClickShareMusic: function() {
		this.parent.app.shareMusicWithSelected();
	},

	onClickSharePictures: function() {
		this.parent.app.sharePicturesWithSelected();
	},

	onClickShareVideos: function() {
		this.parent.app.shareVideosWithSelected();
	},

	onClickShareMaps: function() {
		this.parent.app.shareMapsWithSelected();
	},

	onClickShareMessage: function() {
		this.parent.app.shareMessageWithSelected();
	},

	onClickShareGesture: function() {
		this.parent.app.showGestureDialog();
	}
});