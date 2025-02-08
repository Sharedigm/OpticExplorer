/******************************************************************************\
|                                                                              |
|                             map-overlay-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an orthographic map overlay.                   |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../../models/base-model.js';
import Path from '../../../../../../models/shapes/path.js';
import BaseView from '../../../../../../views/base-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import SVGRenderable from '../../../../../../views/svg/behaviors/svg-renderable.js';
import PathView from '../../../../../../views/svg/shapes/path-view.js';
import ImageView from '../../../../../../views/svg/shapes/image-view.js';

export default BaseView.extend(_.extend({}, Selectable, SVGRenderable, {

	//
	// attributes
	//

	tagName: 'g',
	className: 'ortho',
	layer: 'overlay',

	//
	// svg rendering methods
	//

	onRender: function() {

		// get map image url
		//
		let href = this.options.max_size? this.model.getThumbnailUrl({
			max_size: this.options.max_size
		}): this.model.getUrl();

		// get overlay attributes
		//
		let vertices = this.model.getOverlayVertices(this.options.viewport);
		let rotation = this.model.getOverlayRotation(this.options.viewport);
		let size = this.model.getOverlaySize(this.options.viewport);
		let width = size.width;
		let height = size.height;

		// compute origin
		//
		let offset = (vertices[0].rotatedBy(-rotation)).minus(vertices[0]);
		let origin = vertices[0].plus(offset);

		// add path / stroked view
		//
		this.$el.append(new PathView({
			model: new Path({
				vertices: this.model.getBoundingBoxVertices(origin, width, height, rotation)
			}),
			viewport: this.options.viewport
		}).toElement());

		// add image / filled view
		//
		this.$el.append(new ImageView({
			model: new BaseModel({
				href: href,
				x: origin.x,
				y: origin.y,
				width: width,
				height: height,
				rotation: rotation
			}),
			viewport: this.options.viewport
		}).toElement());

		// set initial state
		//
		if (this.options.selected) {
			this.select({
				silent: true
			});
		}
	}
}));