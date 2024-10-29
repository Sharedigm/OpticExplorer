/******************************************************************************\
|                                                                              |
|                         dialog-buttons-panel-view.js                         |
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
		<div class="dialog-button-alignment form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Alignment</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-alignment" value="left"<% if (dialog_button_alignment == 'left') {%> checked<% } %>>Left</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-alignment" value="split"<% if (dialog_button_alignment == 'split') {%> checked<% } %>>Split</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-alignment" value="right"<% if (dialog_button_alignment == 'right') {%> checked<% } %>>Right</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Alignment" data-content="This determines the alignment of dialog buttons."></i>
			</div>
		</div>
		
		<div class="dialog-button-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-size" value="small"<% if (dialog_button_size == 'small') {%> checked<% } %>>Small</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-size" value="medium"<% if (dialog_button_size == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-size" value="large"<% if (dialog_button_size == 'large') {%> checked<% } %>>Large</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Size" data-content="This determines the size of dialog buttons."></i>
			</div>
		</div>
		
		<div class="dialog-button-width form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Width</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-width" value="square"<% if (dialog_button_width == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-width" value="rect"<% if (dialog_button_width == 'rect') {%> checked<% } %>>Rect</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-width" value="wide"<% if (dialog_button_width == 'wide') {%> checked<% } %>>Wide</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Button Width" data-content="This determines the width of dialog buttons."></i>
			</div>
		</div>
		
		<div class="dialog-button-options form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Options</label>
			<div class="controls">
		
				<div class="dialog-button-labels checkbox-inline">
					<label><input type="checkbox"<% if (dialog_button_labels) { %> checked<% } %>>Labels</label>
				</div>
		
				<div class="dialog-button-outlines checkbox-inline">
					<label><input type="checkbox"<% if (dialog_button_outlines) { %> checked<% } %>>Outlines</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Show" data-content="This determines options for rendering dialog buttons."></i>
			</div>
		</div>
	`),

	events: {
		'change .dialog-button-alignment input': 'onChangeDialogButtonAlignment',
		'change .dialog-button-size input': 'onChangeDialogButtonSize',
		'change .dialog-button-width input': 'onChangeDialogButtonWidth',
		'change .dialog-button-labels input': 'onChangeDialogButtonLabels',
		'change .dialog-button-outlines input': 'onChangeDialogButtonOutlines'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'dialog_button_alignment':
				return this.$el.find('.dialog-button-alignment input:checked').val();
			case 'dialog_button_size':
				return this.$el.find('.dialog-button-size input:checked').val();
			case 'dialog_button_width':
				return this.$el.find('.dialog-button-width input:checked').val();
			case 'dialog_button_labels':
				return this.$el.find('.dialog-button-labels input').is(':checked');
			case 'dialog_button_outlines':
				return this.$el.find('.dialog-button-outlines input').is(':checked');
		}
	},

	getValues: function() {
		return {
			dialog_button_alignment: this.getValue('dialog_button_alignment'),
			dialog_button_size: this.getValue('dialog_button_size'),
			dialog_button_width: this.getValue('dialog_button_width'),
			dialog_button_labels: this.getValue('dialog_button_labels'),
			dialog_button_outlines: this.getValue('dialog_button_outlines')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			dialog_button_alignment: application.settings.dialogs.get('dialog_button_alignment'),
			dialog_button_size: application.settings.dialogs.get('dialog_button_size'),
			dialog_button_width: application.settings.dialogs.get('dialog_button_width'),
			dialog_button_labels: application.settings.dialogs.get('dialog_button_labels'),
			dialog_button_outlines: application.settings.dialogs.get('dialog_button_outlines')
		};
	},

	//
	// event handling methods
	//

	onChangeDialogButtonAlignment: function() {
		application.settings.dialogs.set('dialog_button_alignment', this.getValue('dialog_button_alignment'));
	},

	onChangeDialogButtonSize: function() {
		application.settings.dialogs.set('dialog_button_size', this.getValue('dialog_button_size'));
	},

	onChangeDialogButtonWidth: function() {
		application.settings.dialogs.set('dialog_button_width', this.getValue('dialog_button_width'));
	},

	onChangeDialogButtonLabels: function() {
		application.settings.dialogs.set('dialog_button_labels', this.getValue('dialog_button_labels'));
	},

	onChangeDialogButtonOutlines: function() {
		application.settings.dialogs.set('dialog_button_outlines', this.getValue('dialog_button_outlines'));
	}
});
