/******************************************************************************\
|                                                                              |
|                            focal-point-annotation-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying annotations of lens elements.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Point from '../../../../../../../models/shapes/point.js';
import Line from '../../../../../../../models/shapes/line.js';
import Path from '../../../../../../../models/shapes/path.js';
import ElementAnnotationView from '../../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/element-annotation-view.js';
import MarkerView from '../../../../../../../views/svg/shapes/marker-view.js';
import PathView from '../../../../../../../views/svg/shapes/path-view.js';
import AxisView from '../../../../../../../views/svg/shapes/axis-view.js';
import DimensioningLineView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-line-view.js';
import Vector2 from '../../../../../../../utilities/math/vector2.js';

export default ElementAnnotationView.extend({

	//
	// attributes
	//

	className: 'focal point annotation',

	//
	// rendering attributes
	//

	icons: {
		back: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<path d="M 6.043,19.496 4.561,21.001 C 1.77,18.8 0,15.588 0,12 0,8.412 1.77,5.2 4.561,3 L 6.043,4.504 C 3.717,6.339 2.239,9.016 2.239,12 c 0,2.984 1.478,5.661 3.804,7.496 z M 6.718,12 C 6.718,10.209 7.605,8.603 9,7.502 L 7.519,6 c -1.86,1.467 -3.04,3.608 -3.04,6 0,2.392 1.18,4.533 3.04,6 L 9,16.498 C 7.604,15.397 6.718,13.791 6.718,12 Z M 12,9 c -1.656,0 -3,1.343 -3,3 0,1.657 1.344,3 3,3 1.656,0 3,-1.343 3,-3 0,-1.657 -1.344,-3 -3,-3 z"/>
			</svg>`,
		front: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<path d="m 21.761,12 c 0,-2.984 -1.478,-5.661 -3.804,-7.496 L 19.439,3 C 22.23,5.2 24,8.412 24,12 c 0,3.588 -1.77,6.8 -4.561,9.001 L 17.957,19.496 C 20.283,17.661 21.761,14.984 21.761,12 Z M 15,16.498 16.481,18 c 1.86,-1.467 3.04,-3.608 3.04,-6 0,-2.392 -1.18,-4.533 -3.04,-6 L 15,7.502 c 1.396,1.101 2.282,2.707 2.282,4.498 0,1.791 -0.886,3.397 -2.282,4.498 z M 12,9 c -1.656,0 -3,1.343 -3,3 0,1.657 1.344,3 3,3 1.656,0 3,-1.343 3,-3 0,-1.657 -1.344,-3 -3,-3 z"/>
			</svg>`,
	},

	//
	// constructor
	//

	initialize: function() {
		let surface = this.model.get('surface');
		let distance = this.model.get('distance');
		let offset = this.model.get('offset');
		let focusType = surface.getFocusType();
		let focalLength = surface.parent.getFocalLength(surface.getSide());
		let radius = surface.parent.getMinDiameter() / 2;
		let yOffset = this.options.parent.getYOffset();
		let focalDistance = distance + (focalLength || 0);
		let side = surface.getSide();

		// create models
		//
		this.models = {

			// points
			//
			vertex: new Point({
				location: new Vector2(offset, 0)
			}),
			focal_point: new Point({
				location: new Vector2(offset + focalDistance, 0)
			}),

			// lines
			//
			focal_length_line: new Line({
				point1: new Vector2(offset + distance, yOffset),
				point2: new Vector2(offset + focalDistance, yOffset)
			}),
			focal_distance_line: new Line({
				point1: new Vector2(offset, -yOffset),
				point2: new Vector2(offset + focalDistance, -yOffset)
			}),

			// paths
			//
			focal_line: new Path({
				vertices: [
					new Vector2(offset + distance, radius),
					new Vector2(offset + focalDistance, 0),
					new Vector2(offset + distance, -radius)
				]
			})
		};

		// create subviews
		//
		this.views = {

			// axis views
			//
			vertex: new AxisView({
				model: this.models.vertex,
				className: focusType + ' ' + AxisView.prototype.className,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),
			focal_plane: new AxisView({
				model: this.models.focal_point,
				className: focusType + ' ' + AxisView.prototype.className,
				orientation: 'vertical',
				viewport: this.options.viewport
			}),

			// dimensioning line views
			//
			focal_length_line: new DimensioningLineView({
				model: this.models.focal_length_line,
				className: 'principal plane dimensioning double arrow',
				text: (side == 'front'? 'f=' : "f'="),
				viewport: this.options.viewport
			}),
			focal_distance_line: new DimensioningLineView({
				model: this.models.focal_distance_line,
				text: (side == 'front'? 'ffl=' : 'bfl='),
				viewport: this.options.viewport
			}),

			// path views
			//
			focal_line: new PathView({
				model: this.models.focal_line,
				className: 'dimensioning ' + PathView.prototype.className,
				viewport: this.options.viewport
			}),

			// marker views
			//
			focal_point: new MarkerView({
				title: _.result(this, 'title'),
				icon: focalLength > 0? this.icons.back : this.icons.front,
				model: this.models.focal_point,
				viewport: this.options.viewport
			})
		};

		// create children
		//
		for (let item in this.views) {
			this.children._add(this.views[item]);
		}

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);

		// listen to viewport
		//
		this.listenTo(this.options.viewport, 'change:scale', this.onChange);
	},

	//
	// querying methods
	//

	title: function() {
		let surface = this.model.get('surface');
		let index = surface.parent.getIndex();
		let title = surface.getSide().capitalized() + ' Focus';
		return title + (index != undefined? index + 1 : '');
	},

	//
	// svg rendering methods
	//

	attributes: function() {
		return {
			'class': this.model.get('surface').getFocusType() + ' ' + this.className
		}
	},

	update: function() {
		let surface = this.model.get('surface');
		let distance = this.model.get('distance');
		let offset = this.model.get('offset');
		let focalLength = surface.parent.getFocalLength(surface.getSide());
		let radius = surface.parent.getMinDiameter() / 2;
		let yOffset = this.options.parent.getYOffset();
		let focalDistance = distance + (focalLength || 0);

		// update points
		//
		this.models.vertex.set({
			location: new Vector2(offset, 0)
		});
		this.models.focal_point.set({
			location: new Vector2(offset + focalDistance, 0)
		});

		// update dimensioning lines
		//
		this.models.focal_length_line.set({
			point1: new Vector2(offset + distance, yOffset),
			point2: new Vector2(offset + focalDistance, yOffset)
		});
		this.models.focal_distance_line.set({
			point1: new Vector2(offset, -yOffset),
			point2: new Vector2(offset + focalDistance, -yOffset)
		});

		// update path views
		//
		this.models.focal_line.set({
			vertices: [
				new Vector2(offset + distance, radius),
				new Vector2(offset + focalDistance, 0),
				new Vector2(offset + distance, -radius)
			]
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},
});