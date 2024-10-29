/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
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
			<a class="edit-selected"><i class="fa fa-pencil-alt"></i>Edit Selected<span class="command shortcut">E</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="add-photos"><i class="fa fa-camera"></i>Add Photos<span class="command shortcut">P</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-videos"><i class="fa fa-video"></i>Add Videos<span class="command shortcut">V</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-people"><i class="fa fa-user-friends"></i>Add People<span class="shift command shortcut">P</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-place"><i class="fa fa-map-marker-alt"></i>Add Place<span class="shift command shortcut">L</span></a>
		</li>
		
		<li role="presentation">
			<a class="add-favorite"><i class="fa fa-map-pin"></i>Add Favorite<span class="shift command shortcut">F</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="delete-selected"><i class="fa fa-trash-alt"></i>Delete Selected<span class="shortcut">delete</span></a>
		</li>
	`),
	
	events: {
		'click .edit-selected': 'onClickEditSelected',
		'click .add-place': 'onClickAddPlace',
		'click .add-favorite': 'onClickAddFavorite',
		'click .add-photos': 'onClickAddPhotos',
		'click .add-videos': 'onClickAddVideos',
		'click .add-people': 'onClickAddPeople',
		'click .delete-selected': 'onClickDeleteSelected',
	},
	
	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasSelectedPlaces = this.parent.app.hasSelectedMapItems('places');
		let hasSelectedFavorites = this.parent.app.hasSelectedMapItems('favorites');
		let hasSelected = this.parent.app.hasSelected();

		return {
			'edit-selected': hasSelectedPlaces || hasSelectedFavorites,
			'add-place': isSignedIn,
			'add-favorite': isSignedIn,
			'add-photos': isSignedIn,
			'add-videos': isSignedIn,
			'add-people': isSignedIn,
			'delete-selected': hasSelected
		};
	},

	//
	// mouse event handling methods
	//

	onClickEditSelected: function() {
		this.parent.app.editSelected();
	},

	onClickAddPlace: function() {
		this.parent.app.addPlace();
	},

	onClickAddFavorite: function() {
		this.parent.app.addFavorite();
	},

	onClickAddPhotos: function() {
		this.parent.app.showAddPhotosDialog();
	},

	onClickAddVideos: function() {
		this.parent.app.showAddVideosDialog();
	},

	onClickAddPeople: function() {
		this.parent.app.showAddPeopleDialog();
	},

	onClickDeleteSelected: function() {
		this.parent.app.deleteSelected();
	}
});