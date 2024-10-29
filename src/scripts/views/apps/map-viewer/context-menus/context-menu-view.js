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
			<a class="new-map"><i class="fa fa-map"></i>New Map<span class="command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="share dropdown-toggle"><i class="fa fa-share"></i>Share<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="share-with-connections"><i class="fa fa-user-friends"></i>With Connections</a>
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
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="zoom-to"><i class="fa fa-search"></i>Zoom To<span class="command shortcut">Z</span></a>
		</li>
		
		<li role="separator" class="open-item divider"></li>
		
		<li role="presentation">
			<a class="add-photos"><i class="fa fa-camera"></i>Add Photos<span class="shift command shortcut">O</span></a>
		</li>
		
		<li role="presentation">
			<a class="remove-photos"><i class="fa fa-minus"></i>Remove Photos<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-videos"><i class="fa fa-video"></i>Add Videos<span class="shift command shortcut">O</span></a>
		</li>
		
		<li role="presentation">
			<a class="remove-videos"><i class="fa fa-minus"></i>Remove Videos<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-people"><i class="fa fa-user-friends"></i>Add People<span class="shift command shortcut">F</span></a>
		</li>
		
		<li role="presentation">
			<a class="remove-people"><i class="fa fa-minus"></i>Remove People<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-place"><i class="fa fa-map-marker-alt"></i>Add Place<span class="command shortcut">P</span></a>
		</li>
		
		<li role="presentation">
			<a class="edit-place"><i class="fa fa-pencil-alt"></i>Edit Place<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete-place"><i class="fa fa-trash-alt"></i>Delete Place<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-favorite"><i class="fa fa-map-pin"></i>Add Favorite<span class="command shortcut">1</span></a>
		</li>
		
		<li role="presentation">
			<a class="edit-favorite"><i class="fa fa-pencil-alt"></i>Edit Favorite<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete-favorite"><i class="fa fa-trash-alt"></i>Delete Favorite<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-map"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
		</li>
		
		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="shift command shortcut">S</span></a>
		</li>
	`),

	events: _.extend({}, ContextMenuView.prototype.events, {
		'click .new-map': 'onClickNewMap',
		'click .open-item': 'onClickOpenItem',
		'click .show-info': 'onClickShowInfo',

		// share with connections
		//
		'click .share-by-invitation': 'onClickShareByInvitation',
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// edit map
		//
		'click .add-photos': 'onClickAddPhotos',
		'click .remove-photos': 'onClickRemovePhotos',
		'click .add-videos': 'onClickAddVideos',
		'click .remove-videos': 'onClickRemoveVideos',
		'click .add-people': 'onClickAddPeople',
		'click .remove-people': 'onClickRemovePeople',
		'click .add-place': 'onClickAddPlace',
		'click .edit-place': 'onClickEditPlace',
		'click .delete-place': 'onClickDeletePlace',
		'click .add-favorite': 'onClickAddFavorite',
		'click .edit-favorite': 'onClickEditFavorite',
		'click .delete-favorite': 'onClickDeleteFavorite',

		'click .zoom-to': 'onClickZoomTo',
		'click .save-map': 'onClickSaveMap',
		'click .save-as': 'onClickSaveAs'
	}),

	//
	// querying methods
	//

	visible: function() {
		let hasSelectedPhotos = this.parent.hasSelectedLayerItems('photos');
		let hasSelectedVideos = this.parent.hasSelectedLayerItems('videos');
		let hasSelectedPeople = this.parent.hasSelectedLayerItems('people');
		let hasSelectedPlaces = this.parent.hasSelectedLayerItems('places');
		let hasSelectedFavorites = this.parent.hasSelectedLayerItems('favorites');
		let hasSelected = hasSelectedPhotos || hasSelectedVideos || hasSelectedPeople || hasSelectedPlaces || hasSelectedFavorites;

		return {
			'new-map': !hasSelected,
			'open-item': !hasSelectedPlaces && !hasSelectedFavorites,
			'add-photos': !hasSelected,
			'remove-photos': hasSelectedPhotos,
			'add-videos': !hasSelected,
			'remove-videos': hasSelectedVideos,
			'add-people': !hasSelected,
			'remove-people': hasSelectedPeople,
			'add-place': !hasSelected,
			'edit-place': hasSelectedPlaces,
			'delete-place': hasSelectedPlaces,
			'add-favorite': !hasSelected,
			'edit-favorite': hasSelectedFavorites,
			'delete-favorite': hasSelectedFavorites,
			'show-info': hasSelected,
			'zoom-to': hasSelected,
			'save-map': !hasSelected,
			'save-as': !hasSelected
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

	onClickNewMap: function() {
		this.parent.newFile();
	},

	onClickOpenItem: function() {
		this.parent.openSelected();
	},

	onClickShowInfo: function() {
		this.parent.showInfoDialog();
	},

	onClickShareByInvitation: function() {
		this.parent.shareWithConnections();
	},

	onClickShareByTopic: function() {
		this.parent.shareByTopic();
	},

	onClickShareByMessage: function() {
		this.parent.shareByMessage();
	},

	onClickShareByLink: function() {
		this.parent.shareByLink();
	},

	onClickShareByEmail: function() {
		this.parent.shareByEmail();
	},

	onClickAddPhotos: function() {
		this.parent.showAddPhotosDialog();
	},
	
	onClickRemovePhotos: function() {
		this.parent.removeSelectedPhotos();
	},

	onClickAddVideos: function() {
		this.parent.showAddVideosDialog();
	},
	
	onClickRemoveVideos: function() {
		this.parent.removeSelectedVideos();
	},

	onClickAddPeople: function() {
		this.parent.showAddPeopleDialog();
	},

	onClickRemovePeople: function() {
		this.parent.removeSelectedPeople();
	},

	onClickAddPlace: function() {
		this.parent.addPlace();
	},

	onClickEditPlace: function() {
		this.parent.editPlace(this.parent.getSelectedLayerItems('places')[0]);
	},

	onClickDeletePlace: function() {
		this.parent.deletePlace(this.parent.getSelectedLayerItems('places')[0]);
	},

	onClickAddFavorite: function() {
		this.parent.addFavorite();
	},

	onClickEditFavorite: function() {
		this.parent.editFavorite(this.parent.getSelectedLayerItems('favorites')[0]);
	},

	onClickDeleteFavorite: function() {
		this.parent.deleteFavorite(this.parent.getSelectedLayerItems('favorites')[0]);
	},

	onClickZoomTo: function() {
		this.parent.zoomToItem(this.parent.getSelectedItem());
	},

	onClickSaveMap: function() {
		this.parent.save();
	},

	onClickSaveAs: function() {
		this.parent.saveAs();
	},

	onClickCloseMap: function() {
		this.parent.close();
	}
});