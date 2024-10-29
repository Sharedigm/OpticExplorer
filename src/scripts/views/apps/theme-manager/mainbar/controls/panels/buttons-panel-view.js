/******************************************************************************\
|                                                                              |
|                             buttons-panel-view.js                            |
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
				<div class="buttons">
					<button class="btn btn-primary"><i class="fa fa-info-circle"></i>Button1</button>
					<button class="btn"><i class="fa fa fa-info-circle"></i>Button2</button>
				</div>
			</div>
		</div>
		
		<div class="button-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="none"<% if (button_material == 'none' || button_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="chalk"<% if (button_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="plastic"<% if (button_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="glass"<% if (button_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="metal"<% if (button_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-material" value="auto"<% if (!button_material || button_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Material" data-content="This determines the type of material that is used to render buttons."></i>	
			</div>
		</div>
		
		<div class="button-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="button-corners" value="square"<% if (button_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-corners" value="rounded"<% if (button_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-corners" value="round"<% if (button_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="button-corners" value="auto"<% if (!button_corners || button_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Corners" data-content="This determines how the corners on buttons are displayed."></i>
			</div>
		</div>
		
		<div class="button-options form-group">
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">
		
				<div class="button-icons checkbox-inline">
					<label><input type="checkbox"<% if (button_icons) {%> checked<% } %>>Icons</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Options" data-content="This determines options for rendering buttons."></i>
			</div>
		</div>
	`),

	events: {
		'change .button-material input': 'onChangeButtonMaterial',
		'change .button-corners input': 'onChangeButtonCorners',
		'change .button-icons input': 'onChangeButtonIcons'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'button_material':
				return this.$el.find('.button-material input:checked').val();
			case 'button_corners':
				return this.$el.find('.button-corners input:checked').val();
			case 'button_icons':
				return this.$el.find('.button-icons input').is(':checked');
		}
	},

	getValues: function() {
		return {
			button_material: this.getValue('button_material'),
			button_corners: this.getValue('button_corners'),
			button_icons: this.getValue('button_icons')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			button_material: application.settings.controls.get('button_material'),
			button_corners: application.settings.controls.get('button_corners'),
			button_icons: application.settings.controls.get('button_icons')
		};
	},

	//
	// event handling methods
	//

	onChangeButtonMaterial: function() {
		application.settings.controls.set('button_material', this.getValue('button_material'));
	},

	onChangeButtonCorners: function() {
		application.settings.controls.set('button_corners', this.getValue('button_corners'));
	},

	onChangeButtonIcons: function() {
		application.settings.controls.set('button_icons', this.getValue('button_icons'));
	}
});