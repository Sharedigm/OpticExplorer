/******************************************************************************\
|                                                                              |
|                         dialog-shapes-panel-view.js                          |
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
		<div class="dialog-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-corners" value="square"<% if (dialog_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-corners" value="rounded"<% if (dialog_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-corners" value="round"<% if (dialog_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-corners" value="auto"<% if (!dialog_corners || dialog_corners == 'auto') {%> checked<% } %>>Auto</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dialog Corners" data-content="This determines how the corners on dialogs are displayed."></i>
			</div>
		</div>
		
		<div class="dialog-button-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Button Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-corners" value="square"<% if (dialog_button_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-corners" value="rounded"<% if (dialog_button_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-corners" value="round"<% if (dialog_button_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-button-corners" value="auto"<% if (!dialog_button_corners || dialog_button_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Dialog Button Corners" data-content="This determines how the corners on dialog buttons are displayed."></i>
			</div>
		</div>
		
		<div class="dialog-options form-group">
			<label class="control-label"><i class="fa fa-bars"></i>Options</label>
			<div class="controls">
				<div class="dialog-padding checkbox-inline">
					<label><input type="checkbox"<% if (dialog_padding) { %> checked="checked"<% } %>>Padding</label>
				</div>
			</div>
		</div>
		
		<div class="dialog-alert-size form-group">
			<label class="control-label"><i class="fa fa-exclamation-triangle"></i>Alert Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-alert-size" value="small"<% if (dialog_alert_size == 'small') {%> checked<% } %>>Small</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-alert-size" value="medium"<% if (dialog_alert_size == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Alert Size" data-content="This determines the size of dialog boxes used for alerts, notifications, and prompts."></i>
			</div>
		</div>
	`),

	events: {
		'change .dialog-corners input': 'onChangeDialogCorners',
		'change .dialog-button-corners input': 'onChangeDialogButtonCorners',
		'change .dialog-padding input': 'onChangeDialogPadding',
		'change .dialog-alert-size input': 'onChangeAlertDialogSize'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// dialog styles
			//
			case 'dialog_corners':
				return this.$el.find('.dialog-corners input:checked').val();
			case 'dialog_button_corners':
				return this.$el.find('.dialog-button-corners input:checked').val();
			case 'dialog_padding':
				return this.$el.find('.dialog-padding input:checked').val();
			case 'dialog_alert_size':
				return this.$el.find('.dialog-alert-size input:checked').val();
		}
	},

	getValues: function() {
		return {
			dialog_corners: this.getValue('dialog_corners'),
			dialog_button_corners: this.getValue('dialog_button_corners'),
			dialog_padding: this.getValue('dialog_padding'),
			dialog_alert_size: this.getValue('dialog_alert_size')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			dialog_corners: application.settings.dialogs.get('dialog_corners'),
			dialog_button_corners: application.settings.dialogs.get('dialog_button_corners'),
			dialog_padding: application.settings.dialogs.get('dialog_padding'),
			dialog_alert_size: application.settings.dialogs.get('dialog_alert_size')
		};
	},

	//
	// event handling methods
	//

	onChangeDialogCorners: function() {
		application.settings.dialogs.set('dialog_corners', this.getValue('dialog_corners'));
	},

	onChangeDialogButtonCorners: function() {
		application.settings.dialogs.set('dialog_button_corners', this.getValue('dialog_button_corners'));
	},

	onChangeDialogPadding: function() {
		application.settings.dialogs.set('dialog_padding', this.getValue('dialog_padding'));
	},

	onChangeAlertDialogSize: function() {
		application.settings.dialogs.set('dialog_alert_size', this.getValue('dialog_alert_size'));
	}
});
