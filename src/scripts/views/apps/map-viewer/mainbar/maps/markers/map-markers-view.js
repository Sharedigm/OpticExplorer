/******************************************************************************\
|                                                                              |
|                             map-markers-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying map markers.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MapViewportView from '../../../../../../views/apps/map-viewer/mainbar/maps/map-viewport-view.js';

export default MapViewportView.extend({

	//
	// attributes
	//

	updateInterval: 1000,

	// min and max of continental US
	//
	minLatitude: 24.7433195,
	maxLatitude: 49.3457868,
	minLongitude: -124.7844079,
	maxLongitude: -66.9513812,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MapViewportView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.seconds = this.getSeconds();
	},

	getSeconds: function() {
		return new Date().getTime() / 1000;
	},

	getElapsedTime: function() {
		return this.getSeconds() - this.seconds;
	},

	//
	// setting methods
	//

	setMarkersScale: function(scale) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).setScale(scale);
		}
	},

	//
	// marker loading methods
	//

	load: function(params, options) {

		// only perform one fetch at a time
		//
		if (this.request) {
			return;
		}

		// manually clear previous children
		// (we shouldn't have to do this)
		//
		this.children._init();

		// fetch new map markers
		//
		this.request = this.collection.fetch(_.extend(params, {
			date: this.options.date,
			time: this.options.time,

			// callbacks
			//
			success: (collection) => {
				this.request = null;

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
				}
			},

			error: () => {
				this.request = false;

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}			
			}
		}));
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		MapViewportView.prototype.onAttach.call(this);

		// show child views
		//
		this.loadMarkers({

			// callbacks
			//
			success: (collection) => {
				this.showMarkers(collection);
			}
		});

		if (this.interval) {
			window.clearInterval(this.interval);
		}
		this.interval = window.setInterval(() => {
			if (this.dirty) {
				this.reloadMarkers();
				this.dirty = false;
				this.$el.removeClass('unclickable');
			}
		}, this.updateInterval);
	},

	loadMarkers: function(options) {
		let mapBounds = this.getMapBounds();

		// restrict bounds to continental US
		//
		if (mapBounds.min_latitude < this.minLatitude) {
			mapBounds.min_latitude = this.minLatitude;
		}
		if (mapBounds.max_latitude > this.maxLatitude) {
			mapBounds.max_latitude = this.maxLatitude;
		}
		if (mapBounds.min_longitude < this.minLongitude) {
			mapBounds.min_longitude = this.minLongitude;
		}
		if (mapBounds.max_longitude > this.maxLongitude) {
			mapBounds.max_longitude = this.maxLongitude;
		}

		this.load({

			// geographical window
			//
			minLat: mapBounds.min_latitude,
			minLon: mapBounds.min_longitude,
			maxLat: mapBounds.max_latitude,
			maxLon: mapBounds.max_longitude,

			// limit number of results
			//
			limit: this.options.limit
		}, options);
	},

	showMarkers: function(collection) {
		for (let i = 0; i < collection.length; i++) {
			this.showMarker(collection.at(i));
		}
	},

	showMarker: function(model) {
		this.show(new this.options.marker({
			model: model,
			viewport: this
		}));
	},

	updateMarkers: function() {
		this.clearMarkers();
		this.removePopovers();
		this.showMarkers(this.collection);
	},

	reloadMarkers: function() {
		if (!this.request) {
			this.loadMarkers({

				// callbacks
				//
				success: (collection) => {
					this.collection = collection;
					if (collection && collection.length > 0) {
						this.updateMarkers();
					}
				}
			});
		}
	},

	clearMarkers: function() {
		this.$el.find('.marker').remove();
	},

	removePopovers: function() {
		$('.popover').remove();
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {

		// call superclass method
		//
		MapViewportView.prototype.onChange.call(this, attribute);

		// flag markers for update
		//
		this.dirty = true;

		// if zoom is significant and not alredy updating, then update
		//
		if (attribute == 'scale') {
			this.setMarkersScale(this.scale);
		}

		// make layer unclickable while changing
		//
		this.$el.addClass('unclickable');
	},

	onEndDrag: function() {
		if (this.request) {
			return;
		}

		// if drag is significant and not alredy updating, then update
		//
		this.parent.updateLayers();
	},

	onResize: function() {

		// call superclass method
		//
		MapViewportView.prototype.onResize.call(this);

		// update markers
		//
		this.onChange('scale');
	},

	onBeforeDestroy: function() {
		if (this.interval) {
			window.clearInterval(this.interval);
		}
	}
});