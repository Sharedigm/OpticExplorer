/******************************************************************************\
|                                                                              |
|                         elements-annotation-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of focus points.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import AnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/annotation-view.js';
import ArrowView from '../../../../../../../views/svg/shapes/arrow-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import AxisView from '../../../../../../../views/svg/shapes/axis-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';
import Ray2 from '../../../../../../../utilities/math/ray2.js';
import '../../../../../../../utilities/scripting/array-utils.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'elements annotation',

	//
	// constructor
	//

	initialize: function() {
		let paths = this.collection.getPaths();

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
		if (!first || !last || !paths.focus) {
			return;
		}

		let points = {
			entrance: {
				first: first[1],
				last: last[1]
			},
			exit: {
				first: first.last(1),
				last: last.last(1)
			}
		};

		let directions = {
			entrance: {
				first: first[1].minus(first[0]),
				last: last[1].minus(last[0])
			},
			exit: {
				first: first.last(0).minus(first.last(1)),
				last: last.last(0).minus(last.last(1))
			}
		};

		let rays = {
			entrance: {
				first: new Ray2(points.entrance.first, directions.entrance.first),
				last: new Ray2(points.entrance.last, directions.entrance.last)
			},
			exit: {
				first: new Ray2(points.exit.first, directions.exit.first),
				last: new Ray2(points.exit.last, directions.exit.last)
			}
		};

		// compute principal points
		//
		let exitPupilDistance = this.collection.getValue('exit_pupil_distance');
		let exitPupilCenter = new Vector2(exitPupilDistance, 0);
		let exitPupilPerpendicular = new Ray2(exitPupilCenter, new Vector2(0, 1));

		points.principal = {
			first: rays.exit.first.intersection(exitPupilPerpendicular),
			last: rays.exit.last.intersection(exitPupilPerpendicular),
			middle: exitPupilCenter
		};

		// create models
		//
		this.models = {

			// entrance lines
			//
			first_entrance: new Line({
				point1: points.entrance.first,
				point2: points.principal.first
			}),
			last_entrance: new Line({
				point1: points.entrance.last,
				point2: points.principal.last
			}),

			// principal plane
			//
			principal_point: new Point({
				location: points.principal.middle
			}),
			principal_line: new Line({
				point1: points.principal.first,
				point2: points.principal.last
			}),

			// exit lines
			//
			first_exit: new Line({
				point1: points.principal.first,
				point2: points.exit.first
			}),
			last_exit: new Line({
				point1: points.principal.last,
				point2: points.exit.last
			}),

			// focal annotations
			//
			focal_point: new Point({
				location: paths.focus
			}),
			focal_length: new Line({
				point1: new Vector2(points.principal.middle.x, points.principal.first.y),
				point2: new Vector2(paths.focus.x, points.principal.first.y)
			})
		}

		// create subviews
		//
		this.views = {

			// entrance lines
			//
			first_entrance: new ArrowView({
				model: this.models.first_entrance,
				dimensioning: true,
				viewport: this.options.viewport
			}),
			last_entrance: new ArrowView({
				model: this.models.last_entrance,
				dimensioning: true,
				viewport: this.options.viewport
			}),

			// principal plane
			//
			principal_plane: new AxisView({
				model: this.models.principal_point,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),
			principal_line: new DimensioningLineView({
				model: this.models.principal_line,
				text: "EPD=",
				viewport: this.options.viewport
			}),

			// exit lines
			//
			first_exit: new ArrowView({
				model: this.models.first_exit,
				dimensioning: true,
				viewport: this.options.viewport
			}),
			last_exit: new ArrowView({
				model: this.models.last_exit,
				dimensioning: true,
				viewport: this.options.viewport
			}),

			// focal annotations
			//
			focal_plane: new AxisView({
				model: this.models.focal_point,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),
			focal_length: new DimensioningLineView({
				model: this.models.focal_length,
				text: "fl=",
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
		let paths = this.collection.getPaths();

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
		if (!first || !last || !paths.focus) {
			return;
		}

		let points = {
			entrance: {
				first: first[1],
				last: last[1]
			},
			exit: {
				first: first.last(1),
				last: last.last(1)
			}
		};

		let directions = {
			entrance: {
				first: first[1].minus(first[0]),
				last: last[1].minus(last[0])
			},
			exit: {
				first: first.last(0).minus(first.last(1)),
				last: last.last(0).minus(last.last(1))
			}
		};

		let rays = {
			entrance: {
				first: new Ray2(points.entrance.first, directions.entrance.first),
				last: new Ray2(points.entrance.last, directions.entrance.last)
			},
			exit: {
				first: new Ray2(points.exit.first, directions.exit.first),
				last: new Ray2(points.exit.last, directions.exit.last)
			}
		};

		// compute principal points
		//
		let exitPupilDistance = this.collection.getValue('exit_pupil_distance');
		let exitPupilCenter = new Vector2(exitPupilDistance, 0);
		let exitPupilPerpendicular = new Ray2(exitPupilCenter, new Vector2(0, 1));

		points.principal = {
			first: rays.exit.first.intersection(exitPupilPerpendicular),
			last: rays.exit.last.intersection(exitPupilPerpendicular),
			middle: exitPupilCenter
		};

		// update entrance lines
		//
		this.models.first_entrance.set({
			point1: points.entrance.first,
			point2: points.principal.first
		});
		this.models.last_entrance.set({
			point1: points.entrance.last,
			point2: points.principal.last
		});

		// update principal plane
		//
		this.models.principal_point.set({
			location: points.principal.middle
		});
		this.models.principal_line.set({
			point1: points.principal.first,
			point2: points.principal.last
		});

		// update exit lines
		//
		this.models.first_exit.set({
			point1: points.principal.first,
			point2: points.exit.first
		});
		this.models.last_exit.set({
			point1: points.principal.last,
			point2: points.exit.last
		});

		// update focal annotations
		//
		this.models.focal_point.set({
			location: paths.focus
		});
		this.models.focal_length.set({
			point1: new Vector2(points.principal.middle.x, points.principal.first.y),
			point2: new Vector2(paths.focus.x, points.principal.first.y)	
		});
	},

	showFocusAnnotations: function() {
		this.views.first_entrance.show();
		this.views.last_entrance.show();
		this.views.first_exit.show();
		this.views.last_exit.show();
	},

	hideFocusAnnotations: function() {
		this.views.first_entrance.hide();
		this.views.last_entrance.hide();
		this.views.first_exit.hide();
		this.views.last_exit.hide();
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