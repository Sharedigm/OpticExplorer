/******************************************************************************\
|                                                                              |
|                          general-prefs-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="use-my-location form-group" style="display:none">
			<label class="control-label"><i class="fa fa-crosshairs"></i>Location</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox"<% if (use_my_location) { %> checked<% } %>>Use My Actual Location</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Location" data-content="This is whether or not to show the user's actual location as the initial map location."></i>
			</div>
		</div>
		
		<div class="coordinates form-group"<% if (use_my_location) { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-globe-americas"></i>Coordinates</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="latitude form-control" value="<%= latitude %>">
					<span class="input-group-addon">&degN</span>
					<input type="text" class="longitude form-control" value="<%= longitude %>">
					<span class="input-group-addon">&degW</span>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Coordinates" data-content="This is the latitude/longitude coordinates to use for the inital map location."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="zoom-level form-group">
			<label class="control-label"><i class="fa fa-search"></i>Zoom Level</label>
			<div class="controls">
				<div class="input-group" style="width:100px">
					<input type="number" class="form-control" min="1" max="20" step="0.1" value="<%= zoom_level %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Zoom Level" data-content="This is the initial map zoom level."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="max-zoom-level form-group">
			<label class="control-label"><i class="fa fa-search"></i>Max Zoom Level</label>
			<div class="controls">
				<div class="input-group" style="width:100px">
					<input type="number" class="form-control" min="1" max="20" step="1" value="<%= max_zoom_level %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Max Zoom Level" data-content="This is the maxmimum map zoom level."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="map-mode form-group" style="margin-bottom:10px">
			<label class="control-label"><i class="fa fa-map"></i>Map Mode</label>
			<div class="controls">
				<select>
					<option value="map"<% if (map_mode == "map") { %> selected<% } %>>Map</option>
					<option value="aerial"<% if (map_mode == "aerial") { %> selected<% } %>>Aerial</option>
					<option value="hybrid"<% if (map_mode == "hybrid") { %> selected<% } %>>Hybrid</option>
				</select>
				
				<% if (show_set_to_current) { %>
				<button class="set-to-current btn">
					<i class="fa fa-redo"></i>Set to Current
				</button>
				<% } %>
			</div>
		</div>
	`),

	events: {
		'click .use-my-location input': 'onClickUseMyLocation',
		'change .latitude': 'onChangeLatitude',
		'change .longitude': 'onChangeLongitude',
		'change .zoom-level input': 'onChangeZoomLevel',
		'change .max-zoom-level input': 'onChangeMaxZoomLevel',
		'change .map-mode select': 'onChangeMapMode',
		'click .set-to-current': 'onClickSetToCurrent'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'use_my_location':
				return this.$el.find('.use-my-location input').is(':checked');
			case 'latitude':
				return parseFloat(this.$el.find('.latitude').val());
			case 'longitude':
				return parseFloat(this.$el.find('.longitude').val());
			case 'zoom_level':
				return parseFloat(this.$el.find('.zoom-level input').val());
			case 'max_zoom_level':
				return parseFloat(this.$el.find('.max-zoom-level input').val());
			case 'map_mode':
				return this.$el.find('.map-mode select').val();
		}
	},

	getValues: function() {
		return {
			use_my_location: this.getValue('use_my_location'),
			latitude: this.getValue('latitude'),
			longitude: this.getValue('longitude'),
			zoom_level: this.getValue('zoom_level'),
			max_zoom_level: this.getValue('max_zoom_level'),
			map_mode: this.getValue('map_mode')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'latitude':
				this.$el.find('.latitude').val(value);
				break;
			case 'longitude':
				this.$el.find('.longitude').val(value);
				break;
			case 'zoom_level':
				this.$el.find('.zoom-level input').val(value);
				break;
			case 'max_zoom_level':
				this.$el.find('.max-zoom-level input').val(value);
				break;
			case 'map_mode':
				this.$el.find('.map-mode select').val(value);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_set_to_current: true
		};
	},

	onRender: function() {

		// set attributes
		//
		this.app = this.parent.parent.parent;

		// disable set to current if no map view
		//
		if (!this.app || !this.app.hasActiveView || !this.app.hasActiveView()) {
			this.$el.find('.set-to-current').prop('disabled', true);
		}
	},

	//
	// mouse event handling methods
	//

	onClickUseMyLocation: function(event) {
		if ($(event.target).is(':checked')) {
			this.$el.find('.coordinates').hide();
		} else {
			this.$el.find('.coordinates').show();
		}
	},

	onChangeLatitude: function() {
		this.onChangeValue('latitude', this.getValue('latitude'));
	},

	onChangeLongitude: function() {
		this.onChangeValue('longitude', this.getValue('longitude'));
	},

	onChangeZoomLevel: function() {
		this.onChangeValue('zoom_level', this.getValue('zoom_level'));
	},

	onChangeMaxZoomLevel: function() {
		this.onChangeValue('max_zoom_level', this.getValue('max_zoom_level'));
	},

	onChangeMapMode: function() {
		this.onChangeValue('map_mode', this.getValue('map_mode'));
	},

	onClickSetToCurrent: function() {
		if (this.app.hasActivePaneView()) {
			let mapView = this.app.getActivePaneView().getChildView('content');
			let latLon = mapView.getLatLon();
			this.setValue('latitude', latLon.latitude.toPrecision(7));
			this.setValue('longitude', latLon.longitude.toPrecision(7));
			this.setValue('zoom_level', mapView.getZoomLevel().toPrecision(2));
			this.setValue('map_mode', mapView.map.mode);
		}
	}
});