/******************************************************************************\
|                                                                              |
|                          map-marker-button-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../../../models/places/place.js';
import MouseModeButtonView from '../../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';
import MouseBehavior from '../../../../../../../views/behaviors/mouse/mouse-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: template(`
		<img class="icon" src="<%= url %>"></i>
	`),

	cursor: 'crosshair',

	//
	// getting methods
	//

	getIconUrl: function() {
		return config.servers.api + '/file/thumb?max-size=100&path=' + encodeURIComponent(this.options.icon_path);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			url: this.getIconUrl()
		};
	},

	//
	// dialog rendering methods
	//

	showDialog: function(latLon) {
		import(
			'../../../../../../../views/apps/map-viewer/dialogs/places/add-place-dialog-view.js'
		).then((AddPlaceDialogView) => {
			this.app.show(new AddPlaceDialogView.default({
				model: new Place({
					name: this.options.name,
					icon_path: this.options.icon_path,
					description: undefined,
					latitude: latLon.latitude,
					longitude: latLon.longitude
				}),
				collection: this.app.getActivePaneView().places,

				// callbacks
				//
				onadd: (model) => {
					
					// geolocate place marker on map
					//
					this.app.getLayerItemView('places', model).placeOn(this.app.getLayerView('map'));
				
					// update menus
					//
					this.app.onChange();
				}
			}))
		});
	},

	//
	// event handling methods
	//

	onActivate: function() {
		let viewport = this.getParentView('app').getActiveViewport();
		
		// create behaviors
		//
		this.behaviors = [
			new MouseBehavior(viewport.el, {
				on: false,

				// callbacks
				//
				onclick: (event) => {
					let viewport = this.getParentView('app').getActiveViewport();
					let offset = this.behaviors[0].getEventOffset(event);
					let latLon = viewport.offsetToLatLon(offset);

					// display add marker dialog
					//
					this.showDialog(latLon);
				}
			}),
			new MouseWheelZoomBehavior(viewport, {
				on: false
			})
		];
	}
});