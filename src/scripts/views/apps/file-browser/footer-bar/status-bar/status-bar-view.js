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

import Items from '../../../../../collections/storage/items.js';
import BaseView from '../../../../../views/base-view.js';
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: "status",

	template: template(`
		<% if (show_size_input) { %>
		<div class="inline input toolbar">
			<input class="size" type="range" min="0" max="2" step="1" value="<%= size %>" />
		</div>
		<% } %>
		
		<% if (show_map) { %>
		<div class="map-view toolbar">
			<button class="show-map button btn-sm"<% if (showing_map) { %> style="display:none"<% } %> data-toggle="tooltip" title="Show Map" data-placement="top">
				<i class="fa fa-map"></i>
			</button>
			<button class="hide-map button btn-sm"<% if (!showing_map) { %> style="display:none"<% } %> data-toggle="tooltip" title="Hide Map" data-placement="top">
				<i class="fa fa-th"></i>
			</button>
		</div>
		<% } %>
		
		<% if (show_magnify) { %>
		<div class="icon-size toolbar desktop-only">
			<button class="magnify button btn-sm"<% if (magnified) { %> style="display:none"<% } %> data-toggle="tooltip" title="Magnify" data-placement="top">
				<i class="fa fa-search-plus"></i>
			</button>
			<button class="unmagnify button btn-sm"<% if (!magnified) { %> style="display:none"<% } %> data-toggle="tooltip" title="Unmagnify" data-placement="top">
				<i class="fa fa-search-minus"></i>
			</button>
		</div>
		<% } %>
		
		<span class="info-bar">
			<i class="fa fa-file"></i>
			<% if (num_selected > 0 && num_items > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_items %> items selected
			<% } %>
			<% } else if (num_items != undefined) { %>
			<%= num_items %> items
			<% } else { %>
			Loading...
			<% } %>
		</span>
	`),
	
	events: {
		'click .show-map': 'onClickShowMap',
		'click .hide-map': 'onClickHideMap',

		'click .magnify': 'onClickMagnify',
		'click .unmagnify': 'onClickUnMagnify',

		'input input.size': 'onChangeSizeSlider'
	},

	//
	// getting methods
	//

	getTileSize: function() {
		let size = parseInt(this.$el.find('.size').val());
		return this.integerToSize(size);
	},

	//
	// setting methods
	//

	setShowMap: function(showMap) {
		if (showMap) {
			this.$el.find('.show-map').show();
			this.$el.find('.hide-map').hide();
		} else {
			this.$el.find('.show-map').hide();
			this.$el.find('.hide-map').show();
		}
	},

	setMagnified: function(magnified) {
		if (magnified) {
			this.$el.find('.magnify').show();
			this.$el.find('.unmagnify').hide();
		} else {
			this.$el.find('.magnify').hide();
			this.$el.find('.unmagnify').show();
		}
	},

	setOption: function(kind, value) {
		this.getParentView('app').setOption(kind, value);
	},

	//
	// converting methods
	//

	sizeToInteger: function(size) {
		switch (size) {
			case 'small':
				return 0;
			case 'medium':
				return 1;
			case 'large':
				return 2;
			default:
				return 1;
		}
	},

	integerToSize: function(value) {
		switch (value) {
			case 0:
				return 'small';
			case 1:
				return 'medium';
			case 2:
				return 'large';
			default:
				return 'medium';
		}
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		let app = this.parent.app;
		let model = app.getActiveModel();
		let preferences = app.preferences;

		return {
			num_items: app.numVisibleItems(),
			
			// show selected
			//
			num_selected: app.numSelected(),
			is_mobile: Browser.is_mobile,

			// show on map
			//
			show_map: model && model.hasItems(Items.filters.is_geolocated),
			showing_map: preferences.get('view_kind') == 'maps',

			// show magnified
			//
			show_magnify: true,
			magnified: preferences.get('view_kind') == 'pages',

			// show tile size slider
			//
			show_size_input: preferences.get('view_kind') == 'tiles',
			size: this.sizeToInteger(preferences.get('tile_size'))
		};
	},

	onRender: function() {
		this.addTooltips({
			container: this.$el
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	},

	onChangeSizeSlider: function() {

		// update app
		//
		this.setOption('tile_size', this.getTileSize());
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	},

	onChangeSelection: function() {
		this.update();
	},

	//
	// mouse event handling methods
	//

	onClickShowMap: function() {
		let preferences = this.parent.app.preferences;

		// update button
		//
		this.setShowMap(false);

		// save view kind
		//
		this.viewKind = preferences.get('view_kind');

		// update app
		//
		this.setOption('view_kind', 'maps');
	},

	onClickHideMap: function() {

		// update button
		//
		this.setShowMap(true);

		// update app
		//
		this.setOption('view_kind', this.viewKind);
	},

	onClickMagnify: function() {
		let preferences = this.parent.app.preferences;

		// update view
		//
		this.setMagnified(false);

		// save view kind
		//
		if (preferences.get('view_kind') != 'maps') {
			this.viewKind = preferences.get('view_kind');
		}

		// update app
		//
		this.setOption('view_kind', 'pages');
	},

	onClickUnMagnify: function() {

		// update view
		//
		this.setMagnified(true);

		// update app
		//
		this.setOption('view_kind', this.viewKind);
	}
});