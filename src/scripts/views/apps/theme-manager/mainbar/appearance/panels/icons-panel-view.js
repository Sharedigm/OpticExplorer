/******************************************************************************\
|                                                                              |
|                             icons-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="controls-preview form-group">
			<svg class="defs">
				<defs>
					<%= file_icon %>
					<%= folder_icon %>
					<%= trash_icon %>
				</defs>
			</svg>
		
			<label class="control-label"><i class="fa fa-eye"></i>Preview</label>
				<div class="items" style="text-align:center">
					<span class="icon-grid">
		
						<div class="file item highlighted">
							<div class="row">
								<div class="icon">
									<svg viewBox="0 0 512 512"><use href="#text-file-icon"></use></svg>
								</div>
							</div>
							<div class="row">
								<div class="name">File</div>
							</div>
						</div>
		
						<div class="directory item highlighted">
							<div class="row">
								<div class="icon">
									<svg viewBox="0 0 512 512"><use href="#folder-empty-icon"></use></svg>
								</div>
							</div>
							<div class="row">
								<div class="name">Folder</div>
							</div>
						</div>
		
						<div class="trash directory item highlighted">
							<div class="row">
								<div class="icon">
									<svg viewBox="0 0 512 512"><use href="#trash-empty-icon"></use></svg>
								</div>
							</div>
							<div class="row">
								<div class="name">Trash</div>
							</div>
						</div>
					</span>
		
					<span class="app-icons icon-grid">
						<div class="item highlighted">
							<div class="row">
								<div class="icon colored orange">
									<img src="images/icons/flat/rocket.svg">
									<i class="fa fa-rocket"></i>
								</div>
							</div>
							<div class="row">
								<div class="name">App</div>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>
		
		<div class="icon-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="none"<% if (icon_material == 'none' || icon_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="chalk"<% if (icon_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="plastic"<% if (icon_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="glass"<% if (icon_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="metal"<% if (icon_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-material" value="auto"<% if (!icon_material || icon_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Material" data-content="This determines the type of material that is used to render icons."></i>	
			</div>
		</div>
		
		<div class="icon-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-corners" value="square"<% if (icon_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-corners" value="rounded"<% if (icon_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-corners" value="round"<% if (icon_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-corners" value="auto"<% if (!icon_corners || icon_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Corners" data-content="This determines how the corners on icons are displayed."></i>
			</div>
		</div>
		
		<div class="icon-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-size" value="small"<% if (icon_size == 'small') {%> checked<% } %>>Small</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-size" value="medium"<% if (icon_size == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-size" value="large"<% if (icon_size == 'large') {%> checked<% } %>>Large</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Size" data-content="This determines the size of item icons."></i>
			</div>
		</div>
		
		<div class="icon-tilt form-group">
			<label class="control-label"><i class="fa fa-italic"></i>Tilt</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-tilt" value="none"<% if (icon_tilt == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-tilt" value="left"<% if (icon_tilt == 'left') {%> checked<% } %>><i class="fa fa-arrow-left"></i></label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-tilt" value="right"<% if (icon_tilt == 'right') {%> checked<% } %>><i class="fa fa-arrow-right"></i></label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-tilt" value="down"<% if (icon_tilt == 'down') {%> checked<% } %>><i class="fa fa-arrow-down"></i></label>
				</div>
				
				<div class="radio-inline">
					<label><input type="radio" name="icon-tilt" value="up"<% if (icon_tilt == 'up') {%> checked<% } %>><i class="fa fa-arrow-up"></i></label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Tilt" data-content="This determines if icons are displayed using a tilt effect."></i>
			</div>
		</div>
		
		<div class="icon-tint form-group">
			<label class="control-label"><i class="fa fa-fire"></i>Tint</label>
			<div class="controls">
				<% if (colors) { %>
				<% for (let i = 0; i < colors.length; i++) { %>
				<% let color = colors[i]; %>
				<div class="radio-inline">
					<label><input type="radio" name="icon-tint" class="colored <%= color %>" value="<%= color %>"<% if (icon_tint == color) {%> checked<% } %>><%= color.toTitleCase() %></label>
				</div>
				<% } %>
				<% } %>

				<div class="radio-inline">
					<label><input type="radio" name="icon-tint" value="none"<% if (!icon_tint || icon_tint == 'none' || icon_tint == '') {%> checked<% } %>>None</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Tint" data-content="This determines the color used for folder icons."></i>
			</div>
		</div>
		
		<div class="icon-options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Options</label>
			<div class="controls">
				<div class="icon-background checkbox-inline">
					<label><input type="checkbox"<% if (icon_background) { %> checked="checked"<% } %>>Background</label>
				</div>
		
				<div class="icon-spinning checkbox-inline">
					<label><input type="checkbox"<% if (icon_spinning) { %> checked="checked"<% } %>>Spinning</label>
				</div>
			</div>
		</div>
		
		<div class="icon-select-effect form-group">
			<label class="control-label"><i class="fa fa-arrow-pointer"></i>Select Effect</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-select-effect" value="none"<% if (!icon_select_effect || icon_select_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-select-effect" value="wobble"<% if (icon_select_effect == 'wobble') {%> checked<% } %>>Wobble</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-select-effect" value="bounce"<% if (icon_select_effect == 'bounce') {%> checked<% } %>>Bounce</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-select-effect" value="tilt"<% if (icon_select_effect == 'tilt') {%> checked<% } %>>Tilt</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Select Effect" data-content="This determines the effect used when icons are selected."></i>
			</div>
		</div>
		
		<div class="icon-deselect-effect form-group">
			<label class="control-label"><i class="fa fa-arrow-pointer"></i>Deselect Effect</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-deselect-effect" value="none"<% if (!icon_deselect_effect || icon_deselect_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-deselect-effect" value="wobble"<% if (icon_deselect_effect == 'wobble') {%> checked<% } %>>Wobble</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-deselect-effect" value="bounce"<% if (icon_deselect_effect == 'bounce') {%> checked<% } %>>Bounce</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-deselect-effect" value="tilt"<% if (icon_deselect_effect == 'tilt') {%> checked<% } %>>Tilt</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Deselect Effect" data-content="This determines the effect used when icons are deselected."></i>
			</div>
		</div>
		
		<div class="icon-highlight-effect form-group">
			<label class="control-label"><i class="fa fa-border-top-left"></i>Highlight Effect</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-highlight-effect" value="none"<% if (!icon_highlight_effect || icon_highlight_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-highlight-effect" value="wobble"<% if (icon_highlight_effect == 'wobble') {%> checked<% } %>>Wobble</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-highlight-effect" value="bounce"<% if (icon_highlight_effect == 'bounce') {%> checked<% } %>>Bounce</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-highlight-effect" value="tilt"<% if (icon_highlight_effect == 'tilt') {%> checked<% } %>>Tilt</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Highlight Effect" data-content="This determines the effect used when icons are highlighted."></i>
			</div>
		</div>
		
		<div class="icon-unhighlight-effect form-group">
			<label class="control-label"><i class="fa fa-border-top-left"></i>Unhighlight Effect</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-unhighlight-effect" value="none"<% if (!icon_unhighlight_effect || icon_unhighlight_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-unhighlight-effect" value="wobble"<% if (icon_unhighlight_effect == 'wobble') {%> checked<% } %>>Wobble</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-unhighlight-effect" value="bounce"<% if (icon_unhighlight_effect == 'bounce') {%> checked<% } %>>Bounce</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-unhighlight-effect" value="tilt"<% if (icon_unhighlight_effect == 'tilt') {%> checked<% } %>>Tilt</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Unhighlight Effect" data-content="This determines the effect used when icons are unhighlighted."></i>
			</div>
		</div>
		
		<div class="icon-open-effect form-group">
			<label class="control-label"><i class="fa fa-expand"></i>Open Effect</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-open-effect" value="none"<% if (!icon_open_effect || icon_open_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-open-effect" value="wobble"<% if (icon_open_effect == 'wobble') {%> checked<% } %>>Wobble</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-open-effect" value="bounce"<% if (icon_open_effect == 'bounce') {%> checked<% } %>>Bounce</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="icon-open-effect" value="tilt"<% if (icon_open_effect == 'tilt') {%> checked<% } %>>Tilt</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Open Effect" data-content="This determines the effect used when icons are opened."></i>
			</div>
		</div>
	`),

	events: {
		'change .icon-material input': 'onChangeIconMaterial',
		'change .icon-corners input': 'onChangeIconCorners',
		'change .icon-size input': 'onChangeIconSize',
		'change .icon-tilt input': 'onChangeIconTilt',
		'change .icon-tint input': 'onChangeIconTint',
		'change .icon-background input': 'onChangeIconBackground',
		'change .icon-spinning input': 'onChangeIconSpinning',
		'change .icon-select-effect input': 'onChangeIconSelectEffect',
		'change .icon-deselect-effect input': 'onChangeIconDeselectEffect',
		'change .icon-highlight-effect input': 'onChangeIconHighlightEffect',
		'change .icon-unhighlight-effect input': 'onChangeIconUnhighlightEffect',
		'change .icon-open-effect input': 'onChangeIconOpenEffect'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'icon_material':
				return this.$el.find('.icon-material input:checked').val();
			case 'icon_corners':
				return this.$el.find('.icon-corners input:checked').val();
			case 'icon_size':
				return this.$el.find('.icon-size input:checked').val();
			case 'icon_tilt':
				return this.$el.find('.icon-tilt input:checked').val();
			case 'icon_tint':
				return this.$el.find('.icon-tint input:checked').val();
			case 'icon_background':
				return this.$el.find('.icon-background input:checked').val();
			case 'icon_spinning':
				return this.$el.find('.icon-spinning input:checked').val();
			case 'icon_select_effect':
				return this.$el.find('.icon-select-effect input:checked').val();
			case 'icon_deselect_effect':
				return this.$el.find('.icon-deselect-effect input:checked').val();
			case 'icon_highlight_effect':
				return this.$el.find('.icon-highlight-effect input:checked').val();
			case 'icon_unhighlight_effect':
				return this.$el.find('.icon-unhighlight-effect input:checked').val();
			case 'icon_open_effect':
				return this.$el.find('.icon-open-effect input:checked').val();
		}
	},

	getValues: function() {
		return {
			icon_material: this.getValue('icon_material'),
			icon_corners: this.getValue('icon_corners'),
			icon_size: this.getValue('icon_size'),
			icon_tilt: this.getValue('icon_tilt'),
			icon_tint: this.getValue('icon_tint'),
			icon_background: this.getValue('icon_background'),
			icon_spinning: this.getValue('icon_spinning'),
			icon_select_effect: this.getValue('icon_select_effect'),
			icon_deselect_effect: this.getValue('icon_deselect_effect'),
			icon_highlight_effect: this.getValue('icon_highlight_effect'),
			icon_unhighlight_effect: this.getValue('icon_unhighlight_effect'),
			icon_open_effect: this.getValue('icon_open_effect')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			file_icon: this.file_icon,
			folder_icon: this.folder_icon,
			trash_icon: this.trash_icon,
			icon_material: application.settings.theme.get('icon_material'),
			icon_corners: application.settings.theme.get('icon_corners'),
			icon_size: application.settings.theme.get('icon_size'),
			icon_tilt: application.settings.theme.get('icon_tilt'),
			icon_tint: application.settings.theme.get('icon_tint'),
			icon_background: application.settings.theme.get('icon_background'),
			icon_spinning: application.settings.theme.get('icon_spinning'),
			icon_select_effect: application.settings.theme.get('icon_select_effect'),
			icon_deselect_effect: application.settings.theme.get('icon_deselect_effect'),
			icon_highlight_effect: application.settings.theme.get('icon_highlight_effect'),
			icon_unhighlight_effect: application.settings.theme.get('icon_unhighlight_effect'),
			icon_open_effect: application.settings.theme.get('icon_open_effect'),
			colors: config.defaults.colors
		};
	},

	onRender: function() {
		if (!this.icons_loaded) {
			this.loadIcons();
			this.icons_loaded = true;
		}
	},

	loadIcons: function() {
		Promise.all([
			fetch('images/icons/files/text.svg').then(response => response.text()),
			fetch('images/icons/folders/folder-empty.svg').then(response => response.text()),
			fetch('images/icons/folders/trash-empty.svg').then(response => response.text()),
		]).then((files) => {
			this.$el.find('defs').append($(files[0]));
			this.$el.find('defs').append($(files[1]));
			this.$el.find('defs').append($(files[2]));
		});
	},

	//
	// event handling methods
	//

	onChangeIconMaterial: function() {
		application.settings.theme.set('icon_material', this.getValue('icon_material'));
	},

	onChangeIconCorners: function() {
		application.settings.theme.set('icon_corners', this.getValue('icon_corners'));
	},

	onChangeIconSize: function() {
		application.settings.theme.set('icon_size', this.getValue('icon_size'));
	},

	onChangeIconTilt: function() {
		application.settings.theme.set('icon_tilt', this.getValue('icon_tilt'));
	},

	onChangeIconTint: function() {
		application.settings.theme.set('icon_tint', this.getValue('icon_tint'));
	},

	onChangeIconBackground: function() {
		application.settings.theme.set('icon_background', this.getValue('icon_background'));
	},

	onChangeIconSpinning: function() {
		application.settings.theme.set('icon_spinning', this.getValue('icon_spinning'));
	},

	onChangeIconSelectEffect: function() {
		application.settings.theme.set('icon_select_effect', this.getValue('icon_select_effect'));
	},

	onChangeIconDeselectEffect: function() {
		application.settings.theme.set('icon_deselect_effect', this.getValue('icon_deselect_effect'));
	},

	onChangeIconHighlightEffect: function() {
		application.settings.theme.set('icon_highlight_effect', this.getValue('icon_highlight_effect'));
	},

	onChangeIconUnhighlightEffect: function() {
		application.settings.theme.set('icon_unhighlight_effect', this.getValue('icon_unhighlight_effect'));
	},

	onChangeIconOpenEffect: function() {
		application.settings.theme.set('icon_open_effect', this.getValue('icon_open_effect'));
	}
});
