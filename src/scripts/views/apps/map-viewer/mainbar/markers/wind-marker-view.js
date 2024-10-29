/******************************************************************************\
|                                                                              |
|                               wind-marker-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SVGRenderable from '../../../../../views/svg/behaviors/svg-renderable.js';
import MarkerView from '../../../../../views/svg/shapes/marker-view.js';
import PopoverShowable from '../../../../../views/behaviors/tips/popover-showable.js';

export default MarkerView.extend(_.extend({}, PopoverShowable, {

	//
	// attributes
	//

	events: {
		mousedown: 'onMouseDown'
	},

	width: 60,
	height: 60,
	icon_path: 'images/markers/weather/wind',
	wind_sock_icon: '<img src="images/icons/binary/wind-sock-icon.svg" />',

	//
	// attribute methods
	//

	attributes: function() {
		let location = this.getLocation();
		return {
			'x': location.x + 'mm',
			'y': location.y + 'mm'
		};
	},

	//
	// querying methods
	//

	hasIcon: function() {
		let iconName = this.getIconName();
		return this.constructor.icons[iconName] != null;
	},

	//
	// getting methods
	//

	getIcon: function() {
		if (this.icon) {
			return this.icon;
		} else {
			let iconName = this.getIconName();
			return this.constructor.icons[iconName];
		}
	},

	getIconName: function() {
		let windSpeed = Math.round(Math.min(this.getWindSpeed(), 150) / 5) * 5;
		return 'WIND' + windSpeed;
	},

	getLocation: function() {
		return this.options.viewport.latLonToVector2({
			latitude: this.model.get('latitude'),
			longitude: -this.model.get('longitude')
		});
	},

	getPopoverTitle: function() {
		return '<div class="svg icon">' + this.wind_sock_icon + '</div>' + this.model.get('station_id');
	},

	getPopoverContent: function() {
		let content = '';
		content += '<span class="title"><i class="fa fa-globe"></i>LAT / LON </span>';			
		content += '<span class="geolocation">' + this.model.getLatLonStr() + '</span>';
		content += '<br />';
		content += '<span class="title"><i class="fa fa-clock"></i>TIME </span>';
		content += '<span class="time">' + this.model.get('issue_time') + '</span>';
		content += '<br />';
		content += '<span class="title"><i class="fa fa-wind"></i>WIND </span>';
		content += '<span class="metar">' + this.getWindSpeed() + 'kts from ' + this.getWindDirection() + '&deg;</span>';
		return content;
	},

	getWindLevel: function() {
		let mapView = this.options.viewport.parent.parent;
		return mapView.options.wind_level;
	},

	getWindSpeed: function() {
		return this.model.getWindSpeed(this.getWindLevel());
	},

	getWindDirection: function() {
		return this.model.getWindDirection(this.getWindLevel());
	},

	//
	// rendering methods
	//

	fetchSVG: function(filename) {
		return fetch(this.icon_path + '/' + filename).then(response => response.text());
	},

	fetchIcon: function() {
		return this.fetchSVG(this.getIconName() + '.svg');
	},

	appendIcon: function(svg, icon) {
		this.icon = icon;

		// update and add icon
		//
		this.setIconAttributes(this.icon);

		// create group and apply rotation
		//
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		$(group).css('transform', 'rotate(' + this.getWindDirection() + 'deg)');
		$(group).append(this.icon);
		svg.append(group);

		// set initial scale
		//
		this.setScale(this.options.viewport.scale);
	},

	addIcon: function(svg) {
		if (this.hasIcon()) {

			// append saved icon
			//
			this.appendIcon(svg, $(this.getIcon()));
		} else {
			this.fetchIcon().then((icon) => {

				// save fetched icon
				//
				let iconName = this.getIconName();
				this.constructor.icons[iconName] = icon;

				// append fetched icon
				//
				this.appendIcon(svg, $(icon));
			});
		}
	},

	toElement: function() {

		// create element
		//
		let el = SVGRenderable.toElement.call(this);

		// set attributes
		//
		this.addIcon(el);

		// set color attributes
		//
		if (this.model.has('color')) {
			let color = this.model.get('color');
			$(el).addClass('colored');
			$(el).attr('fill', color);
		}

		return el;
	},

	onRender: function() {

		// call superclass method
		//
		MarkerView.prototype.onRender.call(this);

		// add information popover
		//
		this.addPopover();
	},

	addPopover: function(options) {

		// add popover data
		//
		this.addPopoverAttrs();

		// show popovers on trigger
		//
		this.$el.addClass('popover-trigger').popover(_.extend({
			container: 'body',
			trigger: 'hover',
			placement: 'top'
		}, options));
	},
}), {

	//
	// static attributes
	//

	icons: [],
});