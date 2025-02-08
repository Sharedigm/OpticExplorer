/******************************************************************************\
|                                                                              |
|                             map-viewport-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing maps.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AnnotatedViewportView from '../../../../../views/svg/annotation/annotated-viewport-view.js';
import MultiGridView from '../../../../../views/svg/viewports/grids/multi-grid-view.js';
import Vector2 from '../../../../../utilities/math/vector2.js';
import Units from '../../../../../utilities/math/units.js';

export default AnnotatedViewportView.extend({

	//
	// attributes
	//

	native_zoom_level: 17,
	tile_size: 50,
	layers: ['background', 'normal', 'overlay'],

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		AnnotatedViewportView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.setTo(options.map);
	},

	//
	// lat / lon converting methods
	//

	latLonToVector2: function(latLon) {
		let mapSize = this.getMapSize();
		let mapOffset = this.latLonToMapOffset(latLon);

		// wraparound longitude
		//
		if (mapOffset.x < mapSize / 2) {
			mapOffset.x += mapSize;
		}
		if (mapOffset.x > mapSize / 2) {
			mapOffset.x -= mapSize;
		}

		return mapOffset.scaledBy(this.map.numTiles() * this.tile_size);
	},

	latLonToMapOffset: function(latLon) {
		let center = this.latLonToMapCoords(this.map);
		let coords = this.latLonToMapCoords(latLon);
		return coords.minus(center);
	},

	latLonToLocation: function(latLon) {
		let mapSize = this.getMapSize();
		let mapCoords = this.latLonToMapCoords(this.map);
		let coords = this.latLonToMapCoords(latLon);
		let mapOffset = coords.minus(mapCoords).scaledBy(mapSize);
		return mapOffset.plus(this.offset);
	},

	//
	// map coordinate converting methods
	//

	toLatitude: function(y) {
		return this.map.projection.toLatitude(y);
	},

	toLongitude: function(x) {
		return this.map.projection.toLongitude(x);
	},

	mapCoordsToLatLon: function(point) {
		return this.map.projection.vector2ToLatLon(point);
	},

	latLonToMapCoords: function(latLon) {
		return this.map.projection.latLonToVector2(latLon);
	},

	//
	// display offset converting methods
	//

	offsetToLatLon: function(offset) {
		let h = offset.left - this.width / 2;
		let v = this.height / 2 - offset.top;
		let center = this.getMapCoords();
		let size = this.getMapSize() * this.scale;
		let x = center.x + h / size;
		let y = center.y - v / size;

		return {
			latitude: this.toLatitude(y),
			longitude: this.toLongitude(x)
		};
	},

	latLonToOffset: function(latLon) {
		let mapSize = this.getMapSize();
		let width = this.$el.width();
		let height = this.$el.height();
		let location = this.latLonToLocation(latLon);

		// wraparound longitude
		//
		if (location.x < mapSize / 2) {
			location.x += mapSize;
		}
		if (location.x > mapSize / 2) {
			location.x -= mapSize;
		}

		return {
			left: (width / 2) + location.x * this.scale,
			top: (height / 2) + location.y * this.scale
		};
	},

	//
	// lat / long getting methods
	//

	getLatitude: function() {
		return this.toLatitude(this.getMapY());
	},

	getLongitude: function() {
		return this.toLongitude(this.getMapX());
	},

	getLatLon: function() {
		return this.mapCoordsToLatLon(this.getMapCoords());
	},

	getCircumference: function(units) {
		let circumference = new Units(40000 * Math.cos(this.getLatitude() * Math.PI / 180), 'km');
		return circumference.in(units);
	},

	//
	// map coordinate getting methods
	//

	getMapX: function() {
		return this.getOffsetMapX(this.map.getX());
	},

	getMapY: function() {
		return this.getOffsetMapY(this.map.getY());
	},

	getMapCoords: function() {
		return this.getOffsetMapCoords(this.map.getCoords());
	},

	//
	// offset getting methods
	//

	getOffset: function() {
		return new Vector2(
			this.offset.x / this.pixelsPerMillimeter,
			this.offset.y / this.pixelsPerMillimeter
		);
	},

	getOffsetMapX: function(mapX) {
		if (this.offset) {
			mapX -= (this.offset.x / this.getMapSize());
		}
		return mapX;
	},

	getOffsetMapY: function(mapY) {
		if (this.offset) {
			mapY -= (this.offset.y / this.getMapSize());
		}
		return mapY;
	},

	getOffsetMapCoords: function(mapCoords) {
		if (this.offset) {
			mapCoords = mapCoords.minus(this.offset.scaledBy(1 / this.getMapSize()));
		}
		return mapCoords;
	},

	//
	// map size getting methods
	//

	getMapSize: function() {
		return this.map.numTiles() * this.tile_size * this.pixelsPerMillimeter;
	},

	getDimensions: function() {
		return new Vector2(
			this.width / this.scale / this.pixelsPerMillimeter,
			this.height / this.scale / this.pixelsPerMillimeter
		);
	},

	getZoomLevel: function() {
		return this.scaleToZoomLevel(this.scale);
	},

	getMapBounds: function() {
		let center = this.getMapCoords();
		let size = this.getMapSize() * this.scale;
		let width = this.$el.width();
		let height = this.$el.height();
		let minX = center.x - width / 2 / size;
		let maxX = center.x + width / 2 / size;
		let minY = center.y + height / 2 / size;
		let maxY = center.y - height / 2 / size;

		let minLatitude = this.toLatitude(minY);
		let maxLatitude = this.toLatitude(maxY);
		let minLongitude = -this.toLongitude(minX);
		let maxLongitude = -this.toLongitude(maxX);

		return {
			min_latitude: minLatitude,
			max_latitude: maxLatitude,
			min_longitude: minLongitude,
			max_longitude: maxLongitude,
		};
	},

	//
	// setting methods
	//

	setTo: function(map) {

		// set map to native zoom level
		//
		let zoomLevel = 0;
		if (map) {
			this.map = map.getCopy();
			zoomLevel = map.zoom_level;
			this.map.zoom_level = this.native_zoom_level;
		}

		// set viewport to scale of map
		//
		this.scale = zoomLevel? this.zoomLevelToScale(zoomLevel) : 1;
	},

	setMap: function(map) {
		this.map = map;
	},

	setLocation: function(location) {
		this.setOffset(this.latLonToMapCoords(location));
	},

	setOption: function(key, value) {
		switch (key) {

			// viewport options
			//
			case 'offset':
				this.setOffset(value);
				break;
			case 'scale':
				this.setScale(value);
				break;		
			case 'zoom_level':
				this.setZoomLevel(value);
				break;

			// annotation options
			//
			case 'arrow_style':
				this.setArrowStyle(value);
				break;
			case 'label_style':
				this.setLabelStyle(value);
				break;
		}
	},

	setOffset: function(offset, options) {
		let mapSize = this.getMapSize();

		// wraparound longitude
		//
		if (offset.x < -mapSize / 2) {
			offset.x += Math.round(mapSize);
		}
		if (offset.x > mapSize / 2) {
			offset.x -= Math.round(mapSize);
		}

		// clamp latitude
		//
		if (offset.y < -mapSize / 2) {
			offset.y = -mapSize / 2;
		}
		if (offset.y > mapSize / 2) {
			offset.y = mapSize / 2;
		}

		// call superclass method
		//
		AnnotatedViewportView.prototype.setOffset.call(this, offset, options);
	},

	setZoomLevel: function(zoomLevel, options) {
		this.setScale(this.zoomLevelToScale(zoomLevel), options);
	},

	//
	// converting methods
	//

	zoomLevelToScale: function(zoomLevel) {
		return 2 ** (zoomLevel * 2 - this.map.zoom_level);
	},

	scaleToZoomLevel: function(scale) {
		return (this.map.zoom_level + Math.log2(scale)) / 2;
	},
	
	//
	// panning methods
	//

	panToDirection: function(direction, options) {
		let offset;
		let amount = options && options.amount? options.amount : 0.25;

		switch (direction) {
			case 'north':
				offset = new Vector2(0, this.height * amount / this.scale);
				break;
			case 'south':
				offset = new Vector2(0, -this.height * amount / this.scale);
				break;
			case 'east':
				offset = new Vector2(-this.width * amount / this.scale, 0);
				break;
			case 'west':
				offset = new Vector2(this.width * amount / this.scale, 0);
				break;
		}
		this.panToOffset(this.offset.plus(offset), options);
	},

	//
	// zooming methods
	//

	zoomIn: function(options) {
		let zoomLevel = this.getZoomLevel() + 1;
		this.zoomTo(Math.clamp(zoomLevel, this.minZoom, this.maxZoom), options);
	},

	zoomOut: function(options) {
		let zoomLevel = this.getZoomLevel() - 1;
		this.zoomTo(Math.clamp(zoomLevel, this.minZoom, this.maxZoom), options);
	},

	zoomTo: function(zoomLevel, options) {
		let start = this.parent.getZoomLevel();
		let finish = typeof zoomLevel == 'string'? start : zoomLevel;
		let easing = 'swing';

		// check if we are still animating
		//
		if (this.animation) {
			this.animation.stop();
			this.animation = null;
			start = this.getZoomLevel();
			easing = 'easeOutCubic';

			// extend jquery easing
			//
			if (!$.easing.easeOutCubic) {
				$.extend($.easing, {
					easeOutCubic: function (x, t, b, c, d) {
						return c*((t=t/d-1)*t*t + 1) + b;
					},
				});
			}
		}

		// animate zoom
		//
		let delta = finish - start;
		if (delta != 0) {
			this.animation = $({t: 0}).animate({
				t: 1
			}, {
				duration: options && options.duration? options.duration * Math.abs(delta) : 1,
				easing: easing,

				// callbacks
				//
				step: (t) => {

					// interpolate zoom
					//
					this.setZoomLevel(start + delta * t);
				},

				complete: () => {
					this.animation = null;

					// perform callback
					//
					if (options && options.finish) {
						options.finish();
					}
				}
			});
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		AnnotatedViewportView.prototype.onAttach.call(this);

		// set initial scale
		//
		this.setScale(this.scale, {
			silent: true
		});

		// show viewport annotations
		//
		if (this.options.show_grid) {
			this.showGrid();
		}
	},

	showGrid: function() {

		// create grid view
		//
		if (!this.gridView) {
			this.gridView = new MultiGridView({
				viewport: this
			});
			this.show(this.gridView);
		}
	}
});