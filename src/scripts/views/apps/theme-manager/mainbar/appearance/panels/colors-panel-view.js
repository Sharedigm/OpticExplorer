/******************************************************************************\
|                                                                              |
|                             colors-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';
import ColorUtils from '../../../../../../utilities/multimedia/color-utils.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="color-scheme form-group">
			<label class="control-label"><i class="fa fa-brush"></i>Colors</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="color-scheme" value="binary"<% if (color_scheme == 'binary') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="color-scheme" value="monochrome"<% if (color_scheme == 'monochrome') {%> checked<% } %>>Monochrome</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="color-scheme" value="colored"<% if (color_scheme == 'colored') {%> checked<% } %>>Colored</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="color-scheme" value="colorful"<% if (color_scheme == 'colorful') {%> checked<% } %>>Colorful</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Color Scheme" data-content="This determines what color scheme is used."></i>
			</div>
		</div>
		
		<div class="day-theme form-group">
			<label class="control-label"><i class="fa fa-sun"></i>Day</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="day-theme" value="light"<% if (day_theme == 'light') {%> checked<% } %>>Light</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="day-theme" value="medium"<% if (day_theme == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="day-theme" value="dark"<% if (day_theme == 'dark') {%> checked<% } %>>Dark</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="day-theme" value="auto"<% if (day_theme == 'auto') {%> checked<% } %>>Auto</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Day Theme" data-content="This determines what theme is used from 6am to 6pm."></i>
			</div>
		</div>
		
		<div class="night-theme form-group">
			<label class="control-label"><i class="fa fa-moon"></i>Night</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="night-theme" value="light"<% if (night_theme == 'light') {%> checked<% } %>>Light</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="night-theme" value="medium"<% if (night_theme == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="night-theme" value="dark"<% if (night_theme == 'dark') {%> checked<% } %>>Dark</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="night-theme" value="auto"<% if (night_theme == 'auto') {%> checked<% } %>>Auto</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Night Theme" data-content="This determines what theme is used from 6pm to 6am."></i>
			</div>
		</div>
		
		<div class="highlight-color form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Highlight Color</label>
			<div class="controls">
				<% if (colors) { %>
				<% for (let i = 0; i < colors.length; i++) { %>
				<% let color = colors[i]; %>
				<div class="radio-inline">
					<label><input type="radio" name="highlight-color" class="colored <%= color %>" value="<%= color %>"<% if (highlight_color == color) {%> checked<% } %>><%= color.toTitleCase() %></label>
				</div>
				<% } %>
				<% } %>

				<div class="radio-inline">
					<label><input type="radio" name="highlight-color" class="colored" value="custom"<% if (custom_highlight_color) {%> checked<% } %>>Custom</label>
				</div>

				<div class="color-inline">
					<input type="color"<% if (highlight_color) { %> value="<%= highlight_hex_color %>"<% } else { %> value="#999999"<% } %><% if (!custom_highlight_color) { %> style="display:none"<% } %> />
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Highlight Color" data-content="This determines the color used for highlighting items."></i>
			</div>
		</div>

		<div class="accent-color form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Accent Color</label>
			<div class="controls">
				<% if (colors) { %>
				<% for (let i = 0; i < colors.length; i++) { %>
				<% let color = colors[i]; %>
				<div class="radio-inline">
					<label><input type="radio" name="accent-color" class="colored <%= color %>" value="<%= color %>"<% if (accent_color == color) {%> checked<% } %>><%= color.toTitleCase() %></label>
				</div>
				<% } %>
				<% } %>

				<div class="radio-inline">
					<label><input type="radio" name="accent-color" class="colored none" value="none"<% if (accent_color == 'none') {%> checked<% } %>>None</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="accent-color" class="colored" value="custom"<% if (custom_accent_color) {%> checked<% } %>>Custom</label>
				</div>

				<div class="color-inline">
					<input type="color"<% if (accent_color) { %> value="<%= accent_hex_color %>"<% } else { %> value="#999999"<% } %><% if (!custom_accent_color) { %> style="display:none"<% } %> />
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Highlight Color" data-content="This determines the color used for accenting items."></i>
			</div>
		</div>
	`),

	events: {
		'change .color-scheme input': 'onChangeColorScheme',
		'change .day-theme input': 'onChangeDayTheme',
		'change .night-theme input': 'onChangeNightTheme',
		'change .highlight-color input': 'onChangeHighlightColor',
		'change .highlight-color input[type="color"]': 'onChangeHighlightCustomColor',
		'change .accent-color input': 'onChangeAccentColor',
		'change .accent-color input[type="color"]': 'onChangeAccentCustomColor'
	},

	//
	// querying methods
	//

	isCustomColor: function(color) {

		// check for color
		//
		if (!color) {
			return false;

		// check for hex color
		//
		} else if (color.startsWith('#')) {
			return true;

		// check for rgb color
		//
		} else if (color.startsWith('rgb')) {
			return true;

		// check for hsl color
		//
		} else if (color.startsWith('hsl')) {
			return true;

		// named color
		//
		} else {
			return false;
		}
	},

	toHexColor: function(color) {
		if (!color) {
			return;

		// check for hex color
		//
		} else if (color.startsWith('#')) {
			return color;

		// check for rgb color
		//
		} else if (color.startsWith('rgb')) {
			return ColorUtils.rgbColorToHex(color);

		// check for hsl color
		//
		} else if (color.startsWith('hsl')) {
			return ColorUtils.hslColorToHex(color);
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// theme
			//
			case 'color_scheme':
				return this.$el.find('.color-scheme input:checked').val();
			case 'day_theme':
				return this.$el.find('.day-theme input:checked').val();
			case 'night_theme':
				return this.$el.find('.night-theme input:checked').val();

			// highlight color
			//
			case 'use_custom_highlight_color':
				return this.getValue('highlight_color_kind') == 'custom';
			case 'custom_highlight_color':
				return this.$el.find('.highlight-color input[type="color"]').val();
			case 'highlight_color_kind':
				return this.$el.find('.highlight-color input:checked').val();
			case 'highlight_color':
				return this.getValue('use_custom_highlight_color')? this.getValue('custom_highlight_color') : this.getValue('highlight_color_kind');

			// accent color
			//
			case 'use_custom_accent_color':
				return this.getValue('accent_color_kind') == 'custom';
			case 'custom_accent_color':
				return this.$el.find('.accent-color input[type="color"]').val();
			case 'accent_color_kind':
				return this.$el.find('.accent-color input:checked').val();
			case 'accent_color':
				return this.getValue('use_custom_accent_color')? this.getValue('custom_accent_color') : this.getValue('accent_color_kind');
		}
	},

	getValues: function() {
		return {
			color_scheme: this.getValue('color_scheme'),
			day_theme: this.getValue('day_theme'),
			night_theme: this.getValue('night_theme'),
			highlight_color: this.getValue('highlight_color'),
			accent_color: this.getValue('accent_color')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			color_scheme: application.settings.theme.get('color_scheme'),
			day_theme: application.settings.theme.get('day_theme'),
			night_theme: application.settings.theme.get('night_theme'),
			highlight_color: application.settings.theme.get('highlight_color'),
			highlight_hex_color: this.toHexColor(application.settings.theme.get('highlight_color')),
			custom_highlight_color: this.isCustomColor(application.settings.theme.get('highlight_color')),
			accent_color: application.settings.theme.get('accent_color'),
			accent_hex_color: this.toHexColor(application.settings.theme.get('accent_color')),
			custom_accent_color: this.isCustomColor(application.settings.theme.get('accent_color')),
			colors: config.defaults.colors
		};
	},

	showHighlightColor: function() {
		this.$el.find('.highlight-color input[type="color"]').show();
	},

	hideHighlightColor: function() {
		this.$el.find('.highlight-color input[type="color"]').hide();
	},

	showAccentColor: function() {
		this.$el.find('.accent-color input[type="color"]').show();
	},

	hideAccentColor: function() {
		this.$el.find('.accent-color input[type="color"]').hide();
	},

	//
	// event handling methods
	//

	onChangeColorScheme: function() {
		application.settings.theme.set('color_scheme', this.getValue('color_scheme'));
	},

	onChangeDayTheme: function() {
		application.settings.theme.set('day_theme', this.getValue('day_theme'));
	},

	onChangeNightTheme: function() {
		application.settings.theme.set('night_theme', this.getValue('night_theme'));
	},

	onChangeHighlightColor: function() {
		let highlightColor = this.getValue('highlight_color');
		application.settings.theme.set('highlight_color', highlightColor);

		// hide show custom color
		//
		if (highlightColor && highlightColor.startsWith('#')) {
			this.showHighlightColor();
		} else {
			this.hideHighlightColor();
		}
	},

	onChangeHighlightCustomColor: function() {
		let highlightColor = this.getValue('highlight_color');
		application.settings.theme.set('highlight_color', highlightColor);
	},

	onChangeAccentColor: function() {
		let accentColor = this.getValue('accent_color');
		application.settings.theme.set('accent_color', accentColor);

		// hide show custom color
		//
		if (accentColor && accentColor.startsWith('#')) {
			this.showAccentColor();
		} else {
			this.hideAccentColor();
		}
	},

	onChangeAccentCustomColor: function() {
		let accentColor = this.getValue('accent_color');
		application.settings.theme.set('accent_color', accentColor);
	},
});