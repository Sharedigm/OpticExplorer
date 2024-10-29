/******************************************************************************\
|                                                                              |
|                         dialog-effects-panel-view.js                         |
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
		<div class="dialog-open-effect form-group">
			<label class="control-label"><i class="fa fa-expand"></i>Open</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-open-effect" value="none"<% if (!dialog_open_effect || dialog_open_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-open-effect" value="slide"<% if (dialog_open_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-open-effect" value="zoom"<% if (dialog_open_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-open-effect" value="fade"<% if (dialog_open_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Open Effect" data-content="This determines the effect used when dialogs are opened."></i>
			</div>
		</div>
		
		<div class="dialog-close-effect form-group">
			<label class="control-label"><i class="fa fa-compress"></i>Close</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-close-effect" value="none"<% if (!dialog_close_effect || dialog_close_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-close-effect" value="slide"<% if (dialog_close_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-close-effect" value="zoom"<% if (dialog_close_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-close-effect" value="fade"<% if (dialog_close_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Close Effect" data-content="This determines the effect used when dialogs are closed."></i>
			</div>
		</div>
		
		<div class="dialog-minimize-effect form-group">
			<label class="control-label"><i class="fa fa-window-minimize"></i>Minimize</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-minimize-effect" value="none"<% if (!dialog_minimize_effect || dialog_minimize_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-minimize-effect" value="slide"<% if (dialog_minimize_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-minimize-effect" value="zoom"<% if (dialog_minimize_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-minimize-effect" value="fade"<% if (dialog_minimize_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Minimize Effect" data-content="This determines the effect used when dialogs are minimized."></i>
			</div>
		</div>
		
		<div class="dialog-unminimize-effect form-group">
			<label class="control-label"><i class="fa fa-window-maximize"></i>Unminimize</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-unminimize-effect" value="none"<% if (!dialog_unminimize_effect || dialog_unminimize_effect == 'none') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-unminimize-effect" value="slide"<% if (dialog_unminimize_effect == 'slide') {%> checked<% } %>>Slide</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-unminimize-effect" value="zoom"<% if (dialog_unminimize_effect == 'zoom') {%> checked<% } %>>Zoom</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-unminimize-effect" value="fade"<% if (dialog_unminimize_effect == 'fade') {%> checked<% } %>>Fade</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Maximize Effect" data-content="This determines the effect used when dialogs are maximized."></i>
			</div>
		</div>
	`),

	events: {
		'change .dialog-open-effect input': 'onChangeDialogOpenEffect',
		'change .dialog-close-effect input': 'onChangeDialogCloseEffect',
		'change .dialog-minimize-effect input': 'onChangeDialogMinimizeEffect',
		'change .dialog-unminimize-effect input': 'onChangeDialogUnminimizeEffect'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'dialog_open_effect':
				return this.$el.find('.dialog-open-effect input:checked').val();
			case 'dialog_close_effect':
				return this.$el.find('.dialog-close-effect input:checked').val();
			case 'dialog_minimize_effect':
				return this.$el.find('.dialog-minimize-effect input:checked').val();
			case 'dialog_unminimize_effect':
				return this.$el.find('.dialog-unminimize-effect input:checked').val();
		}
	},

	getValues: function() {
		return {
			dialog_open_effect: this.getValue('dialog_open_effect'),
			dialog_close_effect: this.getValue('dialog_close_effect'),
			dialog_minimize_effect: this.getValue('dialog_minimize_effect'),
			dialog_unminimize_effect: this.getValue('dialog_unminimize_effect'),
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			dialog_open_effect: application.settings.dialogs.get('dialog_open_effect'),
			dialog_close_effect: application.settings.dialogs.get('dialog_close_effect'),
			dialog_minimize_effect: application.settings.dialogs.get('dialog_minimize_effect'),
			dialog_unminimize_effect: application.settings.dialogs.get('dialog_unminimize_effect')
		};
	},

	//
	// event handling methods
	//

	onChangeDialogOpenEffect: function() {
		application.settings.dialogs.set('dialog_open_effect', this.getValue('dialog_open_effect'));
	},

	onChangeDialogCloseEffect: function() {
		application.settings.dialogs.set('dialog_close_effect', this.getValue('dialog_close_effect'));
	},

	onChangeDialogMinimizeEffect: function() {
		application.settings.dialogs.set('dialog_minimize_effect', this.getValue('dialog_minimize_effect'));
	},

	onChangeDialogUnminimizeEffect: function() {
		application.settings.dialogs.set('dialog_unminimize_effect', this.getValue('dialog_unminimize_effect'));
	}
});
