/******************************************************************************\
|                                                                              |
|                            splitters-panel-view.js                           |
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
				<div class="split-view">
					<div class="gutter gutter-vertical">
						<div class="handle"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="splitter-width form-group">
			<label class="control-label"><i class="fa fa-arrows-h"></i>Splitter Width</label>
			<div class="controls">

				<div class="radio-inline">
					<label><input type="radio" name="splitter-width" value="none"<% if (splitter_width == 'none') {%> checked<% } %>>None</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="splitter-width" value="narrow"<% if (splitter_width == 'narrow') {%> checked<% } %>>Narrow</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="splitter-width" value="medium"<% if (splitter_width == 'medium' || !splitter_width) {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="splitter-width" value="wide"<% if (splitter_width == 'wide') {%> checked<% } %>>Wide</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Splitter Width" data-content="This determines how wide splitters are."></i>
			</div>
		</div>

		<div class="splitter-options form-group">
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">

				<div class="splitter-handles checkbox-inline">
					<label><input type="checkbox"<% if (splitter_handles) {%> checked<% } %>>Handles</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Splitter Options" data-content="This determines options for rendering splitters."></i>
			</div>
		</div>

		<div class="splitter-handle-width form-group">
			<label class="control-label"><i class="fa fa-arrows-v"></i>Splitter Handle Width</label>
			<div class="controls">

				<div class="radio-inline">
					<label><input type="radio" name="splitter-handle-width" value="narrow"<% if (splitter_handle_width == 'narrow') {%> checked<% } %>>Narrow</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="splitter-handle-width" value="medium"<% if (splitter_handle_width == 'medium' || !splitter_handle_width) {%> checked<% } %>>Medium</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="splitter-handle-width" value="wide"<% if (splitter_handle_width == 'wide') {%> checked<% } %>>Wide</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Splitter Handle Width" data-content="This determines how wide splitters handles are."></i>
			</div>
		</div>
	`),

	events: {
		'change .splitter-width input': 'onChangeSplitterWidth',
		'change .splitter-handles input': 'onChangeSplitterHandles',
		'change .splitter-handle-width input': 'onChangeSplitterHandleWidth',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'splitter_width':
				return this.$el.find('.splitter-width input:checked').val();
			case 'splitter_handles':
				return this.$el.find('.splitter-handles input:checked').val();
			case 'splitter_handle_width':
				return this.$el.find('.splitter-handle-width input:checked').val();
		}
	},

	getValues: function() {
		return {
			splitter_width: this.getValue('splitter_width'),
			splitter_handles: this.getValue('splitter_handles'),
			splitter_handle_width: this.getValue('splitter_handle_width'),
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			splitter_width: application.settings.controls.get('splitter_width'),
			splitter_handles: application.settings.controls.get('splitter_handles'),
			splitter_handle_width: application.settings.controls.get('splitter_handle_width')
		};
	},

	//
	// event handling methods
	//

	onChangeSplitterWidth: function() {
		application.settings.controls.set('splitter_width', this.getValue('splitter_width'));
	},

	onChangeSplitterHandles: function() {
		application.settings.controls.set('splitter_handles', this.getValue('splitter_handles'));
	},

	onChangeSplitterHandleWidth: function() {
		application.settings.controls.set('splitter_handle_width', this.getValue('splitter_handle_width'));
	}
});