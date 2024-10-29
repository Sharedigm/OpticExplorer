/******************************************************************************\
|                                                                              |
|                        weather-layer-button-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToggleButtonView from '../../../../../../views/apps/common/toolbars/buttons/toggle-button-view.js';

export default ToggleButtonView.extend({

	//
	// functions
	//

	onClick: function() {
		let layerName = this.options.name.replace('show_', '');

		// call superclass method
		//
		ToggleButtonView.prototype.onClick.call(this);

		// update weather layer options
		//
		let mapItemsView = this.parent.app.getLayerView('map').parent;
		if (this.isSelected()) {
			mapItemsView.options.weather_layers.push(this.options.name);
		} else {
			mapItemsView.options.weather_layers.remove(this.options.name);
		}

		// update visibility if weather layer exists
		//
		let weatherView = this.parent.app.getLayerView('weather');
		if (weatherView) {

			// show selected weather sublayer
			//
			weatherView.setLayerVisibility(layerName, this.isSelected());
		}
	}
});