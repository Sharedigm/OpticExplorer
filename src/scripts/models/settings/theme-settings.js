/******************************************************************************\
|                                                                              |
|                              theme-settings.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's theme settings.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';
import Browser from '../../utilities/web/browser.js';
import CssUtils from '../../utilities/web/css-utils.js';
import TimeUtils from '../../utilities/time/time-utils.js';

export default UserSettings.extend({

	//
	// attributes
	//

	category: Browser.device != 'desktop'? Browser.device + '_' + 'theme' : 'theme',
	defaults: UserSettings.toKeyValuePairs(config.theme.general, Browser.device),

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},

	//
	// getting methods
	//

	getFontFamily: function(systemFont) {
		if (systemFont && config.fonts[systemFont]) {
			return config.fonts[systemFont]['font-family'];
		} else {
			return '';
		}
	},

	getFontIncrement: function(fontSize) {
		switch (fontSize) {
			case 'smallest':
				return -2;
			case 'smaller':
				return -1;
			default:
				return 0;
			case 'larger':
				return 1;
			case 'largest':
				return 2;
		}
	},

	getFontSize: function(systemFont, fontSize) {
		if (systemFont && config.fonts[systemFont]) {
			return config.fonts[systemFont]['font-size'] + this.getFontIncrement(fontSize) + 'px';
		} else {
			return '';
		}
	},

	getFontWeight: function(systemFont) {
		if (systemFont && config.fonts[systemFont]) {
			return config.fonts[systemFont]['font-weight'];
		} else {
			return '';
		}
	},

	getCurrentTheme: function() {
		if (TimeUtils.getTimeOfDay() == 'day') {
			return this.get('day_theme');
		} else {
			return this.get('night_theme');
		}
	},

	getCurrentDefaultTheme: function() {
		if (TimeUtils.getTimeOfDay() == 'day') {
			return 'standard';
		} else {
			return 'dark';
		}
	},

	//
	// setting methods
	//

	apply: function() {

		// apply color styles
		//
		this.applyTheme(this.get('color_scheme'), this.getCurrentTheme(), this.get('highlight_color'), this.get('accent_color'));
		this.applyMaterial(this.get('material'));
		this.applyTransparency(this.get('transparency'));

		// apply appearance styles
		//
		this.applyCorners(this.get('corner_style'));
		this.applyItemIcons(this.get('label_icons'), 'label');
		this.applySideBarPanels(this.get('sidebar_panels'));

		// apply icon styles
		//
		this.applyIconSize(this.get('icon_size'));
		this.applyItemMaterial(this.get('icon_material'), 'icons');
		this.applyItemCorners(this.get('icon_corners'), 'icons');
		this.applyIconTilt(this.get('icon_tilt'));
		this.applyIconTint(this.get('icon_tint'));
		this.applyIconBackground(this.get('icon_background'));

		// apply text styles
		//
		this.applySystemFont(this.get('system_font'), this.get('font_size'));
		this.applyHeadingFont(this.get('heading_font'), this.get('font_size'));
		this.applyTitleFont(this.get('title_font'), this.get('font_size'));
		this.applyLabelFont(this.get('label_font'), this.get('font_size'));
	},

	reset: function() {
		this.set(this.defaults);
	},

	setCurrentTheme: function(theme) {
		if (TimeUtils.getTimeOfDay() == 'day') {
			return this.set('day_theme', theme);
		} else {
			return this.set('night_theme', theme);
		}
	},

	//
	// color setting methods
	//

	applyTheme: function(colorScheme, theme, highlightColor, accentColor) {

		// set theme to browser settings
		//
		if (theme == 'auto') {
			theme = Browser.isDarkModeEnabled()? 'dark' : 'medium';
		}

		// load theme, if necessary
		//
		if (theme) {
			this.constructor.loadTheme(colorScheme, theme, highlightColor, accentColor);
		}

		// set color scheme
		//
		switch (colorScheme || 'colored') {
			case 'binary':
				$('body').addClass('binary');
				$('body').removeClass('monochrome');
				$('body').removeClass('colored');
				$('body').removeClass('colorful');
				break;
			case 'monochrome':
				$('body').removeClass('binary');
				$('body').addClass('monochrome');
				$('body').addClass('colored');
				$('body').removeClass('colorful');
				break;
			case 'colored':
				$('body').removeClass('binary');
				$('body').removeClass('monochrome');
				$('body').addClass('colored');
				$('body').removeClass('colorful');
				break;
			case 'colorful':
				$('body').removeClass('binary');
				$('body').removeClass('monochrome');
				$('body').addClass('colored');
				$('body').addClass('colorful');
				break;
		}

		// set theme
		//
		switch (theme || 'medium') {
			case 'light':
				$('body').removeClass('dark');
				$('body').addClass('light');
				break;
			case 'medium':
				$('body').removeClass('light');
				$('body').removeClass('dark');
				break;
			case 'dark':
				$('body').removeClass('light');
				$('body').addClass('dark');
				break;
		}

		// set color
		//
		if (colorScheme == 'colored' || colorScheme == 'colorful') {
			this.applyHighlightColor(highlightColor);
			this.applyAccentColor(accentColor);
		} else if (colorScheme == 'monochrome') {
			this.applyHighlightColor('grey');
			this.removeAccentColors();
		} else {
			this.removeHighlightColors();
			this.removeAccentColors();
		}
	},

	applyHighlightColor: function(highlightColor) {
		if (!highlightColor) {
			highlightColor = 'blue';
		}

		// clear previous highlight color
		//
		this.removeHighlightColors();

		// set new highlight color
		//
		if (highlightColor && highlightColor != 'none') {
			if (highlightColor.startsWith('#') ||
				highlightColor.startsWith('rgb') ||
				highlightColor.startsWith('hsl')) {
				$('body').css({
					'--primary-color': highlightColor
				});
			} else {
				$('body').addClass(highlightColor);
				$('body').css({
					'--primary-color': ''
				});
			}
		}
	},

	applyAccentColor: function(accentColor) {

		// clear previous accent color
		//
		this.removeAccentColors();

		// set new accent color
		//
		if (accentColor && accentColor != 'none') {
			$('body').addClass('accented');
			if (accentColor.startsWith('#') ||
				accentColor.startsWith('rgb') ||
				accentColor.startsWith('hsl')) {
				$('body').css({
					'--secondary-color': accentColor
				});
			} else {
				$('body').addClass(accentColor + '-accented');
				$('body').css({
					'--secondary-color': ''
				});
			}
		}
	},

	removeHighlightColors: function(colors) {
		if (!colors) {
			colors = config.defaults.colors;
		}
		if (!colors) {
			return;
		}
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			$('body').removeClass(color);
		}
	},

	removeAccentColors: function(colors) {
		if (!colors) {
			colors = config.defaults.colors;
		}
		if (!colors) {
			return;
		}
		$('body').removeClass('accented');
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			$('body').removeClass(color + '-accented');
		}
	},

	removeMaterial: function() {
		$('body').removeClass('flat');
		$('body').removeClass('chalk');
		$('body').removeClass('plastic');
		$('body').removeClass('glass');
		$('body').removeClass('metal');
	},

	applyMaterial: function(material) {

		// remove previous material
		//
		this.removeMaterial();

		// set new material
		//
		$('body').addClass(material != 'none'? material || 'flat' : 'flat');
	},

	removeItemMaterial: function(item) {
		$('body').removeClass('flat-' + item);
		$('body').removeClass('chalk-' + item);
		$('body').removeClass('plastic-' + item);
		$('body').removeClass('glass-' + item);
		$('body').removeClass('metal-' + item);
		$('body').removeClass('auto-' + item);
	},

	applyItemMaterial: function(material, item) {
		if (material == 'none') {
			material = 'flat';
		}

		// remove previous item material
		//
		this.removeItemMaterial(item);

		// set new item material
		//
		if (material) {
			$('body').addClass(material +  '-' + item);
		}
	},

	applyTransparency: function(transparency) {
		switch (transparency || 'opaque') {
			case 'opaque':
				$('body').addClass('opaque');
				$('body').removeClass('transparent');
				$('body').removeClass('translucent');
				break;
			case 'transparent':
				$('body').removeClass('opaque');
				$('body').addClass('transparent');
				$('body').removeClass('translucent');
				break;
			case 'translucent':
				$('body').removeClass('opaque');
				$('body').removeClass('transparent');
				$('body').addClass('translucent');
				break;
		}
	},

	//
	// appearance setting methods
	//

	applyCorners: function(corners) {
		switch (corners || 'round') {
			case 'round':
				$('body').addClass('round');
				$('body').removeClass('rounded');
				$('body').removeClass('square');
				break;
			case 'rounded':
				$('body').removeClass('round');
				$('body').addClass('rounded');
				$('body').removeClass('square');
				break;
			case 'square':
				$('body').removeClass('round');
				$('body').removeClass('rounded');
				$('body').addClass('square');
				break;
		}
	},

	applyItemCorners: function(corners, items) {
		switch (corners || 'auto') {
			case 'round':
				$('body').addClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'rounded':
				$('body').removeClass('round-' + items);
				$('body').addClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'square':
				$('body').removeClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').addClass('square-' + items);
				$('body').removeClass('auto-corner-' + items);
				break;
			case 'auto':
				$('body').removeClass('round-' + items);
				$('body').removeClass('rounded-' + items);
				$('body').removeClass('square-' + items);
				$('body').addClass('auto-corner-' + items);
		}
	},

	applySideBarPanels: function(sidebarPanels) {
		if (sidebarPanels) {
			$('body').addClass('sidebar-panels');
		} else {
			$('body').removeClass('sidebar-panels');
		}
	},

	//
	// icon appearance setting methods
	//

	removeIconTint: function() {
		let colors = config.defaults.colors;

		$('body').removeClass('tinted');
		$('body').removeClass('auto-tinted');

		if (!colors) {
			return;
		}
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			$('body').removeClass(color + '-tinted');
		}
	},

	applyIconTint: function(iconTint) {
		this.removeIconTint();
		if (iconTint && iconTint != 'none') {
			$('body').addClass('tinted');
			$('body').addClass(iconTint + '-tinted');
		}
	},

	applyIconBackground: function(iconBackground) {
		if (iconBackground && iconBackground != 'none') {
			$('body').addClass('icon-backgrounds');
		} else {
			$('body').removeClass('icon-backgrounds');
		}
	},

	applyIconSize: function(iconSize) {
		switch (iconSize || 'medium') {
			case 'small':
				$('body').addClass('small-icons');
				$('body').removeClass('large-icons');
				break;
			case 'medium':
				$('body').removeClass('small-icons');
				$('body').removeClass('large-icons');
				break;
			case 'large':
				$('body').removeClass('small-icons');
				$('body').addClass('large-icons');
				break;
		}
	},

	applyIconTilt: function(iconTilt) {
		switch (iconTilt || 'none') {
			case 'none':
				$('body').removeClass('tilted');
				$('body').removeClass('left');
				$('body').removeClass('right');
				$('body').removeClass('up');
				$('body').removeClass('down');
				break;
			case 'left':
				$('body').addClass('tilted');
				$('body').addClass('left');
				$('body').removeClass('right');
				$('body').removeClass('up');
				$('body').removeClass('down');
				break;
			case 'right':
				$('body').addClass('tilted');
				$('body').removeClass('left');
				$('body').addClass('right');
				$('body').removeClass('up');
				$('body').removeClass('down');
				break;
			case 'up':
				$('body').addClass('tilted');
				$('body').removeClass('left');
				$('body').removeClass('right');
				$('body').addClass('up');
				$('body').removeClass('down');
				break;
			case 'down':
				$('body').addClass('tilted');
				$('body').removeClass('left');
				$('body').removeClass('right');
				$('body').removeClass('up');
				$('body').addClass('down');
				break;
		}
	},

	applyItemIcons: function(value, items) {
		if (value) {
			$('body').removeClass('hide-' + items + '-icons');
		} else {
			$('body').addClass('hide-' + items + '-icons');
		}
	},

	//
	// font setting methods
	//

	applySystemFont: function(systemFont, fontSize) {
		if (!systemFont || (systemFont == 'none')) {
			return;
		}

		let font = config.fonts[systemFont];

		$('body').css({
			'font-family': this.getFontFamily(systemFont),
			'font-size': this.getFontSize(systemFont, fontSize),
			'font-weight': this.getFontWeight(systemFont)
		});

		if (font && font.url) {
			this.constructor.loadFont(systemFont, font.url);
		}
	},

	applyHeadingFont: function(headingFont) {

		// remove existing style rules
		//
		$('.heading-font-css').remove();

		// check for font and selector
		//
		if (!headingFont || (headingFont == 'none') || !config.defaults.text || !config.defaults.text.headings) {
			return;
		}

		// load font
		//
		let font = config.fonts[headingFont];
		if (font && font.url) {
			this.constructor.loadFont(headingFont, font.url);
		}

		// add new selector style rules
		//
		$(CssUtils.addCssRule(config.defaults.text.headings.join(', '), {
			'font-family': this.getFontFamily(headingFont)
		})).addClass('heading-font-css');
	},

	applyTitleFont: function(titleFont, fontSize) {

		// set optional parameter defaults
		//
		if (fontSize == undefined) {
			fontSize = 'normal';
		}

		// remove existing style rules
		//
		$('.title-font-css').remove();

		// check for font and selector
		//
		if (!titleFont || (titleFont == 'none') || !config.defaults.text || !config.defaults.text.titles) {
			return;
		}

		// load font
		//
		let font = config.fonts[titleFont];
		if (font && font.url) {
			this.constructor.loadFont(titleFont, font.url);
		}

		// add new selector style rules
		//
		$(CssUtils.addCssRule(config.defaults.text.titles.join(', '), {
			'font-family': this.getFontFamily(titleFont),
			'font-size': this.getFontSize(titleFont, fontSize),
			'font-weight': this.getFontWeight(titleFont)
		})).addClass('title-font-css');
	},

	applyLabelFont: function(labelFont, fontSize) {

		// set optional parameter defaults
		//
		if (fontSize == undefined) {
			fontSize = 'normal';
		}

		// remove existing style rules
		//
		$('.label-text-css').remove();

		// check for font and selector
		//
		if (!labelFont || (labelFont == 'none') || !config.defaults.text || !config.defaults.text.labels) {
			return;
		}

		// load font
		//
		let font = config.fonts[labelFont];
		if (font && font.url) {
			this.constructor.loadFont(labelFont, font.url);
		}

		// add new selector style rules
		//
		$(CssUtils.addCssRule(config.defaults.text.labels.join(', '), {
			'font-family': this.getFontFamily(labelFont),
			'font-size': this.getFontSize(labelFont, fontSize),
			'font-weight': this.getFontWeight(labelFont)
		})).addClass('label-text-css');
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.apply();
	}
}, {

	//
	// static attributes
	//

	current: null,
	fontsLoaded: [
		'syncopate',
		'open_sans'
	],

	//
	// static methods
	//

	loadFont: function(font, url, done) {

		// check if font is already loaded
		//
		if (this.fontsLoaded[font]) {
			return;
		}

		// dynamically load font
		//
		CssUtils.load({
			id: font,
			href: url
		}, () => {

			// mark font as loaded
			//
			this.fontsLoaded[font] = true;

			// perform callback
			//
			if (done) {
				done();
			}
		});
	},

	loadCSS: function(id, href, done) {

		// dynamically load scheme
		//
		CssUtils.load({
			id: id,
			href: href
		}, (cssFile) => {
			let styleSheet = CssUtils.getStyleSheet(href);

			// remove hover styles to avoid double tap on mobile
			//
			if (styleSheet && Browser.is_touch_enabled) {
				CssUtils.removeHoverStyles(styleSheet);
			}

			// perform callback
			//
			if (done) {
				done(cssFile);
			}	
		});
	},

	loadColorSchemeCSS: function(colorScheme, done) {
		if (!colorScheme) {
			return;
		}
		let id = colorScheme;
		let href = 'styles/themes/' + colorScheme  + '/styles.css';
		this.loadCSS(id, href, done);
	},

	loadThemeCSS: function(colorScheme, theme, done) {
		if (!colorScheme || !theme || theme == 'none') {
			return;
		}
		let id = colorScheme + '-' + theme;
		let href = 'styles/themes/' + colorScheme + '/' + theme + '/styles.css';
		this.loadCSS(id, href, done);
	},

	loadTheme: function(colorScheme, theme) {

		// first load medium theme
		//
		if (theme != 'medium') {
			this.loadTheme(colorScheme, 'medium');
		}

		switch (colorScheme) {
			case 'binary':
				this.loadThemeCSS(colorScheme, theme);
				break;
			case 'monochrome':
				this.loadTheme('colored', theme);
				this.loadThemeCSS('monochrome', theme);
				break;
			case 'colored':
				this.loadThemeCSS('non-binary', theme);
				this.loadColorSchemeCSS('shaded');
				this.loadColorSchemeCSS('colored');
				this.loadColorSchemeCSS('accented');
				break;
			case 'colorful':
				this.loadTheme('colored', theme);
				this.loadColorSchemeCSS('colorful');
				break;
		}	
	}
});