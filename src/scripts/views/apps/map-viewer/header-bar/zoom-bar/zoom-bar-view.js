/******************************************************************************\
|                                                                              |
|                               zoom-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a zoom toolbar.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import ZoomInButtonView from '../../../../../views/apps/map-viewer/header-bar/zoom-bar/buttons/zoom-in-button-view.js';
import ZoomOutButtonView from '../../../../../views/apps/map-viewer/header-bar/zoom-bar/buttons/zoom-out-button-view.js';
import ZoomInputView from '../../../../../views/apps/map-viewer/header-bar/zoom-bar/inputs/zoom-input-view.js';
import FullScreenButtonView from '../../../../../views/apps/map-viewer/header-bar/zoom-bar/buttons/full-screen-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="zoom-out" data-toggle="tooltip" title="Zoom Out" data-placement="bottom"></div>
		<div class="zoom-in" data-toggle="tooltip" title="Zoom In" data-placement="bottom"></div>
		<div class="zoom-amount" data-toggle="tooltip" title="Zoom" data-placement="bottom"></div>
		<div class="fill-screen hidden-xxs" data-toggle="tooltip" title="Full Screen"></div>
	`),

	regions: {
		zoom_in: '.zoom-in',
		zoom_out: '.zoom-out',
		zoom_amount: '.zoom-amount',
		fill_screen: '.fill-screen'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.minZoom = this.options.minZoom;
		this.maxZoom = this.options.maxZoom;
		this.zoomLevels = [];
		for (let i = this.minZoom; i <= this.maxZoom; i++) {
			this.zoomLevels.push(i);
		}

		// clamp zoom
		//
		if (this.options.zoom) {
			this.options.zoom = Math.clamp(this.options.zoom, this.minZoom, this.maxZoom);
		}
	},

	//
	// getting methods
	//

	getZoom: function() {
		let zoom = this.getChildView('zoom_amount').getValue();

		// clamp zoom to range
		//
		if (zoom < this.minZoom) {
			zoom = this.minZoom;
		}
		if (zoom > this.maxZoom) {
			zoom = this.maxZoom;
		}

		return zoom;
	},

	getZoomLevel: function(zoom) {
		if (zoom < this.minZoom) {
			return 0;
		} else if (zoom > this.maxZoom) {
			return this.zoomLevels.length - 1;
		} else {
			let i = 0;
			let found = false;
			while (!found && i < this.zoomLevels.length - 2) {
				if (this.zoomLevels[i + 1] > zoom) {
					found = true;
				} else {
					i++;
				}
			}
			let low = this.zoomLevels[i];
			let high = this.zoomLevels[i + 1];
			return i + (zoom - low) / (high - low);
		}
	},

	nextZoom: function() {
		let zoom = Math.ceil(this.getZoom());
		let zoomLevel = Math.floor(this.getZoomLevel(zoom));
		return this.zoomLevels[zoomLevel < this.zoomLevels.length - 1? zoomLevel + 1 : this.zoomLevels.length - 1];
	},

	prevZoom: function() {
		let zoom = Math.floor(this.getZoom());
		let zoomLevel = Math.ceil(this.getZoomLevel(zoom));
		return this.zoomLevels[zoomLevel > 0? zoomLevel - 1 : 0];
	},

	//
	// setting methods
	//

	setZoom: function(zoom, options) {

		// update zoom value
		//
		this.getChildView('zoom_amount').setValue(Math.round(zoom));

		// perform callback
		//
		if (this.options.onzoom && (!options || !options.silent)) {
			this.options.onzoom(zoom);
		}
	},

	//
	// zooming methods
	//

	zoomTo: function(zoomLevel) {
		this.parent.app.zoomTo(zoomLevel);
	},

	zoomIn: function() {
		this.zoomTo(this.nextZoom());
	},

	zoomOut: function() {
		this.zoomTo(this.prevZoom());
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('zoom_in', new ZoomInButtonView({
			model: this.model
		}));
		this.showChildView('zoom_out', new ZoomOutButtonView({
			model: this.model
		}));
		this.showChildView('zoom_amount', new ZoomInputView({
			model: this.model,

			// options
			//
			value: this.options.zoom,
			levels: this.zoomLevels,

			// callbacks
			//
			onchange: (zoom) => this.setZoom(zoom)
		}));
		this.showChildView('fill_screen', new FullScreenButtonView({
			model: this.model
		}));
	},

	onLoad: function() {

		// set initial state
		//
		if (this.parent.app.hasActivePaneView()) {
			this.setZoom(this.parent.app.getActivePaneView().getZoomLevel(), {
				silent: true
			});
		}

		// enable / disable buttons
		//
		this.setItemsEnabled(true);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		if (this.animation) {
			this.animation.stop();
		}
	}
});
