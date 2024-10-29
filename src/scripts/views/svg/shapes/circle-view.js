/******************************************************************************\
|                                                                              |
|                                 circle-view.js                               |
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

	tagName: 'circle',
	className: 'circle',

	//
	// svg rendering methods
	//

	attributes: function() {
		let center = this.model.get('center');
		let radius = this.model.get('radius');

		return {
			'cx': center.x * this.options.viewport.pixelsPerMillimeter,
			'cy': center.y * this.options.viewport.pixelsPerMillimeter,
			'r': radius * this.options.viewport.pixelsPerMillimeter
		};
	},

	update: function() {
		this.$el.attr(this.attributes());
	}
});