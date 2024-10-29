/******************************************************************************\
|                                                                              |
|                           map-mode-buttons-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import MapButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/map-button-view.js';
import SatelliteButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/satellite-button-view.js';
import HybridButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/hybrid-button-view.js';
import StreetsButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/streets-button-view.js';
import TransportationButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/transportation-button-view.js';
import ElevationButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/elevation-button-view.js';
import AeronauticalButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/buttons/aeronautical-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="current" data-toggle="tooltip" title="Map Mode"></div>
		<div class="tools">
			<%= tools %>
		</div>
	`),

	tools: _.template(`
		<div id="show-map" data-toggle="tooltip" title="Map"></div>
		<div id="show-satellite" data-toggle="tooltip" title="Satellite"></div>
		<div id="show-hybrid" data-toggle="tooltip" title="Hybrid"></div>
		<div id="show-streets" data-toggle="tooltip" title="Streets"></div>
		<div id="show-transportation" data-toggle="tooltip" title="Transportation"></div>
		<div id="show-elevation" data-toggle="tooltip" title="Elevation"></div>
		<div id="show-aeronautical" data-toggle="tooltip" title="Aeronautical"></div>
	`),

	regions: {
		map: '#show-map',
		satellite: '#show-satellite',
		hybrid: '#show-hybrid',
		streets: '#show-streets',
		transportation: '#show-transportation',
		elevation: '#show-elevation',
		aeronautical: '#show-aeronautical'
	},

	tooltips: {
		placement: 'top'
	},

	//
	// setting methods
	//

	setMapMode: function(mapMode) {
		this.select(this.getChildView(mapMode));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('map', new MapButtonView({
			parent: this
		}));
		this.showChildView('satellite', new SatelliteButtonView({
			parent: this
		}));
		this.showChildView('hybrid', new HybridButtonView({
			parent: this
		}));
		this.showChildView('streets', new StreetsButtonView({
			parent: this
		}));
		this.showChildView('transportation', new TransportationButtonView({
			parent: this
		}));
		this.showChildView('elevation', new ElevationButtonView({
			parent: this
		}));
		this.showChildView('aeronautical', new AeronauticalButtonView({
			parent: this
		}));
	},

	onAttach: function() {

		// set map mode
		//
		this.setMapMode(this.getParentView('app').preferences.get('map_mode'));
	}
});