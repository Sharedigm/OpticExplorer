/******************************************************************************\
|                                                                              |
|                           materials-panel-view.js                            |
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
		
		<div class="material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="material" value="none"<% if (!material || material == 'none' || material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="material" value="chalk"<% if (material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="material" value="plastic"<% if (material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="material" value="glass"<% if (material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="material" value="metal"<% if (material == 'metal') {%> checked<% } %>>Metal</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Material" data-content="This determines the type of material that is used to render control elements (buttons, menus, tabs, sliders etc.)"></i>	
			</div>
		</div>
		
		<div class="transparency form-group">
			<label class="control-label"><i class="fa fa-glass-martini"></i>Transparency</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-style" value="opaque"<% if (transparency == 'opaque') {%> checked<% } %>>Opaque</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-style" value="transparent"<% if (transparency == 'transparent') {%> checked<% } %>>Clear</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="dialog-style" value="translucent"<% if (transparency == 'translucent') {%> checked<% } %>>Translucent</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Transparency" data-content="This determines whether or not transparency effects are used in the visual styling."></i>
			</div>
		</div>
	`),

	events: {
		'change .material input': 'onChangeMaterial',
		'change .transparency input': 'onChangeTransparency',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'material':
				return this.$el.find('.material input:checked').val();
			case 'transparency':
				return this.$el.find('.transparency input:checked').val();
		}
	},

	getValues: function() {
		return {
			material: this.getValue('material'),
			transparency: this.getValue('transparency')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			material: application.settings.theme.get('material'),
			transparency: application.settings.theme.get('transparency')
		};
	},

	//
	// event handling methods
	//

	onChangeMaterial: function() {
		application.settings.theme.set('material', this.getValue('material'));
	},

	onChangeTransparency: function() {
		application.settings.theme.set('transparency', this.getValue('transparency'));
	}
});
