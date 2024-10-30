/******************************************************************************\
|                                                                              |
|                             lens-markers-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a marker on the Abbe glass diagram.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectableCollectionView from '../../../../../../views/collections/selectable-collection-view.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';
import LensMarkerView from '../../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/markers/lens-marker-view.js';

export default SelectableCollectionView.extend(_.extend({}, SVGCollectionRenderable, {

	//
	// attributes
	//

	className: 'lens markers',
	childView: LensMarkerView,
	layer: 'overlay',

	//
	// constructor
	//

	initialize: function() {
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			viewport: this.options.viewport,
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		};
	},

	//
	// updating methods
	//

	updateColors: function() {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			childView.updateColor();
		}
	},

	//
	// collection event handling methods
	//

	onAdd: function(model) {
		this.addChildModel(model);
	},

	onRemove: function(model) {
		this.removeChildModel(model);
	}
}));