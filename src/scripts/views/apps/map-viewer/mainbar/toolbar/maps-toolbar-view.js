/******************************************************************************\
|                                                                              |
|                             maps-toolbar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for the maps main toolbar.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import Collapsable from '../../../../../views/apps/common/toolbars/behaviors/collapsable.js';
import Dockable from '../../../../../views/apps/common/toolbars/behaviors/dockable.js';
import Rotatable from '../../../../../views/apps/common/toolbars/behaviors/rotatable.js';
import MapModeButtonsView from '../../../../../views/apps/map-viewer/mainbar/toolbar/map-mode/map-mode-buttons-view.js';
import ViewKindButtonsView from '../../../../../views/apps/map-viewer/mainbar/toolbar/view-kind/view-kind-buttons-view.js';
import LayersToolbarView from '../../../../../views/apps/map-viewer/mainbar/toolbar/layers/layers-toolbar-view.js';
import WeatherToolbarView from '../../../../../views/apps/map-viewer/mainbar/toolbar/weather/weather-toolbar-view.js';
import MapMarkerButtonsView from '../../../../../views/apps/map-viewer/mainbar/toolbar/map-markers/map-marker-buttons-view.js';

export default ToolbarView.extend(_.extend({}, Collapsable, Dockable, Rotatable, {

	//
	// attributes
	//

	className: 'vertical toolbar',

	template: _.template(`
		<div class="handle"></div>
		
		<div class="controls">
			<div class="expander">
				<i id="collapse" class="active fa fa-caret-left" data-toggle="tooltip" title="Collapse"></i>
				<i id="expand" class="active fa fa-caret-right" data-toggle="tooltip" title="Expand" style="display:none"></i>
			</div>
		
			<div class="rotator">
				<i id="horizontal" class="active fa fa-caret-up" data-toggle="tooltip" title="Horizontal"></i>
				<i id="vertical" class="active fa fa-caret-down" data-toggle="tooltip" title="Vertical" style="display:none"></i>
			</div>
		</div>
		
		<div id="map-mode"></div>
		<div id="view-kind"></div>
		<div id="layers"></div>
		<div id="weather"></div>

		<% for (let i = 0; i < markers.length; i++) { %>
		<div id="<%= markers[i] %>"></div>
		<% } %>
	`),

	regions: {
		map_mode: '#map-mode',
		view_kind: '#view-kind',
		layers: '#layers',
		weather: '#weather'
	},

	events: _.extend({}, Collapsable.events, Dockable.events, Rotatable.events),

	tooltips: {
		container: 'body',
		placement: 'top'
	},

	//
	// getting methods
	//

	getMarkerIds: function() {
		if (!config.apps.map_viewer.markers) {
			return [];
		}
		let ids = Object.keys(config.apps.map_viewer.markers);
		for (let i = 0; i < ids.length; i++) {
			ids[i] = ids[i].toLowerCase() + '-markers';
		}
		return ids;
	},

	//
	// setting methods
	//

	setMapMode: function(mapMode) {
		this.getChildView('map_mode').setMapMode(mapMode);
	},

	setViewKind: function(viewKind) {
		this.getChildView('view_kind').setViewKind(viewKind);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			markers: this.getMarkerIds()
		};
	},

	onRender: function() {

		// show child views
		//
		this.showMapModeButtons();
		this.showViewKindButtons();
		this.showLayerToolbar();
		this.showWeatherToolbar();
		this.showMapMarkerButtons(config.apps.map_viewer.markers);

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});
	},

	onLoad: function() {
		this.getChildView('layers').onLoad();
		this.getChildView('weather').onLoad();
	},

	onAttach: function() {

		// call mixin method
		//
		Dockable.onAttach.call(this);

		// activate tools
		//
		this.onActivate();
	},

	showMapModeButtons: function() {
		this.showChildView('map_mode', new MapModeButtonsView({
			parent: this
		}));
	},

	showViewKindButtons: function() {
		this.showChildView('view_kind', new ViewKindButtonsView({
			parent: this
		}));
	},

	showLayerToolbar: function() {
		this.showChildView('layers', new LayersToolbarView({
			parent: this
		}));
	},

	showWeatherToolbar: function() {
		this.showChildView('weather', new WeatherToolbarView({
			parent: this
		}));
	},

	showMapMarkerButtons: function(markers) {
		if (!markers) {
			return;
		}
		for (let key in markers) {
			let id = key.toLowerCase() + '-markers';

			// add new region
			//
			this.addRegion(id, '#' + id);

			// add new buttons
			//
			this.showChildView(id, new MapMarkerButtonsView({
				markers: markers[key]
			}));
		}
	}
}));