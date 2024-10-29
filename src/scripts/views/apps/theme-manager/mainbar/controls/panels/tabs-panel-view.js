/******************************************************************************\
|                                                                              |
|                               tabs-panel-view.js                             |
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
				<ul class="nav nav-tabs" role="tablist">
		
					<li role="presentation" class="active">
						<a role="tab" data-toggle="tab">
							<i class="fa fa-list"></i>
							<label>Tab1</label>
						</a>
					</li>
		
					<li role="presentation">
						<a role="tab" data-toggle="tab">
							<i class="fa fa-list"></i>
							<label>Tab2</label>
						</a>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="tab-material form-group">
			<label class="control-label"><i class="fa fa-cube"></i>Material</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="none"<% if (tab_material == 'none' || tab_material == 'flat') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="chalk"<% if (tab_material == 'chalk') {%> checked<% } %>>Chalk</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="plastic"<% if (tab_material == 'plastic') {%> checked<% } %>>Plastic</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="glass"<% if (tab_material == 'glass') {%> checked<% } %>>Glass</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="metal"<% if (tab_material == 'metal') {%> checked<% } %>>Metal</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-material" value="auto"<% if (!tab_material || tab_material == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tab Material" data-content="This determines the type of material that is used to render tabs."></i>
			</div>
		</div>
		
		<div class="tab-corners form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-corners" value="square"<% if (tab_corners == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-corners" value="rounded"<% if (tab_corners == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-corners" value="round"<% if (tab_corners == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-corners" value="auto"<% if (!tab_corners || tab_corners == 'auto') {%> checked<% } %>>Auto</label>	
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tab Corners" data-content="This determines how the corners on tabs are displayed."></i>
			</div>
		</div>
		
		<div class="tab-alignment form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Alignment</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-alignment" value="left"<% if (tab_alignment == 'left') {%> checked<% } %>>Left</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-alignment" value="center"<% if (tab_alignment == 'center') {%> checked<% } %>>Center</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tab-alignment" value="right"<% if (tab_alignment == 'right') {%> checked<% } %>>Right</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tab Alignment" data-content="This determines the alignment of tabs."></i>
			</div>
		</div>
		
		<div class="tab-options form-group">
			<label class="control-label"><i class="fa fa-ellipsis-h"></i>Options</label>
			<div class="controls">
		
				<div class="tabs-minimal checkbox-inline">
					<label><input type="checkbox"<% if (tabs_minimal) {%> checked<% } %>>Minimal</label>
				</div>
		
				<div class="tabs-expandable checkbox-inline">
					<label><input type="checkbox"<% if (tabs_expandable) {%> checked<% } %>>Expandable</label>
				</div>
		
				<div class="tabs-attached checkbox-inline">
					<label><input type="checkbox"<% if (tabs_attached) {%> checked<% } %>>Attached</label>
				</div>
		
				<div class="tab-margins checkbox-inline">
					<label><input type="checkbox"<% if (tab_margins) {%> checked<% } %>>Margins</label>
				</div>
		
				<div class="tab-icons checkbox-inline">
					<label><input type="checkbox"<% if (tab_icons) {%> checked<% } %>>Icons</label>
				</div>
		
				<div class="tab-close-buttons checkbox-inline">
					<label><input type="checkbox"<% if (tab_close_buttons) {%> checked<% } %>>Close Buttons</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tab Options" data-content="This determines options for rendering tabs."></i>
			</div>
		</div>
	`),

	events: {
		'change .tab-material input': 'onChangeTabMaterial',
		'change .tab-corners input': 'onChangeTabCorners',
		'change .tab-alignment input': 'onChangeTabAlignment',
		'change .tabs-minimal input': 'onChangeTabsMinimal',
		'change .tabs-expandable input': 'onChangeTabsExpandable',
		'change .tabs-attached input': 'onChangeTabsAttached',
		'change .tab-margins input': 'onChangeTabMargins',
		'change .tab-icons input': 'onChangeTabIcons',
		'change .tab-close-buttons input': 'onChangeTabCloseButtons'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'tab_material':
				return this.$el.find('.tab-material input:checked').val();
			case 'tab_corners':
				return this.$el.find('.tab-corners input:checked').val();
			case 'tab_alignment':
				return this.$el.find('.tab-alignment input:checked').val();
			case 'tabs_minimal':
				return this.$el.find('.tabs-minimal input').is(':checked');
			case 'tabs_expandable':
				return this.$el.find('.tabs-expandable input').is(':checked');
			case 'tabs_attached':
				return this.$el.find('.tabs-attached input').is(':checked');
			case 'tab_margins':
				return this.$el.find('.tab-margins input').is(':checked');
			case 'tab_icons':
				return this.$el.find('.tab-icons input').is(':checked');
			case 'tab_close_buttons':
				return this.$el.find('.tab-close-buttons input').is(':checked');
		}
	},

	getValues: function() {
		return {
			tab_material: this.getValue('tab_material'),
			tab_corners: this.getValue('tab_corners'),
			tab_alignment: this.getValue('tab_alignment'),
			tabs_minimal: this.getValue('tabs_minimal'),
			tabs_expandable: this.getValue('tabs_expandable'),
			tabs_attached: this.getValue('tabs_attached'),
			tab_margins: this.getValue('tab_margins'),
			tab_icons: this.getValue('tab_icons'),
			tab_close_buttons: this.getValue('tab_close_buttons')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab_material: application.settings.controls.get('tab_material'),
			tab_corners: application.settings.controls.get('tab_corners'),
			tab_alignment: application.settings.controls.get('tab_alignment'),
			tabs_minimal: application.settings.controls.get('tabs_minimal'),
			tabs_expandable: application.settings.controls.get('tabs_expandable'),
			tabs_attached: application.settings.controls.get('tabs_attached'),
			tab_margins: application.settings.controls.get('tab_margins'),
			tab_icons: application.settings.controls.get('tab_icons'),
			tab_close_buttons: application.settings.controls.get('tab_close_buttons'),
		};
	},

	//
	// event handling methods
	//

	onChangeTabMaterial: function() {
		application.settings.controls.set('tab_material', this.getValue('tab_material'));
	},

	onChangeTabCorners: function() {
		application.settings.controls.set('tab_corners', this.getValue('tab_corners'));
	},

	onChangeTabAlignment: function() {
		application.settings.controls.set('tab_alignment', this.getValue('tab_alignment'));
	},

	onChangeTabsMinimal: function() {
		application.settings.controls.set('tabs_minimal', this.getValue('tabs_minimal'));
	},

	onChangeTabsExpandable: function() {
		application.settings.controls.set('tabs_expandable', this.getValue('tabs_expandable'));
	},

	onChangeTabsAttached: function() {
		application.settings.controls.set('tabs_attached', this.getValue('tabs_attached'));
	},

	onChangeTabMargins: function() {
		application.settings.controls.set('tab_margins', this.getValue('tab_margins'));
	},

	onChangeTabIcons: function() {
		application.settings.controls.set('tab_icons', this.getValue('tab_icons'));
	},

	onChangeTabCloseButtons: function() {
		application.settings.controls.set('tab_close_buttons', this.getValue('tab_close_buttons'));
	}
});