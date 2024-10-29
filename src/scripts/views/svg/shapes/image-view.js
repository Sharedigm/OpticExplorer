/******************************************************************************\
|                                                                              |
|                                image-view.js                                 |
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

	tagName: 'image',

	//
	// svg rendering methods
	//

	attributes: function() {
		return {
			'href': this.model.get('href'),
			'x': this.model.get('x') * this.options.viewport.pixelsPerMillimeter,
			'y': this.model.get('y') * this.options.viewport.pixelsPerMillimeter,
			'width': this.model.get('width') * this.options.viewport.pixelsPerMillimeter,
			'height': this.model.get('height') * this.options.viewport.pixelsPerMillimeter,
			'style': 'transform:rotate(' + (this.model.get('rotation') || 0) + 'deg)'
		};
	}
});