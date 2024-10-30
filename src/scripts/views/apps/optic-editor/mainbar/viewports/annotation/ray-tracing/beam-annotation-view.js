/******************************************************************************\
|                                                                              |
|                           beam-annotation-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of focus points.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Arc from '../../../../../../../models/shapes/arc.js';
import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import DimensioningFocalRatioView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/ray-tracing/dimensioning-focal-ratio-view.js';
import '../../../../../../../utilities/scripting/array-utils.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'beam annotation',

	//
	// constructor
	//

	initialize: function() {
		let paths = this.model.get('paths');

		// find first and last unobstructed paths
		//
		let first = paths[paths.next(0, function(path) {
			return !path.obstructed && !path.reflected;
		})];
		let last = paths[paths.prev(paths.length - 1, function(path) {
			return !path.obstructed && !path.reflected;
		})];

		// check for paths
		//
		if (!first || !last || !paths.focus || first.length < 2 || last.length < 2) {
			return;
		}

		// create models
		//
		this.models = {

			// arc between exit lines
			//
			arc: new Arc({
				point1: last.projected? last.last(1) : last.last(2),
				point2: first.projected? first.last(1) : first.last(2),
				center: paths.focus
			})
		}

		// create subviews
		//
		this.views = {

			// arc between exit lines
			//
			arc: new DimensioningFocalRatioView({
				model: this.models.arc,
				text: 'F=',
				viewport: this.options.viewport
			})
		}

		// create children
		//
		for (let item in this.views) {
			this.children._add(this.views[item]);
		} 

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
		this.listenTo(this.model, 'select', this.onSelect);
		this.listenTo(this.model, 'deselect', this.onDeselect);
	},

	//
	// svg rendering methods
	//

	update: function() {
		let paths = this.model.get('paths');

		// find first and last unobstructed paths
		//
		let first = paths[paths.next(0, function(path) {
			return !path.obstructed && !path.reflected;
		})];
		let last = paths[paths.prev(paths.length - 1, function(path) {
			return !path.obstructed && !path.reflected;
		})];

		// check for paths
		//
		if (!first || !last || !paths.focus || first.length < 2 || last.length < 2) {
			return;
		}

		// update arc between exit lines
		//
		this.models.arc.set({
			point1: last.projected? last.last(1) : last.last(2),
			point2: first.projected? first.last(1) : first.last(2),
			center: paths.focus
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// on paths change
		//
		if (this.model.hasChanged('paths')) {
			this.update();
		}
	}
});