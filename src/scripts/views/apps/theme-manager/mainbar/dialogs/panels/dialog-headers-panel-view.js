/******************************************************************************\
|                                                                              |
|                         dialog-headers-panel-view.js                         |
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
		<div class="dialog-header-width form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Headers</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-header-width" value="thin"<% if (dialog_header_width == 'thin') {%> checked<% } %>>Thin</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-header-width" value="medium"<% if (dialog_header_width == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-header-width" value="thick"<% if (dialog_header_width == 'thick') {%> checked<% } %>>Thick</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Headers" data-content="This determines the width of dialog headers."></i>
			</div>
		</div>
		
		<div class="dialog-title-style form-group">
			<label class="control-label"><i class="fa fa-font"></i>Title</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-title-style" value="left"<% if (dialog_title_style == 'left') {%> checked<% } %>>Left</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-title-style" value="center"<% if (dialog_title_style == 'center') {%> checked<% } %>>Center</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-title-style" value="right"<% if (dialog_title_style == 'right') {%> checked<% } %>>Right</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Title Style" data-content="This determines the dialog title location."></i>
			</div>
		</div>
		
		<div class="dialog-header-options form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Header Options</label>
			<div class="controls">
		
				<div class="dialog-header-icons checkbox-inline">
					<label><input type="checkbox"<% if (dialog_header_icons) {%> checked<% } %>>Icons</label>
				</div>
		
				<div class="dialog-handles checkbox-inline">
					<label><input type="checkbox"<% if (dialog_handles) { %> checked<% } %>>Handles</label>
				</div>
		
				<div class="dialog-buttons-shown checkbox-inline">
					<label><input type="checkbox"<% if (dialog_buttons) { %> checked<% } %>>Buttons</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Header Options" data-content="This determines options for rendering dialog headers."></i>
			</div>
		</div>
		
		<div class="dialog-footer-options form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Footer Options</label>
			<div class="controls">
		
				<div class="dialog-footer-icons checkbox-inline">
					<label><input type="checkbox"<% if (dialog_footer_icons) {%> checked<% } %>>Icons</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Footer Options" data-content="This determines options for rendering dialog footers."></i>
			</div>
		</div>
	`),

	events: {
		'change .dialog-header-width input': 'onChangeDialogHeaderWidth',
		'change .dialog-title-style input': 'onChangeDialogTitleStyle',
		'change .dialog-header-icons input': 'onChangeDialogHeaderIcons',
		'change .dialog-handles input': 'onChangeDialogHandles',
		'change .dialog-buttons-shown input': 'onChangeDialogButtons',
		'change .dialog-footer-icons input': 'onChangeDialogFooterIcons'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// dialog styles
			//
			case 'dialog_header_width':
				return this.$el.find('.dialog-header-width input:checked').val();
			case 'dialog_title_style':
				return this.$el.find('.dialog-title-style input:checked').val();
			case 'dialog_header_icons':
				return this.$el.find('.dialog-header-icons input').is(':checked');
			case 'dialog_handles':
				return this.$el.find('.dialog-handles input').is(':checked');
			case 'dialog_buttons':
				return this.$el.find('.dialog-buttons-shown input').is(':checked');
			case 'dialog_footer_icons':
				return this.$el.find('.dialog-footer-icons input').is(':checked');
		}
	},

	getValues: function() {
		return {
			dialog_header_width: this.getValue('dialog_header_width'),
			dialog_title_style: this.getValue('dialog_title_style'),
			dialog_header_icons: this.getValue('dialog_header_icons'),
			dialog_handles: this.getValue('dialog_handles'),
			dialog_buttons: this.getValue('dialog_buttons'),
			dialog_footer_icons: this.getValue('dialog_footer_icons')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			dialog_header_width: application.settings.dialogs.get('dialog_header_width'),
			dialog_title_style: application.settings.dialogs.get('dialog_title_style'),
			dialog_header_icons: application.settings.dialogs.get('dialog_header_icons'),
			dialog_handles: application.settings.dialogs.get('dialog_handles'),
			dialog_buttons: application.settings.dialogs.get('dialog_buttons'),
			dialog_footer_icons: application.settings.dialogs.get('dialog_footer_icons'),
		};
	},

	//
	// event handling methods
	//

	onChangeDialogHeaderWidth: function() {
		application.settings.dialogs.set('dialog_header_width', this.getValue('dialog_header_width'));
	},

	onChangeDialogTitleStyle: function() {
		application.settings.dialogs.set('dialog_title_style', this.getValue('dialog_title_style'));
	},

	onChangeDialogHeaderIcons: function() {
		application.settings.dialogs.set('dialog_header_icons', this.getValue('dialog_header_icons'));
	},

	onChangeDialogHandles: function() {
		application.settings.dialogs.set('dialog_handles', this.getValue('dialog_handles'));
	},

	onChangeDialogButtons: function() {
		application.settings.dialogs.set('dialog_buttons', this.getValue('dialog_buttons'));
	},

	onChangeDialogFooterIcons: function() {
		application.settings.dialogs.set('dialog_footer_icons', this.getValue('dialog_footer_icons'));
	}
});
