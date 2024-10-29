/******************************************************************************\
|                                                                              |
|                              annotation-view.js                              |
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

import CollectionView from '../../../views/collections/collection-view.js';
import SVGScalable from '../../../views/svg/behaviors/svg-scalable.js';
import SVGCollectionRenderable from '../../../views/svg/behaviors/svg-collection-renderable.js';

export default CollectionView.extend(_.extend({}, SVGScalable, SVGCollectionRenderable, {

	//
	// attributes
	//

	tagName: 'g',
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

		// listen to viewport
		//
		if (this.options.viewport) {
			this.listenTo(this.options.viewport, 'change:scale', this.onChange);
			this.listenTo(this.options.viewport, 'change:labels', () => {
				this.$el.find('text').remove();
				this.$el.append(this.toText());
			});
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},

	onChangeScale: function() {
		this.update();
	}
}));