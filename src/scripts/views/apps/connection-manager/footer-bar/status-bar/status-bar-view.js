/******************************************************************************\
|                                                                              |
|                               status-bar-view.js                             |
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
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: "status-bar",

	template: template(`
		<% if (show_size_input) { %>
		<div class="inline input toolbar">
			<input class="size" type="range" min="0" max="2" step="1" value="<%= size %>" />
		</div>
		<% } %>
		
		<% if (show_map) { %>
		<div class="map-view toolbar">
			<button class="show-map button btn-sm"<% if (showing_map) { %> style="display:none"<% } %> data-toggle="tooltip" title="Show Map">
				<i class="fa fa-map"></i>
			</button>

			<button class="hide-map button btn-sm"<% if (!showing_map) { %> style="display:none"<% } %> data-toggle="tooltip" title="Hide Map">
				<i class="fa fa-th"></i>
			</button>
		</div>
		<% } %>
		
		<span class="num-connections info-bar">
		<i class="fa fa-user-friends"></i>
		<% if (num_selected) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_items %> connections selected
			<% } %>
		<% } else { %>
			<%= num_items %> connections
		<% } %>
		</span>
	`),

	events: {
		'click .show-map': 'onClickShowMap',
		'click .hide-map': 'onClickHideMap',

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
		let collection = app.hasChildView('content')? app.getChildView('content').collection : app.collection;
		let preferences = app.preferences;

		return {
			num_items: collection? collection.length : 0,

			// show selected
			//
			num_selected: app.numSelected(),
			is_mobile: Browser.is_mobile,

			// show on map
			//
			show_map: collection.hasGeolocation(),
			showing_map: preferences.get('view_kind') == 'maps',

			// show tile size slider
			//
			show_size_input: app.preferences.get('view_kind') == 'tiles',
			size: this.sizeToInteger(app.preferences.get('tile_size'))
		};
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
	}
});