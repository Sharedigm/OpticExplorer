/******************************************************************************\
|                                                                              |
|                                   path-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an annotation and markup element.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShapeView from '../../../views/svg/shapes/shape-view.js';

export default ShapeView.extend({

	//
	// attributes
	//

	tagName: 'path',
	className: 'line',
	
	//
	// svg rendering methods
	//

	attributes: function() {
		return {
			'id': this.options.id,
			'd': this.toDrawing(),
			'fill': this.options.fill,
			'stroke': this.options.stroke,
			'data-toggle': this.options.title? 'tooltip' : '',
			'title': this.options.title
		};
	},

	toDrawing: function() {
		let vertices = this.model.get('vertices');
		if (vertices.length >= 2) {
			let vertex = vertices[0].scaledBy(this.options.viewport.pixelsPerMillimeter);
			let d = 'M ' + vertex.x + ' ' + vertex.y;
			for (let i = 1; i < vertices.length; i++) {
				vertex = vertices[i].scaledBy(this.options.viewport.pixelsPerMillimeter);
				d += ' L ' + vertex.x + ' ' + vertex.y;
			}
			if (this.options.closed) {
				d += ' Z';
			}
			return d;
		} else {
			return '';
		}
	}
});