/******************************************************************************\
|                                                                              |
|                            favorite-mappable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding favorites to maps.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// favorite adding methods
	//

	addFavorite: function() {
		this.showAddFavoriteDialogView();
	},

	editFavorite: function(place) {
		this.showEditFavoriteDialogView(place);
	},

	deleteFavorite: function(place, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to delete ' + place.get('name') + ' from your list of favorite places?',

				// callbacks
				//
				accept: () => {
					this.deletePlace(place, {
						confirm: false
					});
				}
			});
		} else {

			// delete place
			//
			place.destroy({

				// callbacks
				//
				success: () => {

					// play remove sound
					//
					application.play('remove');
					
					// update
					//
					this.onChange();
				}
			});
		}
	},

	deleteSelectedFavorites: function() {
		this.deleteFavorite(this.getSelectedLayerModels('favorites')[0]);
	},

	//
	// dialog rendering methods
	//

	showAddFavoriteDialogView: function() {
		import(
			'../../../../views/apps/map-viewer/dialogs/favorites/add-favorite-dialog-view.js'
		).then((AddFavoriteDialogView) => {
			this.show(new AddFavoriteDialogView.default({
				model: this.getActivePaneView().getCurrentPlace(),
				collection: this.favorites,

				// options
				//
				mapView: this.getLayerView('map'),

				// callbacks
				//
				onadd: (model) => {
						
					// geolocate place marker on map
					//
					this.getLayerItemView('favorites', model).placeOn(this.getLayerView('map'));

					// update
					//
					this.onChange();
				}
			}));
		});
	},

	showEditFavoriteDialogView: function(place) {
		import(
			'../../../../views/apps/map-viewer/dialogs/favorites/edit-favorite-dialog-view.js'
		).then((EditFavoriteDialogView) => {
			this.show(new EditFavoriteDialogView.default({
				model: place,

				// options
				//
				mapView: this.getLayerView('map')
			}));
		});
	}
}