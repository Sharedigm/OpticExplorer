/******************************************************************************\
|                                                                              |
|                              status-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'status-bar',

	template: template(`
		<div class="map-mode info-bar">
			<i class="fa fa-map"></i>
			<span class="loading">Loading</span>
		</div>
		
		<div class="location info-bar" style="display:none;cursor:default">
			<i class="fa fa-crosshairs hidden-xs"></i>
			<span class="latitude"></span>&deg N, <span class="longitude"></span>&deg W
		</div>
	`),

	events: {
		'click .location': 'onClickLocation'
	},

	updateInterval: 300,

	//
	// rendering methods
	//

	showMapMode: function(mapMode) {
		if (mapMode != this.mapMode) {
			this.$el.find('.map-mode span').text(mapMode);
			this.mapMode = mapMode;
		}
	},

	showLatLon: function(latLon) {
		let latitude = latLon? latLon.latitude.toPrecision(7) : undefined;
		let longitude = latLon? latLon.longitude.toPrecision(7) : undefined;

		// update status
		//
		this.$el.find('.location').show();
		this.$el.find('.latitude').text(latitude);
		this.$el.find('.longitude').text(longitude);
	},

	update: function() {
		if (this.updateInterval) {

			// check if we are ready to update
			//
			if (!this.timeout) {
				
				// wait to update
				//
				this.setTimeout(() => {

					// update lat / long display
					//
					this.showLatLon(this.parent.app.getLatLon());
				}, this.updateInterval);
			}
		} else {

			// update lat / long display
			//
			this.showLatLon(this.parent.app.getLatLon());
		}
	},

	//
	// dialog rendering methods
	//

	showCopyLocationDialog: function(location) {
		import(
			'../../../../../views/apps/map-viewer/dialogs/maps/copy-location-dialog-view.js'
		).then((CopyLocationDialogView) => {

			// show copy location dialog
			//
			application.show(new CopyLocationDialogView.default({
				location: location,

				// options
				//
				title: "Copy Location"
			}));
		});
	},

	showCopyMapAreaDialog: function(bounds) {
		import(
			'../../../../../views/apps/map-viewer/dialogs/maps/copy-map-area-dialog-view.js'
		).then((CopyMapAreaDialogView) => {

			// show copy location dialog
			//
			application.show(new CopyMapAreaDialogView.default({
				bounds: bounds,

				// options
				//
				title: "Copy Map Area"
			}));
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.showMapMode(this.parent.app.getMapMode());
		this.update();
	},

	onChange: function() {
		this.showMapMode(this.parent.app.getMapMode());
		this.update();
	},

	//
	// mouse event handling methods
	//

	onClickButton: function() {
		this.showCopyLocationDialog(this.parent.app.getLatLon());
	}
}));