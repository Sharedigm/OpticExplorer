/******************************************************************************\
|                                                                              |
|                                face-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an a view used for the face of a decibel meter.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import ColorUtils from '../../../../utilities/multimedia/color-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'face',

	template: template(`
		<div class="digital display">
			<div class="decibel digits">
				<div class="value">00</div>
			</div>
			<div class="max digits">
				max
				<div class="value">00</div>
			</div>
		</div>
		<svg>
			<filter id="dark">
				<feComponentTransfer>
					<feFuncR type="linear" slope="0.25"/>
					<feFuncG type="linear" slope="0.25"/>
					<feFuncB type="linear" slope="0.25"/>
				</feComponentTransfer>
			</filter>
			<filter id="bright">
				<feComponentTransfer>
					<feFuncR type="linear" slope="1.25"/>
					<feFuncG type="linear" slope="1.25"/>
					<feFuncB type="linear" slope="1.25"/>
				</feComponentTransfer>
			</filter>
		</svg>
	`),

	num_segments: 20,
	max_decibels: 100,

	//
	// setting methods
	//

	setDecibels: function(decibels) {
		if (decibels < 0) {
			decibels = 0;
		}

		// update didits
		//
		this.$el.find('.decibel.digits .value').html(this.toTwoChars(Math.round(decibels).toString()));

		// update meter
		//
		let bars = this.$el.find('.wedge');
		for (let i = 0; i < bars.length; i++) {
			let t = (i + 1) / bars.length;
			let value = t * this.max_decibels;
			if (value < decibels) {
				$(bars[i]).addClass('active');
			} else {
				$(bars[i]).removeClass('active');
			}
		}
	},

	setMax: function(max) {
		this.$el.find('.max.digits .value').html(this.toTwoChars(Math.round(max).toString()));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add svg
		//
		this.$el.find('svg').append(this.toSVG(100, 100, 85));

		// set display type
		//
		if (this.options.display) {
			this.$el.find('.digital.display').addClass(this.options.display);
		}
	},

	toTwoChars(string) {
		if (string.length == 1) {
			string = '0' + string
		} else if (string.length == 3) {
			string = string.substring(1, 3);
		}
		return string;
	},

	//
	// svg rendering methods
	//

	toWedge(r1, r2, rotation, color, sweep, label, rounded) {
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		$(el).attr({
			class: 'wedge'
		});

		// compute start and end angles in radians
		//
		let theta1 = rotation * Math.PI / 180;
		let theta2 = theta1 + (sweep * Math.PI / 180);
		let spacing = 2;
		let a = spacing / r1;
		let b = spacing / r2;

		let vertices = [{
			x: Math.cos(theta1 + b) * r2,
			y: Math.sin(theta1 + b) * r2
		}, {
			x: Math.cos(theta1 + a) * r1,
			y: Math.sin(theta1 + a) * r1
		}, {
			x: Math.cos(theta2 - a) * r1,
			y: Math.sin(theta2 - a) * r1
		}, {
			x: Math.cos(theta2 - b) * r2,
			y: Math.sin(theta2 - b) * r2
		}];

		// start at inner radius
		//
		let d = 'M ' + vertices[0].x + ' ' + vertices[0].y;

		// add bottom line
		//
		d += ' L ' + vertices[1].x + ' ' + vertices[1].y;

		// add outer edge
		//
		if (rounded) {
			let dx = vertices[2].x - vertices[1].x;
			let dy = vertices[2].y - vertices[1].y;
			d += ' A ' + r1 + ' ' + r1 + ' 0 0 1 ' + vertices[1].x + ' ' + vertices[1].y;
			d += ' a ' + r1 + ' ' + r1 + ' 0 0 1 ' + dx + ' ' + dy;
		} else {
			d += ' L ' + vertices[2].x + ' ' + vertices[2].y;
		}

		// add top line
		//
		d += ' L ' + vertices[3].x + ' ' + vertices[3].y;

		// connect to start
		//
		if (rounded) {
			let dx = vertices[0].x - vertices[3].x;
			let dy = vertices[0].y - vertices[3].y;
			d += ' A ' + r2 + ' ' + r2 + ' 0 0 0 ' + vertices[3].x + ' ' + vertices[3].y;
			d += ' a ' + r2 + ' ' + r2 + ' 0 0 0 ' + dx + ' ' + dy;
		} else {
			d += ' L ' + vertices[0].x + ' ' + vertices[0].y;
		}

		// create path
		//
		let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		$(path).attr({
			d: d,
			id: label
		});
		el.appendChild(path);

		return el;
	},

	toSVG(x, y, radius) {
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let sweep = 270;
		let wedgeSweep = sweep / this.num_segments;
		let showLabels = true;
		let rounded = false;

		let colors = [];
		for (let i = 0; i < this.num_segments; i++) {
			let t = i / this.num_segments;
			if (t < 0.5) {
				colors.push(ColorUtils.blendRgbColors('rgb(0,192,0)', 'rgb(255,255,0)', t * 2));
			} else {
				colors.push(ColorUtils.blendRgbColors('rgb(255,255,0)', 'rgb(255,0,0)', (t - 0.5) * 2));
			}
		}

		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			let rotation = i * wedgeSweep - 270 + (360 - sweep) / 2;
			let label = showLabels? (i + 1) : undefined;
			let wedge = this.toWedge(radius, radius * .55, rotation, color, wedgeSweep, label, radius, rounded);

			// set wedge colors
			//
			$(wedge).attr('fill', color);
			$(wedge).attr('stroke', color);

			el.appendChild(wedge);
		}

		// set center
		//
		let translate = 'translate(' + x + ', ' + y + ')';
		$(el).attr('transform', translate);

		return el;
	}
});