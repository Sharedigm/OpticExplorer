/******************************************************************************\
|                                                                              |
|                               text-label-view.js                             |
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
import SVGScalable from '../../../views/svg/behaviors/svg-scalable.js';

export default BaseView.extend(_.extend({}, SVGRenderable, SVGScalable, {

	//
	// attributes
	//

	tagName: 'g',
	className: 'label',
	layer: 'overlay',

	//
	// constructor
	//

	initialize: function(options) {

		// call mixin constructors
		//
		SVGScalable.initialize.call(this, options);

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// svg rendering methods
	//

	toElement: function() {
		let center = this.model.get('center');

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'text');

		// set attributes
		//
		$(el).attr({
			class: 'unscaled ' + this.className,
			x: center.x,
			y: center.y
		});
		$(el).text(this.model.get('text'));

		// unscale text
		//
		this.setElementScale(el, 1 / this.options.viewport.scale);

		return el;
	},

	onChangeScale: function() {
		this.setElementScale(this.$el, 1 / this.options.viewport.scale);
	}
}));