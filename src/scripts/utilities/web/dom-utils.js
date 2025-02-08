/******************************************************************************\
|                                                                              |
|                                 dom-utils.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose DOM manipulation utilities.       |
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
	// setting methods
	//

	setBackgroundStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.background) {
			$(element).css('background', attributes.background);
		}
		if (attributes.background_color) {
			$(element).css('background-color', attributes.background_color);
		}
		if (attributes.background_image) {
			$(element).css('background-image', 'url("' + attributes.background_image + '")');
		}
		if (attributes.background_size) {
			$(element).css('background-size', attributes.background_size);
		}
		if (attributes.background_position) {
			$(element).css('background-position', attributes.background_position);
		}
		if (attributes.background_repeat) {
			$(element).css('background-repeat', attributes.background_repeat.replace('_', '-'));
		}
		if (attributes.background_attachment) {
			$(element).css('background-attachment', attributes.background_attachment);
		}
	},

	setBorderStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.border == 'round') {
			$(element).addClass('round');
		}
		if (attributes.border == 'rounded') {
			$(element).addClass('rounded');
		}
		if (attributes.border_radius) {
			$(element).css('border-radius', attributes.border_radius);
		}
	},

	setImageStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.width) {
			$(element).css('width', attributes.width);
		}
		if (attributes.height) {
			$(element).css('height', attributes.height);
		}
		if (attributes.outline) {
			$(element).css('outline', attributes.outline);
		}
		if (attributes.rendering) {
			$(element).addClass(attributes.rendering);
		}
		if (attributes.filter) {
			$(element).css('filter', attributes.filter);
		}
	},

	setFont: function(element, font) {
		application.loadFont(font);
		if (font) {
			if (config.fonts[font]) {
				$(element).css('font-family', config.fonts[font]['font-family']);
			} else {
				$(element).css('font-family', font);
			}
		}
	},

	setFontStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.font) {
			this.setFont(element, attributes.font);
		}
		if (attributes.font_variant) {
			$(element).css('font-variant', attributes.font_variant);
		}
		if (attributes.font_size) {
			$(element).css('font-size', attributes.font_size);
		}
		if (attributes.font_style) {
			$(element).css('font-style', attributes.font_style);
		}
		if (attributes.font_weight) {
			$(element).css('font-weight', attributes.font_weight);
		}
	},

	setTextStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.text_transform) {
			$(element).css('text-transform', attributes.text_transform);
		}
		if (attributes.text_shadow) {
			$(element).css('text-shadow', attributes.text_shadow);
		}
		if (attributes.outline) {
			$(element).addClass(attributes.outline + '-outlined');
		}
		this.setFontStyles(element, attributes);
	},

	setTextBlockStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.color) {
			$(element).css('color', attributes.color);
		}
		this.setTextStyles(element, attributes);
		this.setBorderStyles(element, attributes);
		this.setBackgroundStyles(element, attributes);
	},

	setTitleStyles: function(element, attributes) {
		if (!attributes) {
			return;
		}
		if (attributes.color && attributes.color != 'white') {
			$(element).css('color', attributes.color);
		}
		this.setFontStyles(element, attributes);
	}
};