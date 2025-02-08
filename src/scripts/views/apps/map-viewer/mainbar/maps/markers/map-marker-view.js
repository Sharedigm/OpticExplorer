/******************************************************************************\
|                                                                              |
|                              map-marker-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a svg map marker.                              |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';

export default MarkerView.extend({

	//
	// attributes
	//

	className: 'map marker',
	width: 25,
	height: 50,
	layer: 'overlay',

	template: template('<img src="images/icons/binary/location-icon-solid.svg" />'),

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this, options);
	},

	//
	// attribute methods
	//

	title: function() {
		return this.model.get('name');
	},
	
	attributes: function() {
		let point = this.options.map.projection.latLonToVector2({
			latitude: this.model.get('latitude'),
			longitude: this.model.get('longitude')
		});

		if (!this.options.viewport) {
			return {};
		}

		point = point.plus(this.options.viewport.offset);
		point = point.scaledBy(1 / this.options.viewport.scale);

		return {
			x: point.x + 'mm',
			y: point.y + 'mm',
			width: this.width / this.options.viewport.scale,
			height: this.height / this.options.viewport.scale
		};
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.$el.css({
			fill: 'grey',
			stroke: 'white',
			'stroke-width': 2,
			overflow: 'visible'
		});
	}
});