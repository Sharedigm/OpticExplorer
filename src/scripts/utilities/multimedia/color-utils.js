/******************************************************************************\
|                                                                              |
|                                 color-utils.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains a set of color manipulating utility functions.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// converting methods
	//

	rgbToHex: function(r, g, b) {
		return "#" +
			(r + 0x10000).toString(16).substring(3).toUpperCase() +
			(g + 0x10000).toString(16).substring(3).toUpperCase() +
			(b + 0x10000).toString(16).substring(3).toUpperCase();
	},

	hslToHex(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;
		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}
		const toHex = x => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	},

	//
	// color parsing methods
	//

	rgbColorToHex: function(rgb) {
		let regex = /rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/;
		let values = regex.exec(rgb);
		if (values.length != 4) {
			return rgb;
		}
		let r = Math.round(parseFloat(values[1]));
		let g = Math.round(parseFloat(values[2]));
		let b = Math.round(parseFloat(values[3]));
		return this.rgbToHex(r, g, b);
	},

	hslColorToHex: function(hsl) {
		let regex = /hsl *\( *([0-9]{1,3}) *, *([0-9]{1,3})% *, *([0-9]{1,3})% *\)/;
		let values = regex.exec(hsl);
		if (values.length != 4) {
			return hsl;
		}
		let h = Math.round(parseFloat(values[1]));
		let s = Math.round(parseFloat(values[2]));
		let l = Math.round(parseFloat(values[3]));
		return this.hslToHex(h, s, l);
	},

	namedColorToRgbColor: function(color) {
		let canvas, context;
		canvas = document.createElement('canvas');
		canvas.height = 1;
		canvas.width = 1;
		context = canvas.getContext('2d');
		context.fillStyle = color;
		context.fillRect(0, 0, 1, 1);
		let data = context.getImageData(0, 0, 1, 1).data;
		return 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
	},

	rgbColorToRGBAColor: function(rgb, alpha) {
		let regex = /rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/;
		let values = regex.exec(rgb);
		if (values.length != 4) {
			return rgb;             
		}
		if (alpha == undefined) {
			alpha = 1;
		}
		let r = Math.round(parseFloat(values[1]));
		let g = Math.round(parseFloat(values[2]));
		let b = Math.round(parseFloat(values[3]));
		return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
	},

	//
	// getting methods
	//

	getRgbColorComponents: function(color) {
		let f = color.split(",");
		let r = parseInt(f[0].slice(4));
		let g = parseInt(f[1]);
		let b = parseInt(f[2]);
		return [r, g, b];
	},

	getRandomColor: function() {
		let r = 255*Math.random()|0,
			g = 255*Math.random()|0,
			b = 255*Math.random()|0;
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	},

	//
	// color modulation methods
	//

	shadeRgbColor: function(color, percent) {
		let f = color.split(",");
		let t = percent < 0? 0 : 255;
		let p = percent < 0? percent * -1 : percent;
		let r = parseInt(f[0].slice(4));
		let g = parseInt(f[1]);
		let b = parseInt(f[2]);
		r = Math.round((t - r) * p) + r;
		g = Math.round((t - g) * p) + g;
		b = Math.round((t - b) * p) + b;
		return "rgb(" + r + "," + g + "," + b + ")";
	},

	fadeRgbColor: function(color, percent) {
		let f = color.split(",");
		let r = parseInt(f[0].slice(4));
		let g = parseInt(f[1]);
		let b = parseInt(f[2]);
		let a = percent / 100;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	},

	addRgbColors: function(color1, color2) {
		let f = color1.split(",");
		let r = parseInt(f[0].slice(4));
		let g = parseInt(f[1]);
		let b = parseInt(f[2]);
		let f2 = color2.split(",");
		let r2 = parseInt(f2[0].slice(4));
		let g2 = parseInt(f2[1]);
		let b2 = parseInt(f2[2]);
		return "rgb(" + (r + r2) + "," + (g + g2) + "," + (b + b2) + ")";
	},

	blendRgbColors: function(color1, color2, p) {
		let f = color1.split(",");
		let t = color2.split(",");
		let r = parseInt(f[0].slice(4));
		let g = parseInt(f[1]);
		let b = parseInt(f[2]);
		r = Math.round((parseInt(t[0].slice(4)) - r) * p) + r;
		g = Math.round((parseInt(t[1]) - g) * p) + g;
		b = Math.round((parseInt(t[2]) - b) * p) + b;
		return "rgb(" + r + "," + g + "," + b + ")";
	},

	lighten: function(color, amount) {
		if (amount == undefined) {
			amount = 0.5;
		}
		return this.blendRgbColors(color, 'rgb(255,255,255)', amount);
	},

	darken: function(color, amount) {
		if (amount == undefined) {
			amount = 0.5;
		}
		return this.blendRgbColors(color, 'rgb(0,0,0)', amount);
	}
};