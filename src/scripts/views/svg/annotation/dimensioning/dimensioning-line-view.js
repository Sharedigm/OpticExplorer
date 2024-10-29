/******************************************************************************\
|                                                                              |
|                            dimensioning-line-view.js                         |
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
import Vector2 from '../../../../utilities/math/vector2.js';
import Units from '../../../../utilities/math/units.js';
import '../../../../utilities/math/math-utils.js';

export default AnnotationView.extend({

	//
	// attributes
	//

	className: 'dimensioning double arrow',

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		AnnotationView.prototype.initialize.call(this, options);

		// set optional parameter defaults
		//
		if (this.options.units == undefined) {
			this.options.units = 'mm';
		}
		if (this.options.precision == undefined) {
			this.options.precision = 4;
		}
		if (!this.options.minTextHeight) {
			this.options.minTextHeight = 10;
		}
		if (!this.options.minArrowLength) {
			this.options.minArrowLength = 5;
		}
		if (this.options.textVisibility == undefined) {
			this.options.textVisibility = 'auto';
		}
	},

	//
	// querying methods
	//

	isCompressed: function() {
		return this.model.getLength() * this.options.viewport.scale < this.getTextWidth() + 5;
	},

	useOffsetText: function(point1, point2) {
		if (this.options.offset) {
			return true;
		} else if (this.options.viewport.label_style == 'diagonal') {
			return this.model.getLength() * this.options.viewport.scale < this.options.minTextHeight;
		} else {
			let direction = point2.minus(point1);
			if (direction.length() > Math.epsilon) {
				direction = direction.normalized();
				return this.model.getLength() * this.options.viewport.scale / (Math.abs(direction.x) + 1) * 2 < (this.getTextWidth() - 2);
			} else {
				return true;
			}
		}
	},

	//
	// getting methods
	//

	getLengthStr: function() {
		if (this.options.length) {
			if (this.options.length != 0) {
				return this.options.length.toString();
			}
		} else {

			// find length in millimeters
			//
			let length = this.model.getLength();

			// display length in desired units
			//
			if (length > Math.epsilon) {
				if (this.options.scaleFactor) {

					// convert length using scale factor
					//
					return (length * this.options.scaleFactor).toPrecision(this.options.precision) + ' ' + this.options.units;
				} else {

					// convert length to desired units
					//
					return new Units(length, 'mm').as(this.options.units).toString({
						fixed: 2
					});
				}
			}
		}
	},

	getText: function() {
		let length = this.getLengthStr();
		if (length) {
			return (this.options.text? this.options.text : '') + length;
		} else {
			return '';
		}
	},

	getTextWidth: function() {
		let text = this.getText();
		if (text) {
			return (this.getText().length) * 2 + 2;
		} else {
			return 0;
		}
	},

	getTextVisibility: function() {
		if (this.options.textVisibility == 'auto') {
			if (Math.abs(this.model.getLength()) > Math.epsilon) {
				return 'visible';
			} else {
				return 'hidden';
			}
		} else {
			return this.options.textVisibility;
		}
	},

	//
	// svg rendering methods
	//

	toOffsetDrawing: function(point1, point2, direction) {
		let perpendicular = new Vector2(-direction.y, direction.x).normalized();
		let offset = this.options.minTextHeight / this.options.viewport.scale;

		// set to preferred offset direction
		//
		if (this.options.hTextOffsetDirection) {
			switch (this.options.hTextOffsetDirection) {
				case 'left':
					if (perpendicular.x > 0) {
						offset = -offset;
					}
					break;
				case 'right':
					if (perpendicular.x < 0) {
						offset = -offset;
					}
					break;
			}
		}
		if (this.options.vTextOffsetDirection) {
			switch (this.options.vTextOffsetDirection) {
				case 'top':
					if (perpendicular.y > 0) {
						offset = -offset;
					}
					break;
				case 'bottom':
					if (perpendicular.y < 0) {
						offset = -offset;
					}
					break;
			}
		}

		let point3 = point1.plus(perpendicular.scaledBy(offset));
		let point4 = point2.plus(perpendicular.scaledBy(offset));

		// convert values to strings
		//
		let x1 = this.valueToString(point1.x);
		let y1 = this.valueToString(point1.y);
		let x2 = this.valueToString(point2.x);
		let y2 = this.valueToString(point2.y);
		let x3 = this.valueToString(point3.x);
		let y3 = this.valueToString(point3.y);
		let x4 = this.valueToString(point4.x);
		let y4 = this.valueToString(point4.y);

		return 'M ' + x1 + ' ' + y1 + ' L ' + x3 + ' ' + y3 +
			' L ' + x4 + ' ' + y4 + ' L ' + x2 + ' ' + y2;
	},

	toDrawing: function() {
		let point1 = this.model.get('point1').scaledBy(this.options.viewport.pixelsPerMillimeter);
		let point2 = this.model.get('point2').scaledBy(this.options.viewport.pixelsPerMillimeter);
		let direction = point2.minus(point1);

		if (direction.length() < Math.epsilon) {

			// no line
			//
			return '';
		} else if (this.useOffsetText(point1, point2)) {

			// offset line
			//
			return this.toOffsetDrawing(point1, point2, direction);
		} else {

			// convert values to strings
			//
			let x1 = this.valueToString(point1.x);
			let y1 = this.valueToString(point1.y);
			let x2 = this.valueToString(point2.x);
			let y2 = this.valueToString(point2.y);

			// straight line
			//
			return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
		}
	},

	getDirectedTextOffset: function(offset, perpendicular) {

		// set horizontal text direction
		//
		if (this.options.hTextOffsetDirection) {
			switch (this.options.hTextOffsetDirection) {
				case 'left':
					if (perpendicular.x > 0) {
						offset = -offset;
					}
					break;
				case 'right':
					if (perpendicular.x < 0) {
						offset = -offset;
					}
					break;
			}
		}

		// set vertical text direction
		//
		if (this.options.vTextOffsetDirection) {
			switch (this.options.vTextOffsetDirection) {
				case 'top':
					if (perpendicular.y > 0) {
						offset = -offset;
					}
					break;
				case 'bottom':
					if (perpendicular.y < 0) {
						offset = -offset;
					}
					break;
			}
		}

		return offset;
	},

	getOffsetTextCenter: function(point1, point2, center) {
		let direction = point2.minus(point1);
		let offset;

		if (this.options.viewport.label_style == 'diagonal') {
			let isCompressed = this.isCompressed();

			// diagonal / vertical labels
			//
			offset = 3;
			if (isCompressed) {
				offset += this.getTextWidth() / 2;
			}
			offset /= this.options.viewport.scale;
		} else {

			// horizontal labels
			//
			if (direction.length() > Math.epsilon) {
				direction = direction.normalized();
				offset = this.options.minTextHeight / this.options.viewport.scale *
					(Math.abs(direction.y) + 1) / 2;
			} else {
				offset = 0;
			}
		}

		// find location from center, direction, and offset
		//
		if (direction.length() > Math.epsilon) {
			let perpendicular = new Vector2(-direction.y, direction.x).normalized();
			return center.plus(perpendicular.scaledBy(this.getDirectedTextOffset(offset, perpendicular)));
		} else {
			return center.plus(new Vector2(offset, 0));
		}
	},

	getTextCenter: function() {
		let point1 = this.model.get('point1').scaledBy(this.options.viewport.pixelsPerMillimeter);
		let point2 = this.model.get('point2').scaledBy(this.options.viewport.pixelsPerMillimeter);
		let center = this.model.getCenter();

		if (this.useOffsetText(point1, point2)) {

			// offset line text
			//
			return this.getOffsetTextCenter(point1, point2, center);
		} else {

			// straight line text
			//
			return center;
		}
	},

	toTextElement: function() {
		let center = this.getTextCenter();
		let text = this.getText();

		// create text
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'text');

		// set attributes
		//
		$(el).attr({
			class: 'unscaled unselectable',
			x: center.x + 'mm',
			y: center.y + 'mm'
		});
		if (text && text != '0') {
			$(el).text(text);
		}

		// unscale text
		//
		this.setElementScale(el, 1 / this.options.viewport.scale);

		return el;
	},

	toHorizontalText: function() {

		// create group
		//
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// add elements
		//
		$(group).append(this.toTextElement());

		return group;
	},

	toDiagonalText: function() {
		let center = this.getTextCenter();

		// create group
		//
		let group = this.toHorizontalText();

		// set transformation attributes
		//
		$(group).attr('class', 'diagonal');
		let angle = this.model.getAngle();

		// rotate text to take up less space
		//
		if (this.isCompressed()) {
			angle -= 90 * (angle <= 0? -1 : 1);
		}

		$(group).attr({
			'transform': 'rotate(' + angle + ', ' + (center.x * this.options.viewport.pixelsPerMillimeter) + ', ' + (center.y * this.options.viewport.pixelsPerMillimeter) + ')'
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

	toPath: function() {
		let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		$(path).attr('d', this.toDrawing());
		return path;
	},

	toElement: function() {

		// create element
		//
		let el = AnnotationView.prototype.toElement.call(this);

		// add elements
		//
		$(el).append(this.toPath());
		$(el).append(this.toText());

		return el;
	},

	update: function() {
		let path = this.$el.find('path')[0];
		let line = this.$el.find('line')[0];
		let text = this.$el.find('text')[0];
		let group = this.$el.find('g')[0];
		let center = this.getTextCenter();
		let textWidth = this.getTextWidth() / this.options.viewport.scale * this.options.viewport.pixelsPerMillimeter;

		// update line attributes
		//
		let center2 = center.scaledBy(this.options.viewport.pixelsPerMillimeter);
		$(line).attr('x1', center2.x - textWidth / 2);
		$(line).attr('y1', center2.y);
		$(line).attr('x2', center2.x + textWidth / 2);
		$(line).attr('y2', center2.y);

		// update path attributes
		//
		$(path).attr('d', this.toDrawing());

		// update text
		//
		let newText = this.getText();
		$(text).text(newText);
		$(text).attr({
			'x': center.x + 'mm',
			'y': center.y + 'mm'
		});

		// update text visibility
		//
		if (newText && newText != '0') {
			$(text).show();
		} else {
			$(text).hide();
		}

		// unscale text
		//
		this.setElementScale(text, 1 / this.options.viewport.scale);
		this.setLineElementScale(line, 1 / this.options.viewport.scale);

		// update transformation attributes
		//
		if (this.options.viewport.label_style == 'diagonal') {
			let angle = this.model.getAngle();

			// rotate text to take up less space
			//
			if (this.isCompressed()) {
				angle -= 90 * (angle <= 0? -1 : 1);
			}

			$(group).attr({
				'transform': 'rotate(' + angle + ', ' + (center.x * this.options.viewport.pixelsPerMillimeter) + ', ' + (center.y * this.options.viewport.pixelsPerMillimeter) + ')'
			});
		}
	}
});