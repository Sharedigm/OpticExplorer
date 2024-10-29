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

	template: template(`
		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="share dropdown-toggle"><i class="fa fa-share"></i>Share<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
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
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-on-map"><i class="fa fa-map"></i>Show on Map<span class="command shortcut">M</span></a>
		</li>
	`),

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
	// rendering methods
	//

	templateContext: function() {
		return {
			is_desktop: this.parent.isDesktop()
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenItem: function() {
		this.parent.openConnection(this.parent.getSelectedModels()[0]);
	},

	onClickShowInfo: function() {
		this.parent.showInfoDialog();
	},

	onClickShowOnMap: function() {
		application.launch('map_viewer', {
			people: this.parent.getSelectedGeolocatedModels()
		});
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