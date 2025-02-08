/******************************************************************************\
|                                                                              |
|                                  pdf-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing pdf files.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import ScrollableContainable from '../../../../views/behaviors/containers/scrollable-containable.js';
import Loadable from '../../../../views/behaviors/effects/loadable.js';
import FullScreenable from '../../../../views/behaviors/layout/full-screenable.js';
import '../../../../../vendor/pdfjs/build/pdf.js';

PDFJS.workerSrc = 'vendor/pdfjs/build/pdf.worker.js';

export default BaseView.extend(_.extend({}, ScrollableContainable, Loadable, FullScreenable, {

	//
	// attributes
	//
	
	className: 'inset pdf document',
	template: template(``),

	//
	// view attributes
	//

	scale: 1,
	pageNumber: 1,

	//
	// counting methods
	//

	numPages: function() {
		if (this.pdf) {
			return this.pdf.numPages;
		}
	},

	//
	// getting methods
	//

	getAspectRatio: function() {
		if (this.viewport) {
			return this.viewport.height / this.viewport.width;
		}
	},

	getViewport: function() {
		if (this.page) {
			return this.page.getViewport(this.constructor.scale);
		}
	},

	getViewportWidth: function() {
		if (this.page) {
			return this.getViewport().width;
		}
	},

	getViewportHeight: function() {
		if (this.page) {
			return this.getViewport().height;
		}
	},

	getViewportSize: function() {
		if (this.page) {
			return {
				width: this.getViewportWidth(),
				height: this.getViewportHeight()
			};
		}
	},

	getWidth: function() {
		return this.el.clientWidth;
	},

	getHeight: function() {
		return this.el.clientHeight;
	},

	getSelected: function() {
		return null;
	},

	getScale: function(zoomMode) {
		if (zoomMode) {
			switch (zoomMode) {
				case 'fit_width':
					return this.getWidth() / this.getViewportWidth();
				case 'fit_height':
					return this.getHeight() / this.getViewportHeight();
				case 'fit_size':
					return Math.min(this.getScale('fit_width'), this.getScale('fit_height'));
				case 'actual_size':
					return 1;
			}
		}

		return this.scale;
	},

	getZoom: function(zoomMode) {
		return this.getScale(zoomMode) * 100;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'background_color':
				this.$el.css('background-color', value || '');
				break;
		}
	},

	//
	// loading methods
	//

	loadFile: function(file) {

		// set attributes
		//
		this.model = file;
		this.scale = 1;
		this.pageNumber = 1;

		// clear previous page
		//
		this.clear();

		// show loading spinner
		//
		this.showSpinner();

		// get file info
		//
		file.fetch({
			details: 'size',

			// callbacks
			//
			success: (file) => {

				// read file
				//
				file.readBinary({
					processData: 'false',

					success: (data) => {

						// hide loading spinner
						//
						this.hideSpinner();

						// render pdf
						//
						this.showPdf(data);
					},

					error: () => {
						this.onError('Could not read pdf file.');
					}
				});
			}
		});
	},

	loadPage: function(pageNumber, options) {
		this.pageNumber = pageNumber;
		this.canvas = null;

		if (this.pdf) {

			// get page
			//
			this.pdf.getPage(pageNumber).then((page) => {

				// show loaded page
				//
				this.showPage(page, options);
			});
		}
	},

	readBinary: function(url, options) {
		let request = new XMLHttpRequest();
		
		// create get request
		//
		request.open('GET', url, true);
		request.responseType = "arraybuffer";

		// set callbacks
		//
		request.onload = function() {
			let arrayBuffer = request.response;
			let byteArray = new Uint8Array(arrayBuffer);
			options.success(byteArray);
		};
		request.onerror = options.error;

		// perform request
		//
		request.send();
		return request;
	},

	find: function(pattern) {
		/*
		if (pattern) {
			return false;
		} else {
			return undefined;
		}
		*/

		/*
		return this.pdf.eventBus.dispatch('find', {
			query: pattern,
			caseSensitive: false,
			highlightAll: true,
			findPrevious: true
		});
		*/

		this.pdf.pdfFindController.executeCommand('find', {
			caseSensitive: false,
			findPrevious: undefined,
			highlightAll: true,
			phraseSearch: true,
			query: pattern
		});
	},

	//
	// zooming methods
	//

	setZoom: function(zoom) {
		if (typeof zoom == 'string') {
			switch (zoom) {
				case 'fit_width':
					this.fitWidth();
					this.zoom = zoom;
					break;
				case 'fit_height':
					this.fitHeight();
					this.zoom = zoom;
					break;
				case 'fit_size':
					this.fitSize();
					this.zoom = zoom;
					break;
				case 'actual_size':
					this.setScale(1);
					this.zoom = undefined;
					break;
			}
		} else if (zoom) {
			this.setScale(zoom / 100);
			this.zoom = undefined;
		}
	},

	setScale: function(scale) {
		let position = this.getScrollPosition();
		this.scale = scale;

		if (this.page) {
			this.showPage(this.page);
			this.setScrollPosition(position);
		}

		// enable scrolling
		//
		this.$el.css('overflow-x', 'auto');
		this.$el.css('overflow-y', 'auto');
	},

	fitWidth: function() {
		this.setScale(this.getWidth() / this.getViewportWidth());

		// disable horizontal scrolling
		//
		this.$el.css('overflow-x', 'hidden');
		this.$el.css('overflow-y', 'auto');
	},

	fitHeight: function() {
		this.setScale(this.getHeight() / this.getViewportHeight());

		// disable vertical scrolling
		//
		this.$el.css('overflow-x', 'auto');
		this.$el.css('overflow-y', 'hidden');
	},

	fitSize: function() {
		if (this.getAspectRatio() < 1) {
			this.fitWidth();
		} else {
			this.fitHeight();
		}
		this.zoom = 'fit_size';
	},

	//
	// full screen methods
	//

	requestFullScreen: function() {
		let self = this;
		window.addEventListener('fullscreenchange', function(event) {

			// perform callback after a slight delay for repainting
			//
			window.setTimeout(() => {
				self.onFullScreenChange(event);
			}, 100);

			window.removeEventListener('fullscreenchange', this);
		});
		FullScreenable.requestFullScreen.call(this);
	},

	exifFullScreen: function() {
		FullScreenable.exitFullScreen.call(this);
		this.onResize();
	},

	//
	// rendering methods
	//

	showPdf: function(data) {
		PDFJS.getDocument(data).then((pdf) => {

			// hide loading spinner
			//
			this.hideSpinner();

			// store handle to pdf data
			//
			this.pdf = pdf;

			// load current page
			//
			this.loadPage(this.pageNumber, {

				// callbacks
				//
				success: () => {

					// perform callback
					//
					if (this.options.onload) {
						this.options.onload();
					}
				}
			});
		}).catch(() => {

			// hide loading spinner
			//
			this.hideSpinner();

			// show error dialog
			//
			this.onError('Could not read pdf document.');
		});
	},

	onRender: function() {

		// load model
		//
		if (this.model) {
			this.loadFile(this.model);
		}

		// apply preferences
		//
		if (this.options.preferences) {
			this.options.preferences.applyTo(this);
		}
	},

	showPage: function(page, options) {

		// set current page
		//
		this.page = page;

		// set initial scale
		//
		this.scale = this.getScale(this.zoom);

		// get viewport
		//
		let viewport = page.getViewport(this.scale * this.constructor.scale * this.constructor.pixelRatio);
		this.viewport = viewport;

		// clear previous page
		//
		this.clear();

		// create canvas
		//
		this.canvas = document.createElement('canvas');
		this.$el.append(this.canvas);

		// prepare canvas
		//
		let context = this.canvas.getContext('2d');
		this.canvas.height = viewport.height;
		this.canvas.width = viewport.width;
		$(this.canvas).css({
			width: viewport.width / this.constructor.pixelRatio,
			height: viewport.height / this.constructor.pixelRatio
		});

		// render canvas
		//
		page.render({
			canvasContext: context,
			viewport: viewport
		}).then(() => {
			this.onShow();

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
		});
	},

	showMessage: function(message) {
		this.$el.append($('<div class="message">' + message + '</div>'));
	},

	hideMessage: function() {
		this.$el.find('.message').remove();
	},

	clear: function() {
		this.$el.find('canvas').remove();
	},

	//
	// event handling methods
	//

	onShow: function() {

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow(this);
		}
	},

	onError: function(message) {

		// perform callback
		//
		if (this.options.onerror) {
			this.options.onerror(message);
		}			
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.zoom) {
			this.setZoom(this.zoom);
		}
	},

	onFullScreenChange: function() {
		this.onResize();
	}
}), {

	//
	// static attributes
	//

	scale: 1.5,
	pixelRatio: window.devicePixelRatio || 1
});