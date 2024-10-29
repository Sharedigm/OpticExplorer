/******************************************************************************\
|                                                                              |
|                               drag-selectable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of expanding / collapsing behavior.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Bounds from '../../../utilities/bounds/bounds.js';
import Bounds2 from '../../../utilities/bounds/bounds2.js';

export default {

	getBoundingElement: function() {
		return this.el;
	},

	getBounds: function() {
		let rect = this.getBoundingElement().getBoundingClientRect();

		// convert bounding rect to bounds
		//
		return new Bounds2(
			new Bounds(rect.left, rect.right),
			new Bounds(rect.top, rect.bottom)
		);
	}
};