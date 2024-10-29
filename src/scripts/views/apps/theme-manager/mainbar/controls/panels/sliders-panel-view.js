/******************************************************************************\
|                                                                              |
|                             sliders-panel-view.js                            |
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
				<input type="range" min="0" max="100" step="1" value="50" style="width:150px; margin:auto" />
			</div>
		</div>
		
		<div class="slider-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="none"<% if (slider_material == 'none' || slider_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="chalk"<% if (slider_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="plastic"<% if (slider_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="glass"<% if (slider_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="metal"<% if (slider_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-material" value="auto"<% if (!slider_material || slider_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Slider Material" data-content="This determines the type of material that is used to render sliders."></i>	
			</div>
		</div>
		
		<div class="slider-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-corners" value="square"<% if (slider_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-corners" value="rounded"<% if (slider_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-corners" value="round"<% if (slider_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-corners" value="auto"<% if (!slider_corners || slider_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Slider Corners" data-content="This determines how the corners on sliders are displayed."></i>
			</div>
		</div>
		
		<div class="slider-handle-width form-group">
			<label class="control-label"><i class="fa fa-arrows-h"></i>Handle Width</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-handle-width" value="narrow"<% if (slider_handle_width == 'narrow') {%> checked<% } %>>Narrow</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-handle-width" value="medium"<% if (slider_handle_width == 'medium' || !slider_handle_width) {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="slider-handle-width" value="wide"<% if (slider_handle_width == 'wide') {%> checked<% } %>>Wide</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Slider Handle Width" data-content="This determines how wide slider handles are."></i>
			</div>
		</div>
	`),

	events: {
		'change .slider-material input': 'onChangeSliderMaterial',
		'change .slider-corners input': 'onChangeSliderCorners',
		'change .slider-handle-width input': 'onChangeSliderHandleWidth',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'slider_material':
				return this.$el.find('.slider-material input:checked').val();
			case 'slider_corners':
				return this.$el.find('.slider-corners input:checked').val();
			case 'slider_handle_width':
				return this.$el.find('.slider-handle-width input:checked').val();
		}
	},

	getValues: function() {
		return {
			slider_material: this.getValue('slider_material'),
			slider_corners: this.getValue('slider_corners'),
			slider_handle_width: this.getValue('slider_handle_width'),
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			slider_material: application.settings.controls.get('slider_material'),
			slider_corners: application.settings.controls.get('slider_corners'),
			slider_handle_width: application.settings.controls.get('slider_handle_width')
		};
	},

	//
	// event handling methods
	//

	onChangeSliderMaterial: function() {
		application.settings.controls.set('slider_material', this.getValue('slider_material'));
	},

	onChangeSliderCorners: function() {
		application.settings.controls.set('slider_corners', this.getValue('slider_corners'));
	},

	onChangeSliderHandleWidth: function() {
		application.settings.controls.set('slider_handle_width', this.getValue('slider_handle_width'));
	}
});