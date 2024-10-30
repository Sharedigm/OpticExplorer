/******************************************************************************\
|                                                                              |
|                                annotation-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying annotations of optical elements.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectableCollectionView from '../../../../../../views/collections/selectable-collection-view.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';

export default SelectableCollectionView.extend(_.extend({}, SVGCollectionRenderable, {

	//
	// attributes
	//

	className: 'annotation',
	layer: 'annotations',

	//
	// marker for drag handles
	//

	handle_icon: `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
			<circle cx="5" cy="5" r="2" />
		</svg>`,

	//
	// length of angle adjuster handles
	//

	handleLength: 20,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.models = this.getModels();
		this.views = this.getViews();

		// create children
		//
		for (let item in this.views) {
			this.children._add(this.views[item]);
		} 

		// listen for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
		this.listenTo(this.options.viewport, 'change:scale', this.onChange);
	},

	//
	// hiding methods
	//

	hide: function() {
		this.$el.addClass('hidden');
	},

	show: function() {
		this.$el.removeClass('hidden');
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
}));