/******************************************************************************\
|                                                                              |
|                                shape-view.js                                 |
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

import BaseView from '../../../views/base-view.js';
import SVGRenderable from '../../../views/svg/behaviors/svg-renderable.js';

export default BaseView.extend(_.extend({}, SVGRenderable, {

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.layer) {
			this.layer = this.options.layer;
		}

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// svg rendering methods
	//

	attributes: function() {
		return {
			d: this.toDrawing()
		};
	},
	
	update: function() {
		this.$el.attr(this.attributes());
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
}));