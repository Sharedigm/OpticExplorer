/******************************************************************************\
|                                                                              |
|                         dialog-colors-panel-view.js                          |
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
		<div class="dialog-colors form-group" style="display:none">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Colors</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-colors" value="monochrome"<% if (dialog_colors == 'monochrome') {%> checked<% } %>>Monochrome</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-colors" value="colored"<% if (dialog_colors == 'colored') {%> checked<% } %>>Colored</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-colors" value="colorful"<% if (dialog_colors == 'colorful') {%> checked<% } %>>Colorful</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Colors" data-content="This determines the colors of dialogs."></i>
			</div>
		</div>
		
		<div class="dialog-material form-group" style="padding-top:0; border-top:none">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="none"<% if (dialog_material == 'none' || dialog_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="chalk"<% if (dialog_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="plastic"<% if (dialog_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="glass"<% if (dialog_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="metal"<% if (dialog_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-material" value="auto"<% if (!dialog_material || dialog_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dialog Material" data-content="This determines the type of material that is used to render dialogs"></i>
			</div>
		</div>
		
		<div class="dialog-button-colors form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Button Colors</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-colors" value="monochrome"<% if (dialog_button_colors == 'monochrome') {%> checked<% } %>>Monochrome</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-colors" value="colored"<% if (dialog_button_colors == 'colored') {%> checked<% } %>>Colored</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-colors" value="colorful"<% if (dialog_button_colors == 'colorful') {%> checked<% } %>>Colorful</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Colors" data-content="This determines the colors of dialog buttons."></i>
			</div>
		</div>
		
		<div class="dialog-button-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Button Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="none"<% if (dialog_button_material == 'none' || dialog_button_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="chalk"<% if (dialog_button_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="plastic"<% if (dialog_button_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="glass"<% if (dialog_button_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="metal"<% if (dialog_button_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-material" value="auto"<% if (!dialog_button_material || dialog_button_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dialog Button Material" data-content="This determines the type of material that is used to render dialog buttons"></i>
			</div>
		</div>
		
		<div class="dialog-button-label-colors form-group">
			<label class="control-label"><i class="fa fa-icons"></i>Button Label Colors</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-label-colors" value="light"<% if (dialog_button_label_colors == 'light') {%> checked<% } %>>Light</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-label-colors" value="dark"<% if (dialog_button_label_colors == 'dark') {%> checked<% } %>>Dark</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Label Colors" data-content="This determines the colors of dialog button labels."></i>
			</div>
		</div>
	`),

	events: {
		'change .dialog-colors input': 'onChangeDialogColors',
		'change .dialog-material input': 'onChangeDialogMaterial',
		'change .dialog-button-colors input': 'onChangeDialogButtonColors',
		'change .dialog-button-material input': 'onChangeDialogButtonMaterial',
		'change .dialog-button-label-colors input': 'onChangeDialogButtonLabelColors'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'dialog_colors':
				return this.$el.find('.dialog-colors input:checked').val();
			case 'dialog_material':
				return this.$el.find('.dialog-material input:checked').val();
			case 'dialog_button_colors':
				return this.$el.find('.dialog-button-colors input:checked').val();
			case 'dialog_button_material':
				return this.$el.find('.dialog-button-material input:checked').val();
			case 'dialog_button_label_colors':
				return this.$el.find('.dialog-button-label-colors input:checked').val();
		}
	},

	getValues: function() {
		return {
			dialog_colors: this.getValue('dialog_colors'),
			dialog_material: this.getValue('dialog_material'),
			dialog_button_colors: this.getValue('dialog_button_colors'),
			dialog_button_material: this.getValue('dialog_button_material'),
			dialog_button_label_colors: this.getValue('dialog_button_label_colors')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			dialog_colors: application.settings.dialogs.get('dialog_colors'),
			dialog_material: application.settings.dialogs.get('dialog_material'),
			dialog_button_colors: application.settings.dialogs.get('dialog_button_colors'),
			dialog_button_material: application.settings.dialogs.get('dialog_button_material'),
			dialog_button_label_colors: application.settings.dialogs.get('dialog_button_label_colors')
		};
	},

	//
	// event handling methods
	//

	onChangeDialogColors: function() {
		application.settings.dialogs.set('dialog_colors', this.getValue('dialog_colors'));
	},

	onChangeDialogMaterial: function() {
		application.settings.dialogs.set('dialog_material', this.getValue('dialog_material'));
	},

	onChangeDialogButtonColors: function() {
		application.settings.dialogs.set('dialog_button_colors', this.getValue('dialog_button_colors'));
	},

	onChangeDialogButtonMaterial: function() {
		application.settings.dialogs.set('dialog_button_material', this.getValue('dialog_button_material'));
	},

	onChangeDialogButtonLabelColors: function() {
		application.settings.dialogs.set('dialog_button_label_colors', this.getValue('dialog_button_label_colors'));
	}
});
