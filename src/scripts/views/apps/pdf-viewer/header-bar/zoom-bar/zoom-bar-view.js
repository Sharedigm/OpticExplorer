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
import ZoomInButtonView from '../../../../../views/apps/pdf-viewer/header-bar/zoom-bar/buttons/zoom-in-button-view.js';
import ZoomOutButtonView from '../../../../../views/apps/pdf-viewer/header-bar/zoom-bar/buttons/zoom-out-button-view.js';
import ZoomInputView from '../../../../../views/apps/pdf-viewer/header-bar/zoom-bar/inputs/zoom-input-view.js';
import FullScreenButtonView from '../../../../../views/apps/pdf-viewer/header-bar/zoom-bar/buttons/full-screen-button-view.js';

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

	zoomLevels: [
		25,
		33,
		50,
		66,
		75,
		100,
		125,
		150,
		200,
		300,
		400
	],

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.minZoom = this.zoomLevels[0];
		this.maxZoom = this.zoomLevels[this.zoomLevels.length - 1];
	},

	//
	// getting methods
	//

	getZoomMode: function() {
		return this.getChildView('zoom_mode').getValue();
	},

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
		let zoom = Math.ceil(this.parent.app.getZoom());
		let zoomLevel = Math.floor(this.getZoomLevel(zoom));
		return this.zoomLevels[zoomLevel < this.zoomLevels.length - 1? zoomLevel + 1 : this.zoomLevels.length - 1];
	},

	prevZoom: function() {
		let zoom = Math.floor(this.parent.app.getZoom());
		let zoomLevel = Math.ceil(this.getZoomLevel(zoom));
		return this.zoomLevels[zoomLevel > 0? zoomLevel - 1 : 0];
	},
	
	//
	// setting methods
	//
	
	setZoomMode: function(zoomMode) {

		// set selected zoom mode button
		//
		this.parent.getChildView('zoom_mode').setValue(zoomMode);

		// update zoom value
		//
		let zoom = this.parent.app.getZoom(zoomMode);
		this.getChildView('zoom_amount').setValue(Math.round(zoom));

		// perform callback
		//
		if (this.options.onzoom) {
			this.options.onzoom(zoomMode);
		}
	},

	setZoom: function(zoom) {

		// set selected zoom mode button
		//
		this.parent.getChildView('zoom_mode').setValue(zoom == 100? 'actual_size' : undefined);

		// update zoom value
		//
		this.getChildView('zoom_amount').setValue(Math.round(zoom));

		// perform callback
		//
		if (this.options.onzoom) {
			this.options.onzoom(zoom);
		}
	},

	//
	// zooming methods
	//

	zoomTo: function(zoom, options) {
		let start = this.getZoom();
		let finish = typeof zoom == 'string'? this.parent.app.getZoom(zoom) : zoom;
		let delta = finish - start;

		// animate zoom
		//
		if (delta != 0) {
			this.animation = $({t: 0}).animate({t: 1}, {
				duration: this.options.preferences? this.options.preferences.get('zoom_duration') : 0,

				// callbacks
				//
				step: (t) => {
					this.setZoom(start + delta * t);
				},

				complete: () => {
					this.animation = null;

					// set zoom mode
					//
					if (typeof zoom == 'string') {
						this.setZoomMode(zoom);
					} else if (zoom == 100) {
						this.setZoomMode('actual_size');
					} else {
						this.setZoomMode();
					}

					// perform callback
					//
					if (options && options.finish) {
						options.finish();
					}
				}
			});
		}
	},
	
	zoomIn: function(options) {
		this.zoomTo(this.nextZoom(), options);
	},

	zoomOut: function(options) {
		this.zoomTo(this.prevZoom(), options);
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
			zoom: this.options.zoom,
			levels: this.zoomLevels,

			// callbacks
			//
			onchange: (zoom) => this.setZoom(zoom)
		}));
		this.showChildView('fill_screen', new FullScreenButtonView({
			model: this.model
		}));

		// set initial state
		//
		this.setItemsEnabled(false);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set initial state
		//
		if (this.parent.app.model) {
			this.setZoomMode('fit_width');
		}

		// enable / disable buttons
		//
		this.setItemsEnabled(true);
	},

	onChangeZoom: function() {
		this.zoom = this.getChildView('zoom_amount').getZoom();

		// select / deselect actual size button
		//
		if (this.zoom == 100) {
			this.getChildView('zoom_mode').setValue('actual_size');
		} else {
			this.getChildView('zoom_mode').setValue();
		}

		this.parent.app.onChangeZoom(this.zoom);
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
