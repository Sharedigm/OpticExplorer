/******************************************************************************\
|                                                                              |
|                              item-favorable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of an app favorite designating behavior.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileFavorites from '../../../../../models/favorites/file-favorites.js';

export default {

	//
	// querying methods
	//

	hasFavorites: function() {
		return this.constructor.favorites != undefined;
	},

	hasSelectedFavorites: function() {
		if (this.hasChildView('sidebar favorites items')) {
			return this.getChildView('sidebar favorites items').hasSelected();
		} else {
			return false;
		}
	},

	//
	// getting methods
	//

	getFavorites: function() {
		if (this.hasFavorites()) {
			return this.constructor.favorites;
		}

		return new FileFavorites({
			category: this.name,
			defaults: config.apps[this.name].favorites
		});
	},

	getSelectedFavorites: function() {
		if (this.hasChildView('sidebar favorites items')) {
			return this.getChildView('sidebar favorites items').getSelectedModels();
		} else {
			return [];
		}
	},

	//
	// setting methods
	//

	setFavorites: function(favorites) {
		this.constructor.favorites = favorites;
	},

	//
	// adding / removing methods
	//

	addFavorites: function(items) {
		this.getChildView('sidebar favorites items').addFavorites(items, {

			// callbacks
			//
			success: () => {

				// play add sound
				//
				application.play('add');
			}
		});
	},

	removeFavorites: function(favorites) {

		// check if there are favorites to remove
		//
		if (!favorites|| favorites.length == 0) {
			return;
		}

		// check for sidebar favorites panel
		//
		if (!this.hasChildView('sidebar favorites')) {
			return;
		}

		// remove favorites from sidebar
		//
		this.getChildView('sidebar favorites items').removeFavorites(favorites, {
			confirm: true,

			// callbacks
			//
			success: () => {
				this.onChange();
			}
		});
	},

	removeSelectedFavorites: function() {
		this.removeFavorites(this.getSelectedFavorites());
	},

	//
	// opening methods
	//

	openFavorite: function(which) {

		// check for sidebar favorites panel
		//
		if (!this.hasChildView('sidebar favorites')) {
			return;
		}

		// check for favorites
		//
		let favoritesListView = this.getChildView('sidebar favorites items items');
		if (!favoritesListView) {
			return;
		}

		// select favorite
		//
		let itemView = favoritesListView.getChildView(which);
		favoritesListView.deselectAll();
		itemView.select();
	},

	//
	// dialog rendering methods
	//

	showAddFavoritesDialog: function() {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({
				model: application.isSignedIn()? application.getDirectory() : this.model,

				// options
				//
				title: "Add Favorites",

				// callbacks
				//
				onopen: (items) => {
					this.addFavorites(items);
				}
			}));
		});
	}
};