/******************************************************************************\
|                                                                              |
|                              place-mappable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines behavior for adding places to maps.                      |
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
	// place adding methods
	//

	addPlace: function() {
		this.showAddPlaceDialogView();
	},

	editPlace: function(place) {
		this.showEditPlaceDialogView(place);
	},

	deletePlace: function(place, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to delete ' + place.get('name') + ' from this map?',

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
					
					// update menus
					//
					this.onChange();
				}
			});
		}
	},

	removePlaces: function(places, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				message: 'Are you sure that you want to remove ' + (places.length == 1? places[0].getName() : 'these ' + places.length + ' places') + ' from the map?',

				// callbacks
				//
				accept: () => {
					this.removePlaces(places, {
						confirm: false
					});
				}
			});
		} else if (this.hasActivePaneView()) {

			// remove places from collection
			//
			this.getActivePaneView().places.remove(places);

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.setDirty();
		}
	},

	removeSelectedPlaces: function() {
		this.removePlaces(this.getSelectedLayerModels('places'));
	},

	//
	// dialog rendering methods
	//

	showAddPlaceDialogView: function() {
		import(
			'../../../../views/apps/map-viewer/dialogs/places/add-place-dialog-view.js'
		).then((AddPlaceDialogView) => {
			this.show(new AddPlaceDialogView.default({
				model: this.getActivePaneView().getCurrentPlace(),

				// options
				//
				collection: this.getActivePaneView().places,
				mapView: this.getLayerView('map'),

				// callbacks
				//
				onadd: (model) => {
					
					// geolocate place marker on map
					//
					this.getLayerItemView('places', model).placeOn(this.getLayerView('map'));
				
					// update menus
					//
					this.onChange();
				}
			}));
		});
	},

	showEditPlaceDialogView: function(place) {
		import(
			'../../../../views/apps/map-viewer/dialogs/places/edit-place-dialog-view.js'
		).then((EditPlaceDialogView) => {
			this.show(new EditPlaceDialogView.default({
				model: place,

				// options
				//
				mapView: this.getLayerView('map')
			}));
		});
	}
}