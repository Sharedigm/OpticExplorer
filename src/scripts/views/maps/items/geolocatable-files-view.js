/******************************************************************************\
|                                                                              |
|                          geolocatable-files-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a set of behaviors for mappable container views.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FilesView from '../../../views/apps/file-browser/mainbar/files/files-view.js';

export default FilesView.extend({

	//
	// geolocating methods
	//

	placeOn: function(mapView) {
		if (this.hasChildView('items')) {
			let children = this.getChildView('items').children;
			for (let i = 0; i < children.length; i++) {
				children.findByIndex(i).placeOn(mapView);
			}
		}
	},

	updatePlaces: function(mapView) {
		if (this.hasChildView('items')) {
			let children = this.getChildView('items').children;
			for (let i = 0; i < children.length; i++) {
				children.findByIndex(i).updatePlace(mapView);
			}
		}
	}
});