/******************************************************************************\
|                                                                              |
|                             station-marker-view.js                           |
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

	width: 16,
	height: 16,
	icon_path: 'images/markers/weather/clouds',
	popover_icon_path: 'images/icons/binary/wind-sock-icon.svg',

	//
	// constructor
	//

	initialize: function(options) {
		this.options.icon = this.getIcon();

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this, options);
	},

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
		return this.model.getSkyCover();
	},

	getLocation: function() {
		return this.options.viewport.latLonToVector2({
			latitude: this.model.get('latitude'),
			longitude: -this.model.get('longitude')
		});
	},

	getTooltipIcon: function() {
		return '<div class="svg icon">' + this.constructor.popover_icon + '</div>';
	},

	getPopoverTitle: function() {
		return this.getTooltipIcon() + this.model.get('station_id');
	},

	getPopoverContent: function() {
		let content = '';
		content += '<span class="title"><i class="fa fa-globe"></i>LAT / LON </span>';			
		content += '<span class="geolocation">' + this.model.getLatLonStr() + '</span>';
		content += '<br />';
		content += '<span class="title"><i class="fa fa-clock"></i>TIME </span>';
		content += '<span class="time">' + this.model.get('observation_time') + '</span>';
		content += '<br />';
		content += '<div class="title"><i class="fa fa-cloud-sun-rain"></i>METAR </div>';
		content += '<span class="metar">' + this.model.get('raw_text') + '</span>';
		return content;
	},

	//
	// rendering methods
	//

	fetchSVG: function(filename) {
		return fetch(this.icon_path + '/' + filename).then(response => response.text());
	},

	fetchIcon: function() {
		let iconName = this.getIconName();
		switch (iconName) {
			case 'few':
				return this.fetchSVG('FEW.svg');
			case 'bkn':
				return this.fetchSVG('BKN.svg');
			case 'ovc':
				return this.fetchSVG('OVC.svg');
			case 'sct':
				return this.fetchSVG('SCT.svg');
			case 'skc':
				return this.fetchSVG('SKC.svg');
			default:
				return this.model.getCategory() == 'missing'? this.fetchSVG('MISSING.svg') : this.fetchSVG('SKC.svg');
		}
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

		// add marker type
		//
		this.$el.addClass(this.model.getSkyCover());
		this.$el.addClass(this.model.getCategory());

		// add popover
		//
		if (!this.constructor.popover_icon) {
			fetch(this.popover_icon_path).then((response) => response.text()).then((icon) => {
				this.constructor.popover_icon = icon;
				this.addPopover();
			});
		} else {
			this.addPopover();
		}
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

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		/*
		this.hidePopovers();
		this.showPopover();
		*/
		this.block(event);
	}
}), {

	//
	// static attributes
	//

	icons: [],
	popover_icon: undefined
});