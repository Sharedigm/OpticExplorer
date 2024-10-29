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
		<div class="map-view-kind form-group">
			<label class="control-label"><i class="fa fa-image"></i>View Kind</label>
			<div class="controls">
		
				<div class="show-icons radio-inline">
					<label><input type="radio" name="map-view-kind" value="icons"<% if (map_view_kind == 'icons') { %> checked<% } %>>Icons</label>
				</div>
				
				<div class="show-lists radio-inline">
					<label><input type="radio" name="map-view-kind" value="lists"<% if (map_view_kind == 'lists') { %> checked<% } %>>Lists</label>
				</div>
		
				<div class="show-tiles radio-inline">
					<label><input type="radio" name="map-view-kind" value="tiles"<% if (map_view_kind == 'tiles') { %> checked<% } %>>Tiles</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Map View Kind" data-content="This is how items are displayed on the map."></i>
			</div>
		</div>
		
		<div class="show-layers form-group">
			<label class="control-label"><i class="fa fa-align-justify"></i>Layers</label>
			<div class="map-layers controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="crosshairs"<% if (map_layers.includes('crosshairs')) { %> checked<% } %>>Crosshairs</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="photos"<% if (map_layers.includes('photos')) { %> checked<% } %>>Photos</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="videos"<% if (map_layers.includes('videos')) { %> checked<% } %>>Videos</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="places"<% if (map_layers.includes('places')) { %> checked<% } %>>Places</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="favorites"<% if (map_layers.includes('favorites')) { %> checked<% } %>>Favorites</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="people"<% if (map_layers.includes('people')) { %> checked<% } %>>People</label>
				</div>
		
				<div class="checkbox-inline" style="display:none">
					<label><input type="checkbox" value="annotations"<% if (map_layers.includes('annotations')) { %> checked<% } %>>Annotations</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="weather"<% if (map_layers.includes('weather')) { %> checked<% } %>>Weather</label>
				</div>
			</div>
		</div>
		
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
		
				<div class="show-grid checkbox-inline">
					<label><input type="checkbox"<% if (show_grid) { %> checked<% } %>>Grid</label>
				</div>
		
				<div class="show-smoothing checkbox-inline">
					<label><input type="checkbox"<% if (show_smoothing) { %> checked<% } %>>Smoothing</label>
				</div>
		
				<div class="show-item-names checkbox-inline">
					<label><input type="checkbox"<% if (show_item_names) { %> checked<% } %>>Names</label>
				</div>
		
				<div class="show-geo-orientations checkbox-inline">
					<label><input type="checkbox"<% if (show_geo_orientations) { %> checked<% } %>>Orientations</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Show" data-content="This is whether or not to these items."></i>
			</div>
		</div>
	`),

	events: {
		'change .map-layers input': 'onChangeMapLayers',
		'change .view-kind input': 'onChangeViewKind',
		'change .show-grid input': 'onChangeShowGrid',
		'change .show-smoothing input': 'onChangeShowSmoothing',
		'change .show-item-names input': 'onChangeShowItemNames',
		'change .show-geo-orientations input': 'onChangeShowGeoOrientations'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'map_layers': 
				return this.getElementsValues('.show-layers input:checked');
			case 'map_view_kind':
				return this.$el.find('.map-view-kind input:checked').val();
			case 'show_grid':
				return this.$el.find('.show-grid input').is(':checked');
			case 'show_smoothing':
				return this.$el.find('.show-smoothing input').is(':checked');
			case 'show_item_names':
				return this.$el.find('.show-item-names input').is(':checked');
			case 'show_geo_orientations':
				return this.$el.find('.show-geo-orientations input').is(':checked');
		}
	},

	getValues: function() {
		return {
			map_layers: this.getValue('map_layers'),
			map_view_kind: this.getValue('map_view_kind'),
			show_grid: this.getValue('show_grid'),
			show_smoothing: this.getValue('show_smoothing'),
			show_item_names: this.getValue('show_icon_names'),
			show_geo_orientations: this.getValue('show_geo_orientations')
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
			case 'map_mode':
				this.$el.find('.map-mode select').val(value);
				break;
			case 'map_layers':
				this.getElementsByValues('.map-layers input', value).prop('checked', true);
				break;
			case 'view_kind':
				this.$el.find('.view-kind input[value="' + value + '"]').prop('checked', true);
				break;
			case 'show_grid':
				this.$el.find('.show-grid input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_smoothing':
				this.$el.find('.show-smoothing input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_item_names':
				this.$el.find('.show-item-names input[type="checkbox"]').prop('checked', value);
				break;
			case 'show_geo_orientations':
				this.$el.find('.show-geo-orientations input[type="checkbox"]').prop('checked', value);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			map_layers: this.model.get('map_layers') || []
		};
	},

	onRender: function() {

		// set attributes
		//
		this.app = this.parent.parent.parent;
	},

	//
	// event handling methods
	//

	onChangeMapLayers: function() {
		this.onChangeValue('map_layers', this.getValue('map_layers'));
	},

	onChangeViewKind: function() {
		this.onChangeValue('view_kind', this.getValue('view_kind'));
	},

	onChangeShowGrid: function() {
		this.onChangeValue('show_grid', this.getValue('show_grid'));
	},

	onChangeShowSmoothing: function() {
		this.onChangeValue('show_smoothing', this.getValue('show_smoothing'));
	},

	onChangeShowItemNames: function() {
		this.onChangeValue('show_item_names', this.getValue('show_item_names'));
	},

	onChangeShowGeoOrientations: function() {
		this.onChangeValue('show_geo_orientations', this.getValue('show_geo_orientations'));
	}
});