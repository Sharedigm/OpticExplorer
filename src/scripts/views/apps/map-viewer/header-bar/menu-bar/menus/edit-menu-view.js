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

import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//
	
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