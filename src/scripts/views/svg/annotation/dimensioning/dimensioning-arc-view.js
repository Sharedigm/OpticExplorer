/******************************************************************************\
|                                                                              |
|                            dimensioning-arc-view.js                          |
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

import AnnotationView from '../../../../views/svg/annotation/annotation-view.js';
import ArcView from '../../../../views/svg/shapes/arc-view.js';
import Units from '../../../../utilities/math/units.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'dimensioning arc',
	
	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		AnnotationView.prototype.initialize.call(this, options);

		// set optional parameter defaults;
		//
		if (this.options.units == undefined) {
			this.options.units = 'deg';
		}
		if (this.options.precision == undefined) {
			this.options.precision = 3;
		}
		if (!this.options.minTextWidth) {
			this.options.minTextWidth = 20;
		}
		if (!this.options.minTextHeight) {
			this.options.minTextHeight = 10;
		}
		if (this.options.offset == undefined) {
			this.options.offset = 7.5;
		}

		// create subviews
		//
		this.addChildView(new ArcView({
			model: this.model,
			className: 'double arrow arc',
			viewport: this.options.viewport
		}));
	},

	//
	// getting methods
	//

	getText: function() {
		let angle = new Units(this.model.getAngle(), 'deg');
		let text = angle.as(this.options.units).toString({
			precision: this.options.precision || 2
		});
		if (text && this.options.units == 'deg') {
			text = text.replace(' deg', '\u00B0');
		}
		return (this.options.text? this.options.text : '') + text;
	},

	getTextVisibility: function() {
		return this.model.getAngle() != 0? 'visible' : 'hidden';
	},

	getAngle: function(options) {
		return this.model.getAngle(options);
	},

	//
	// svg rendering methods
	//

	toHorizontalText: function() {
		let middle = this.model.getMiddle();
		let center = this.model.getCenterOfCurvature();

		if (!middle || !center) {
			return;
		}

		let direction = middle.minus(center);
		let textVisibility = this.getTextVisibility();
		let point;

		// add offset
		//
		if (this.options.viewport.label_style == 'diagonal') {
			point = middle.plus(direction.scaledTo(this.options.offset / this.options.viewport.scale));
		} else {
			point = middle.clone();
			point.x += direction.x * this.options.offset / this.options.viewport.scale;
			point.y += direction.y * 2.5 / this.options.viewport.scale;
		}

		// create text
		//
		let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

		// set attributes
		//
		$(text).attr({
			'class': 'unscaled unselectable',
			'x': point.x + 'mm',
			'y': point.y + 'mm',
			'alignment-baseline': 'middle',
			'visibility': textVisibility,
			'display': textVisibility == 'visible'? 'block' : 'none'
		});
		$(text).text(this.getText());

		// unscale text
		//
		this.setElementScale(text, 1 / this.options.viewport.scale);

		return text;
	},

	toDiagonalText: function() {
		let middle = this.model.getMiddle();
		let center = this.model.getCenterOfCurvature();

		if (!middle || !center) {
			return;
		}

		let direction = middle.minus(center);
		let angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
		let point = middle.plus(direction.scaledTo(this.options.offset / this.options.viewport.scale));

		// make sure that text is right side up
		//
		if (angle < -90) {
			angle += 180;
		}
		if (angle > 90) {
			angle -= 180;
		}

		// create group
		//
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// add elements
		//
		$(group).append(this.toHorizontalText(this.options.viewport));

		// set transformation attributes
		//
		$(group).attr('class', 'diagonal');
		$(group).attr({
			'transform': 'rotate(' + angle + ', ' + (point.x * this.options.viewport.pixelsPerMillimeter) + ', ' + (point.y * this.options.viewport.pixelsPerMillimeter) + ')'
		});

		return group;
	},

	toText: function() {
		if (this.options.viewport.label_style == 'diagonal') {
			return this.toDiagonalText();
		} else {
			return this.toHorizontalText();
		}
	},

	toElement: function() {

		// create element
		//
		let el = AnnotationView.prototype.toElement.call(this);

		// add elements
		//
		$(el).append($(this.toText()).attr({
			'visibility': this.getTextVisibility()
		}));

		return el;	
	},

	update: function() {
		let middle = this.model.getMiddle();
		let center = this.model.getCenterOfCurvature();

		if (!middle || !center) {
			return;
		}

		let direction = middle.minus(center);
		let textVisibility = this.getTextVisibility();
		let text = this.$el.find('text')[0];
		let group = this.$el.find('g')[0];
		let point, angle;

		// add offset
		//
		if (this.options.viewport.label_style == 'diagonal') {
			point = middle.plus(direction.scaledTo(this.options.offset / this.options.viewport.scale));
		} else {
			point = middle.clone();
			point.x += direction.x * this.options.offset / this.options.viewport.scale;
			point.y += direction.y * 2.5 / this.options.viewport.scale;
		}

		// update text
		//
		$(text).text(this.getText());
		$(text).attr({
			'x': point.x + 'mm',
			'y': point.y + 'mm',
			'visibility': textVisibility,
			'display': textVisibility == 'visible'? 'block' : 'none'
		});

		// unscale text
		//
		this.setElementScale(text, 1 / this.options.viewport.scale);

		// update transformation attributes
		//
		if (this.options.viewport.label_style == 'diagonal') {
			center = this.model.getCenterOfCurvature();
			direction = point.minus(center);
			angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;

			// make sure that text is right side up
			//
			if (angle < -90) {
				angle += 180;
			}
			if (angle > 90) {
				angle -= 180;
			}	
						
			$(group).attr({
				'transform': 'rotate(' + angle + ', ' + (point.x * this.options.viewport.pixelsPerMillimeter) + ', ' + (point.y * this.options.viewport.pixelsPerMillimeter) + ')'
			});
		}
	}
});