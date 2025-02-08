/******************************************************************************\
|                                                                              |
|                             context-menu-view.js                             |
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

import ContextMenuView from '../../../../views/apps/common/context-menus/context-menu-view.js';

export default ContextMenuView.extend({

	//
	// attributes
	//

	events: _.extend({}, ContextMenuView.prototype.events, {
		'click .open-item': 'onClickOpenItem',
		'click .show-info': 'onClickShowInfo',
		'click .show-on-map': 'onClickShowOnMap',
		'click .share-files': 'onClickShareFiles',
		'click .share-audio': 'onClickShareAudio',
		'click .share-music': 'onClickShareMusic',
		'click .share-pictures': 'onClickSharePictures',
		'click .share-videos': 'onClickShareVideos',
		'click .share-maps': 'onClickShareMaps',
		'click .share-message': 'onClickShareMessage',
		'click .share-gesture': 'onClickShareGesture'
	}),

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.hasSelected();
		let oneSelected = this.parent.numSelected() == 1;
		let hasSelectedGeolocated = this.parent.hasSelectedGeolocated();

		return {
			'open-item': application.isSignedIn(),
			'show-info': hasSelected,
			'show-on-map': hasSelectedGeolocated,
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

	onClickOpenItem: function() {
		this.parent.openConnection(this.parent.getSelectedModel());
	},

	onClickShowInfo: function() {
		this.parent.showInfoDialog();
	},

	onClickShowOnMap: function() {
		this.parent.showSelectedGeolocatedModels();
	},

	onClickShareFiles: function() {
		this.parent.shareWithSelected();
	},

	onClickShareAudio: function() {
		this.parent.shareAudioWithSelected();
	},

	onClickShareMusic: function() {
		this.parent.shareMusicWithSelected();
	},

	onClickSharePictures: function() {
		this.parent.sharePicturesWithSelected();
	},

	onClickShareVideos: function() {
		this.parent.shareVideosWithSelected();
	},

	onClickShareMaps: function() {
		this.parent.shareMapsWithSelected();
	},

	onClickShareMessage: function() {
		this.parent.shareMessageWithSelected();
	},

	onClickShareGesture: function() {
		this.parent.showGestureDialog();
	}
});