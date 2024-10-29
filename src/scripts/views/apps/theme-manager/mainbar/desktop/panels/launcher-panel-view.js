/******************************************************************************\
|                                                                              |
|                            launcher-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
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
		<div class="desktop-app form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Preview</label>
			<div class="controls">
			
				<div>
					<div class="desktop preview" style="<% if (background_color) { %> background-color:<%= background_color %>;<% } %><% if (background_url) { %><% if (background_size != 'tile') { %> background-size:<%= background_size != 'center' && background_size != 'tile'? background_size : (100 / background_repeat) + '%'%>;<% } %> background-position:center; background-repeat:<%= background_size != 'tile'?'no-repeat':'repeat' %>; background-image:url(<%= background_url %>);<% } %>">
						<div width="100% height="100%" class="launcher-preview <%= launcher_style %>" />
					</div>
				</div>
			</div>
		</div>
		
		<div class="launcher-style form-group desktop_only">
			<label class="control-label"><i class="fa fa-rocket"></i>Style</label>
			<div class="controls">
			
				<div class="radio-inline">
					<label><input type="radio" name="launcher-style" value="taskbar"<% if (launcher_style == 'taskbar') { %> checked<% } %>>Taskbar</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-style" value="dock"<% if (launcher_style == 'dock') { %> checked<% } %>>Dock</label>
				</div>
		
				<div class="desktop-only radio-inline">
					<label><input type="radio" name="launcher-style" value="menu"<% if (launcher_style == 'menu') { %> checked<% } %>>Run Menu</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Launcher" data-content="This determines what type of app launcher is shown on your desktop."></i>
			</div>
		</div>
		
		<div class="run-menu-items form-group desktop_only"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-icons"></i>Run Menu Items</label>
			<div class="controls">
			
				<div class="radio-inline">
					<label><input type="radio" name="run-menu-items" value="icons"<% if (run_menu_items == 'icons') { %> checked<% } %>>Icons</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="run-menu-items" value="cards"<% if (run_menu_items == 'cards') { %> checked<% } %>>Cards</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="run-menu-items" value="lists"<% if (run_menu_items == 'lists') { %> checked<% } %>>Lists</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Run Menu Items" data-content="This determines how apps are shown in the run menu."></i>
			</div>
		</div>
		
		<div class="run-menu-corners form-group"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="run-menu-corners" value="square"<% if (run_menu_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="run-menu-corners" value="rounded"<% if (run_menu_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="run-menu-corners" value="round"<% if (run_menu_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="run-menu-corners" value="auto"<% if (!run_menu_corners || run_menu_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Corners" data-content="This determines how the run menu corners are displayed."></i>
			</div>
		</div>
		
		<div class="desktop-theme form-group">
			<label class="control-label"><i class="fa fa-sun"></i>Theme</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-theme" value="light"<% if (desktop_theme == 'light') {%> checked<% } %>>Light</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-theme" value="medium"<% if (desktop_theme == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-theme" value="dark"<% if (desktop_theme == 'dark') {%> checked<% } %>>Dark</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="desktop-theme" value="auto"<% if (!desktop_theme || desktop_theme == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Desktop Theme" data-content="This determines the color theme used to render the desktop header and footer."></i>
			</div>
		</div>
		
		<div class="taskbar-alignment form-group desktop_only"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Alignment</label>
			<div class="controls">
			
				<div class="radio-inline">
					<label><input type="radio" name="taskbar-alignment" value="left"<% if (taskbar_alignment == 'left') { %> checked<% } %>>Left</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="taskbar-alignment" value="center"<% if (taskbar_alignment == 'center') { %> checked<% } %>>Center</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Taskbar Alignment" data-content="This determines taskbars are aligned."></i>
			</div>
		</div>
		
		<div class="taskbar-options form-group"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="run-menu-attached"<% if (run_menu_attached) { %> checked="checked"<% } %>>Attached</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="run-menu-autohide"<% if (run_menu_autohide) { %> checked="checked"<% } %>>Autohide</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="taskbar-handles"<% if (taskbar_handles) { %> checked="checked"<% } %>>Handles</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="taskbar-minimized"<% if (taskbar_minimized) { %> checked="checked"<% } %>>Minimized</label>
				</div>
			</div>
		</div>
		
		<div class="launcher-open-effect form-group"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-expand"></i>Open</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-open-effect" value="none"<% if (!launcher_open_effect || launcher_open_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-open-effect" value="slide"<% if (launcher_open_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-open-effect" value="zoom"<% if (launcher_open_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-open-effect" value="fade"<% if (launcher_open_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Open Effect" data-content="This determines the effect used when launcher run menus are opened."></i>
			</div>
		</div>
		
		<div class="launcher-close-effect form-group"<% if (launcher_style != 'taskbar') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-compress"></i>Close</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-close-effect" value="none"<% if (!launcher_close_effect || launcher_close_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-close-effect" value="slide"<% if (launcher_close_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-close-effect" value="zoom"<% if (launcher_close_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="launcher-close-effect" value="fade"<% if (launcher_close_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Close Effect" data-content="This determines the effect used when launcher run menus are closed."></i>
			</div>
		</div>
		
		<div class="dock-tilt form-group"<% if (launcher_style != 'dock') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-italic"></i>Tilt</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-tilt" value="none"<% if (dock_tilt == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-tilt" value="left"<% if (dock_tilt == 'left') {%> checked<% } %>><i class="fa fa-arrow-left"></i></label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-tilt" value="right"<% if (dock_tilt == 'right') {%> checked<% } %>><i class="fa fa-arrow-right"></i></label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dock Tilt" data-content="This determines if the dock is displayed using a tilt effect."></i>
			</div>
		</div>
		
		<div class="dock-corners form-group"<% if (launcher_style != 'dock') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-corners" value="square"<% if (dock_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-corners" value="rounded"<% if (dock_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-corners" value="round"<% if (dock_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dock-corners" value="auto"<% if (!dock_corners || dock_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Corners" data-content="This determines how the dock corners are displayed."></i>
			</div>
		</div>
		
		<div class="dock-options form-group"<% if (launcher_style != 'dock') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">
				<div class="dock-attached checkbox-inline">
					<label><input type="checkbox"<% if (dock_attached) { %> checked="checked"<% } %>>Attached</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .launcher-style input': 'onChangeLauncherStyle',

		// taskbar options
		//
		'change .run-menu-items input': 'onChangeRunMenuItems',
		'change .run-menu-corners input': 'onChangeRunMenuCorners',
		'change input[value="run-menu-attached"]': 'onChangeRunMenuAttached',
		'change input[value="run-menu-autohide"]': 'onChangeRunMenuAutohide',
		'change .desktop-theme input': 'onChangeDesktopTheme',
		'change .taskbar-alignment input': 'onChangeTaskBarAlignment',
		'change input[value="taskbar-handles"]': 'onChangeTaskBarHandles',
		'change input[value="taskbar-minimized"]': 'onChangeTaskBarMinimized',
		'change .launcher-open-effect input': 'onChangeLauncherOpenEffect',
		'change .launcher-close-effect input': 'onChangeLauncherCloseEffect',

		// dock options
		//
		'change .dock-tilt input': 'onChangeDockTilt',
		'change .dock-corners input': 'onChangeDockCorners',
		'change .dock-attached input': 'onChangeDockAttached'
	},

	//
	// constructor
	//

	initialize: function() {

		// listen to model for changes
		//
		this.listenTo(application.desktop.settings, 'change', this.onChange, this);
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'launcher_style':
				return this.$el.find('.launcher-style input:checked').val();

			// taskbar options
			//
			case 'run_menu_items':
				return this.$el.find('.run-menu-items input:checked').val();
			case 'run_menu_corners':
				return this.$el.find('.run-menu-corners input:checked').val();
			case 'run_menu_attached':
				return this.$el.find('input[value="run-menu-attached"]').is(':checked');
			case 'run_menu_autohide':
				return this.$el.find('input[value="run-menu-autohide"]').is(':checked');
			case 'desktop_theme':
				return this.$el.find('.desktop-theme input:checked').val();
			case 'taskbar_alignment':
				return this.$el.find('.taskbar-alignment input:checked').val();
			case 'taskbar_handles':
				return this.$el.find('input[value="taskbar-handles"]').is(':checked');
			case 'taskbar_minimized':
				return this.$el.find('input[value="taskbar-minimized"]').is(':checked');
			case 'launcher_open_effect':
				return this.$el.find('.launcher-open-effect input:checked').val();
			case 'launcher_close_effect':
				return this.$el.find('.launcher-close-effect input:checked').val();

			// dock options
			//
			case 'dock_tilt':
				return this.$el.find('.dock-tilt input:checked').val();
			case 'dock_corners':
				return this.$el.find('.dock-corners input:checked').val();
			case 'dock_attached':
				return this.$el.find('.dock-attached input').is(':checked');
		}
	},

	getValues: function() {
		return {
			launcher_style: this.getValue('launcher_style'),

			// taskbar options
			//
			run_menu_items: this.getValue('run_menu_items'),
			run_menu_corners: this.getValue('run_menu_corners'),
			run_menu_attached: this.getValue('run_menu_attached'),
			run_menu_autohide: this.getValue('run_menu_autohide'),
			desktop_theme: this.getValue('desktop_theme'),
			taskbar_alignment: this.getValue('taskbar_alignment'),
			taskbar_handles: this.getValue('taskbar_handles'),
			taskbar_minimized: this.getValue('taskbar_minimized'),
			launcher_open_effect: this.getValue('launcher_open_effect'),
			launcher_close_effect: this.getValue('launcher_close_effect'),

			// dock options
			//
			dock_tilt: this.getValue('dock_tilt'),
			dock_corners: this.getValue('dock_corners'),
			dock_attached: this.getValue('dock_attached')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			launcher_style: application.desktop.settings.get('launcher_style'),

			// desktop preview options
			//
			background_url: application.desktop.settings.getBackgroundUrl(),
			background_size: application.desktop.settings.get('background_size') || 'cover',
			background_repeats: application.desktop.settings.get('background_repeats'),
			background_color: application.desktop.settings.get('background_color'),

			// taskbar options
			//
			run_menu_items: application.desktop.settings.get('run_menu_items'),
			run_menu_corners: application.desktop.settings.get('run_menu_corners'),
			run_menu_attached: application.desktop.settings.get('run_menu_attached'),
			run_menu_autohide: application.desktop.settings.get('run_menu_autohide'),
			desktop_theme: application.desktop.settings.get('desktop_theme'),
			taskbar_alignment: application.desktop.settings.get('taskbar_alignment'),
			taskbar_handles: application.desktop.settings.get('taskbar_handles'),
			taskbar_minimized: application.desktop.settings.get('taskbar_minimized'),
			launcher_open_effect: application.settings.desktop.get('launcher_open_effect'),
			launcher_close_effect: application.settings.desktop.get('launcher_close_effect'),

			// dock bar options
			//
			dock_tilt: application.desktop.settings.get('dock_tilt'),
			dock_corners: application.desktop.settings.get('dock_corners'),
			dock_attached: application.desktop.settings.get('dock_attached')
		};
	},

	onRender: function() {
		this.showPreviewColor(application.settings.desktop.get('background_color'));
	},

	showPreviewColor: function(color) {
		let element = this.$el.find('.desktop.preview');
		application.desktop.setBackgroundColor(color, element);
	},

	update: function() {
		if (application.desktop.settings.changed.launcher_style) {
			this.render();
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},

	onChangeLauncherStyle: function() {
		application.desktop.settings.set('launcher_style', this.getValue('launcher_style'));
	},

	onChangeRunMenuItems: function() {
		application.desktop.settings.set('run_menu_items', this.getValue('run_menu_items'));
	},

	onChangeRunMenuCorners: function() {
		application.desktop.settings.set('run_menu_corners', this.getValue('run_menu_corners'));
	},

	onChangeRunMenuAttached: function() {
		application.desktop.settings.set('run_menu_attached', this.getValue('run_menu_attached'));
	},

	onChangeRunMenuAutohide: function() {
		application.desktop.settings.set('run_menu_autohide', this.getValue('run_menu_autohide'));
	},

	onChangeDesktopTheme: function() {
		application.desktop.settings.set('desktop_theme', this.getValue('desktop_theme'));
	},

	onChangeTaskBarAlignment: function() {
		application.desktop.settings.set('taskbar_alignment', this.getValue('taskbar_alignment'));
	},

	onChangeTaskBarHandles: function() {
		application.desktop.settings.set('taskbar_handles', this.getValue('taskbar_handles'));
	},

	onChangeTaskBarMinimized: function() {
		application.desktop.settings.set('taskbar_minimized', this.getValue('taskbar_minimized'));
	},

	onChangeLauncherOpenEffect: function() {
		application.settings.desktop.set('launcher_open_effect', this.getValue('launcher_open_effect'));
	},

	onChangeLauncherCloseEffect: function() {
		application.settings.desktop.set('launcher_close_effect', this.getValue('launcher_close_effect'));
	},

	onChangeDockTilt: function() {
		application.desktop.settings.set('dock_tilt', this.getValue('dock_tilt'));
	},

	onChangeDockCorners: function() {
		application.desktop.settings.set('dock_corners', this.getValue('dock_corners'));
	},

	onChangeDockAttached: function() {
		application.desktop.settings.set('dock_attached', this.getValue('dock_attached'));
	}
});
