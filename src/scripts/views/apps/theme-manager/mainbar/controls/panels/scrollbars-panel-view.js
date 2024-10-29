/******************************************************************************\
|                                                                              |
|                           scrollbars-panel-view.js                           |
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
				<div style="max-width:200px; height:50px; overflow:auto; margin:auto">
					<div style="width:300px; height:60px"></div>
				</div>
			</div>
		</div>
		
		<div class="scrollbar-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="none"<% if (scrollbar_material == 'none' || scrollbar_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="chalk"<% if (scrollbar_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="plastic"<% if (scrollbar_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="glass"<% if (scrollbar_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="metal"<% if (scrollbar_material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-material" value="auto"<% if (!scrollbar_material || scrollbar_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Scrollbar Material" data-content="This determines the type of material that is used to render scrollbars."></i>	
			</div>
		</div>
		
		<div class="scrollbar-width form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Width</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-width" value="thin"<% if (scrollbar_width == 'thin') {%> checked<% } %>>Thin</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-width" value="medium"<% if (scrollbar_width == 'medium') {%> checked<% } %>>Medium</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-width" value="thick"<% if (scrollbar_width == 'thick') {%> checked<% } %>>Thick</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Scrollbar Width" data-content="This determines how thick the scrollbars are."></i>
			</div>
		</div>
		
		<div class="scrollbar-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-corners" value="square"<% if (scrollbar_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-corners" value="rounded"<% if (scrollbar_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-corners" value="round"<% if (scrollbar_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="scrollbar-corners" value="auto"<% if (!scrollbar_corners || scrollbar_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Scrollbar Corners" data-content="This determines how the scrollbar corners are displayed."></i>
			</div>
		</div>
	`),

	events: {
		'change .scrollbar-material input': 'onChangeScrollbarMaterial',
		'change .scrollbar-width input': 'onChangeScrollbarWidth',
		'change .scrollbar-corners input': 'onChangeScrollbarCorners'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'scrollbar_material':
				return this.$el.find('.scrollbar-material input:checked').val();
			case 'scrollbar_width':
				return this.$el.find('.scrollbar-width input:checked').val();
			case 'scrollbar_corners':
				return this.$el.find('.scrollbar-corners input:checked').val();
		}
	},

	getValues: function() {
		return {
			scrollbar_material: this.getValue('scrollbar_material'),
			scrollbar_width: this.getValue('scrollbar_width'),
			scrollbar_corners: this.getValue('scrollbar_corners')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			scrollbar_material: application.settings.controls.get('scrollbar_material'),
			scrollbar_width: application.settings.controls.get('scrollbar_width'),
			scrollbar_corners: application.settings.controls.get('scrollbar_corners')
		};
	},

	//
	// event handling methods
	//

	onChangeScrollbarMaterial: function() {
		application.settings.controls.set('scrollbar_material', this.getValue('scrollbar_material'));
	},

	onChangeScrollbarWidth: function() {
		application.settings.controls.set('scrollbar_width', this.getValue('scrollbar_width'));
	},

	onChangeScrollbarCorners: function() {
		application.settings.controls.set('scrollbar_corners', this.getValue('scrollbar_corners'));
	}
});