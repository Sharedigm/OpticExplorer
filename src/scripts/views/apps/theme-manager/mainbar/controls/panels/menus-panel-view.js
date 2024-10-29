/******************************************************************************\
|                                                                              |
|                              menus-panel-view.js                             |
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
		<div class="controls-preview form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Preview</label>
			<div class="controls">
				<div class="menu-bar">
					<ul class="nav nav-menus">
						<li class="dropdown open">
							<a class="dropdown-toggle" data-toggle="dropdown" >
								<i class="fa fa-bars"></i>
								<span class="dropdown-title">Menu</span>
							</a>
							<ul class="dropdown-menu" style="display:block; z-index:auto; min-width:200px !important">
								<li role="presentation" class="dropdown open">
									<a class="dropdown-toggle menu-item"><i class="fa fa-info-circle"></i>Menu Item</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		<div class="menu-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="none"<% if (menu_material == 'none' || menu_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="chalk"<% if (menu_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="plastic"<% if (menu_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="glass"<% if (menu_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="metal"<% if (menu_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-material" value="auto"<% if (!menu_material || menu_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Menu Material" data-content="This determines the type of material that is used to render menus."></i>
			</div>
		</div>
		
		<div class="menubar-width form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Menubar</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="menubar-width" value="thin"<% if (menubar_width == 'thin') {%> checked<% } %>>Thin</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menubar-width" value="medium"<% if (menubar_width == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Menubar Width" data-content="This determines how thick the header and footer bars are."></i>
			</div>
		</div>
		
		<div class="menu-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-corners" value="square"<% if (menu_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-corners" value="rounded"<% if (menu_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-corners" value="round"<% if (menu_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="menu-corners" value="auto"<% if (!menu_corners || menu_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Menu Corners" data-content="This determines how the corners on menus are displayed."></i>
			</div>
		</div>
		
		<div class="menu-options form-group">
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">
		
				<div class="menu-icons checkbox-inline">
					<label><input type="checkbox"<% if (menu_icons) {%> checked<% } %>>Icons</label>
				</div>
		
				<div class="menus-attached checkbox-inline">
					<label><input type="checkbox"<% if (menus_attached) { %> checked="checked"<% } %>>Attached</label>
				</div>
		
				<div class="menu-margins checkbox-inline">
					<label><input type="checkbox"<% if (menu_margins) { %> checked="checked"<% } %>> Margins</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Menu Options" data-content="This determines options for rendering menus."></i>
			</div>
		</div>
	`),

	events: {
		'change .menu-material input': 'onChangeMenuMaterial',
		'change .menubar-width input': 'onChangeMenubarWidth',
		'change .menu-corners input': 'onChangeMenuCorners',
		'change .menu-icons input': 'onChangeMenuIcons',
		'change .menus-attached input': 'onChangeMenusAttached',
		'change .menu-margins input': 'onChangeMenuMargins'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'menu_material':
				return this.$el.find('.menu-material input:checked').val();
			case 'menubar_width':
				return this.$el.find('.menubar-width input:checked').val();
			case 'menu_corners':
				return this.$el.find('.menu-corners input:checked').val();
			case 'menu_icons':
				return this.$el.find('.menu-icons input').is(':checked');
			case 'menus_attached':
				return this.$el.find('.menus-attached input').is(':checked');
			case 'menu_margins':
				return this.$el.find('.menu-margins input').is(':checked');
		}
	},

	getValues: function() {
		return {
			menu_material: this.getValue('menu_material'),
			menubar_width: this.getValue('menubar_width'),
			menu_corners: this.getValue('menu_corners'),
			menu_icons: this.getValue('menu_icons'),
			menus_attached: this.getValue('menus_attached'),
			menu_margins: this.getValue('menu_margins')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			menu_material: application.settings.controls.get('menu_material'),
			menubar_width: application.settings.controls.get('menubar_width'),
			menu_corners: application.settings.controls.get('menu_corners'),
			menu_icons: application.settings.controls.get('menu_icons'),
			menus_attached: application.settings.controls.get('menus_attached'),
			menu_margins: application.settings.controls.get('menu_margins')
		};
	},

	//
	// event handling methods
	//

	onChangeMenuMaterial: function() {
		application.settings.controls.set('menu_material', this.getValue('menu_material'));
	},

	onChangeMenubarWidth: function() {
		application.settings.controls.set('menubar_width', this.getValue('menubar_width'));
	},

	onChangeMenuCorners: function() {
		application.settings.controls.set('menu_corners', this.getValue('menu_corners'));
	},

	onChangeMenuIcons: function() {
		application.settings.controls.set('menu_icons', this. getValue('menu_icons'));
	},

	onChangeMenusAttached: function() {
		application.settings.controls.set('menus_attached', this.getValue('menus_attached'));
	},

	onChangeMenuMargins: function() {
		application.settings.controls.set('menu_margins', this.getValue('menu_margins'));
	}
});