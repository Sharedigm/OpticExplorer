/******************************************************************************\
|                                                                              |
|                             options-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';
import RangeInputView from '../../../../../../views/forms/inputs/range-input-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="corner-style form-group">
			<label class="control-label"><i class="fa fa-square"></i>Corners</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="corner-style" value="square"<% if (corner_style == 'square') {%> checked<% } %>>Square</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="corner-style" value="rounded"<% if (corner_style == 'rounded') {%> checked<% } %>>Rounded</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="corner-style" value="round"<% if (corner_style == 'round') {%> checked<% } %>>Round</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Corners" data-content="This determines how the corners on buttons and other user interface elements are displayed."></i>
			</div>
		</div>
		
		<div class="form-options form-group">
			<label class="control-label"><i class="fa fa-list"></i>Forms</label>
			<div class="controls">
		
				<div class="label-icons checkbox-inline">
					<label><input type="checkbox"<% if (label_icons) {%> checked<% } %>>Label Icons</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Menu Options" data-content="This determines options for rendering forms."></i>
			</div>
		</div>
		
		<div class="options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Options</label>
			<div class="controls">
		
				<div class="sidebar-panels checkbox-inline">
					<label><input type="checkbox"<% if (sidebar_panels) {%> checked<% } %>>Sidebar Panels</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Sidebar Options" data-content="This determines options for rendering sidebars."></i>
			</div>
		</div>

		<div class="splitter-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Splitter Size</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Splitter Size" data-content="This is the width of the splitter between panes."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		splitter_size: '.splitter-size .range-input',
	},

	events: {
		'change .corner-style input': 'onChangeCornerStyle',
		'change .label-icons input': 'onChangeLabelIcons',
		'change .sidebar-panels input': 'onChangeSideBarPanels'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'corner_style':
				return this.$el.find('.corner-style input:checked').val();
			case 'label-icons':
				return this.$el.find('.label-icons input').is(':checked');
			case 'sidebar_panels':
				return this.$el.find('.sidebar-panels input').is(':checked');
			case 'splitter_size':
				return this.getChildView('splitter_size').getValue();
		}
	},

	getValues: function() {
		return {
			corner_style: this.getValue('corner_style'),
			label_icons: this.getValue('label_icons'),
			sidebar_panels: this.getValue('sidebar_panels'),
			splitter_size: this.getValue('splitter_size')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'corner_style':
				this.$el.find('.corner-style input[type="radio"]').prop('checked', value);
				break;
			case 'label-icons':
				this.$el.find('.label-icons input[type="checkbox"]').prop('checked', value);
				break;
			case 'sidebar_panels':
				this.$el.find('.sidebar-panels input[type="checkbox"]').prop('checked', value);
				break;
			case 'sidebar_size':
				this.getChildView('splitter_size').setValue(value);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			corner_style: application.settings.theme.get('corner_style'),
			label_icons: application.settings.theme.get('label_icons'),
			sidebar_panels: application.settings.theme.get('sidebar_panels')
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'splitter_size':
				this.showSplitterSize();
				break;
		}
	},

	showSplitterSize: function() {
		this.showChildView('splitter_size', new RangeInputView({

			// options
			//
			value: application.settings.theme.get('splitter_size') || 0,
			min: 0,
			max: 15,
			step: 5,

			// callbacks
			//
			onchange: () => this.onChangeSplitterSize()
		}));	
	},

	//
	// event handling methods
	//

	onChangeCornerStyle: function() {
		application.settings.theme.set('corner_style', this.getValue('corner_style'));
	},

	onChangeShowLabelIcons: function() {
		application.settings.theme.set('label_icons', this.getValue('tab_icons'));
	},

	onChangeSideBarPanels: function() {
		application.settings.theme.set('sidebar_panels', this.getValue('sidebar_panels'));
	},

	onChangeSplitterSize: function() {
		application.settings.theme.set('splitter_size', this.getValue('splitter_size'));
	}
});
