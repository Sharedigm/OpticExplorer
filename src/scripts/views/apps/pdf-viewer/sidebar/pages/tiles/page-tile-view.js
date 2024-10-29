/******************************************************************************\
|                                                                              |
|                               page-tile-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a page tile and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TileView from '../../../../../../views/items/tiles/tile-view.js';

export default TileView.extend({

	//
	// getting methods
	//

	getName: function() {
		return this.model.get('page_number');
	},

	getTileResolution: function(tileSize) {
		switch (tileSize || 'medium') {
			case 'small':
				return 75;
			case 'medium':
				return 100;
			case 'large':
				return 150;
		}
	},

	getIcon: function() {
		return '<i class="fa fa-file-alt"></i>';
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TileView.prototype.onRender.call(this);

		// display thumbnail
		//
		let pdf = this.model.get('pdf');
		let pageNumber = this.model.get('page_number');

		// get and show page
		//
		pdf.getPage(pageNumber).then((page) => {
			this.page = page;
			this.showPage(page);
		});
	},

	showPage: function(page) {
		let size = this.getTileResolution();
		let width = page.view[2];
		let height = page.view[3];
		let aspectRatio = height / width;
		let scale = aspectRatio > 1? size / height : size / width;
		let viewport = page.getViewport(scale * this.constructor.pixelRatio);

		// prepare canvas
		//
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');

		if (aspectRatio > 1) {

			// vertical
			//
			canvas.width = size / aspectRatio * this.constructor.pixelRatio;
			canvas.height = size * this.constructor.pixelRatio;
		} else {

			// horizontal
			//
			canvas.height = size * aspectRatio * this.constructor.pixelRatio;
			canvas.width = size * this.constructor.pixelRatio;
		}

		// render canvas
		//
		page.render({
			canvasContext: context,
			viewport: viewport
		}).then(() => {

			// replace placeholder icon with canvas
			//
			this.$el.find('i').replaceWith(canvas);
		});
	}
}, {

	//
	// static attributes
	//

	pixelRatio: window.devicePixelRatio || 1
});