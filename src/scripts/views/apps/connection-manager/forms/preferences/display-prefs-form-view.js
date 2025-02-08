/******************************************************************************\
|                                                                              |
|                          display-prefs-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="sidebar-panes form-group">
			<label class="control-label"><i class="fa fa-th-large"></i>Sidebar Panes</label>
			<div class="controls">
		
				<div class="show-sidebar checkbox-inline">
					<label><input type="checkbox"<% if (show_sidebar) { %> checked<% } %>>Sidebar</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Sidebar Panes" data-content="This is which sidebar panes to display."></i>
			</div>
		</div>

		<div class="sidebar-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Sidebar Size (%)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Sizebar Size" data-content="This is the size of the sizebar window pane."></i>
				</div>
			</div>
		</div>

		<div class="sidebar-min-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-h"></i>Sidebar Min Size</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Sizebar Min Size" data-content="This is the minimum size of the sizebar window pane."></i>
				</div>
			</div>
		</div>

		<div class="sidebar-panels form-group">
			<label class="control-label"><i class="fa fa-pause"></i>Sidebar Panels</label>
			<div class="controls">
				
				<div class="checkbox-inline">
					<label><input type="checkbox" value="groups"<% if (sidebar_panels.includes('groups')) { %> checked<% } %>>Groups</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Sidebar Panels" data-content="This is which panels are shown in the sidebar window pane."></i>
			</div>
		</div>

		<div class="sidebar-view-kind form-group">
			<label class="control-label"><i class="fa fa-th"></i>Sidebar Items</label>
			<div class="controls">
		
				<div class="show-sidebar-icons radio-inline">
					<label><input type="radio" name="sidebar-view-kind" value="icons"<% if (sidebar_view_kind == 'icons') { %> checked<% } %>>Icons</label>
				</div>
		
				<div class="show-sidebar-lists radio-inline">
					<label><input type="radio" name="sidebar-view-kind" value="lists"<% if (sidebar_view_kind == 'lists') { %> checked<% } %>>Lists</label>
				</div>
		
				<div class="show-sidebar-cards radio-inline">
					<label><input type="radio" name="sidebar-view-kind" value="cards"<% if (sidebar_view_kind == 'cards') { %> checked<% } %>>Cards</label>
				</div>
		
				<div class="show-sidebar-tiles radio-inline">
					<label><input type="radio" name="sidebar-view-kind" value="tiles"<% if (sidebar_view_kind == 'tiles') { %> checked<% } %>>Tiles</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Sidebar Items" data-content="This is the way sidebar items are displayed."></i>
			</div>
		</div>
	`),

	regions: {
		sidebar_size: '.sidebar-size .range-input',
		sidebar_min_size: '.sidebar-min-size .range-input'
	},

	events: {
		'change .show-sidebar input': 'onChangeShowSideBar',
		'change .sidebar-panels input': 'onChangeSideBarPanels',
		'change .sidebar-view-kind input': 'onChangeSideBarViewKind'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_sidebar':
				return this.$el.find('.show-sidebar input').is(':checked');
			case 'sidebar_size':
				return this.getChildView('sidebar_size').getValue();
			case 'sidebar_min_size':
				return this.getChildView('sidebar_min_size').getValue();
			case 'sidebar_panels': 
				return this.getElementsValues('.sidebar-panels input:checked');
			case 'sidebar_view_kind':
				return this.$el.find('.sidebar-view-kind input:checked').val();
		}
	},

	getValues: function() {
		return {
			show_sidebar: this.getValue('show_sidebar'),
			sidebar_size: this.getValue('sidebar_size'),
			sidebar_min_size: this.getValue('sidebar_min_size'),
			sidebar_panels: this.getValue('sidebar_panels'),
			sidebar_view_kind: this.getValue('sidebar_view_kind')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'show_sidebar':
				this.$el.find('.show-sidebar input[type="checkbox"]').prop('checked', value);
				break;
			case 'sidebar_size':
				this.getChildView('sidebar_size').setValue(value);
				break;
			case 'sidebar_min_size':
				this.getChildView('sidebar_min_size').setValue(value);
				break;
			case 'sidebar_panels':
				this.getElementsByValues('.sidebar-panels input', value).prop('checked', true);
				break;
			case 'sidebar_view_kind':
				this.$el.find('.sidebar-view-kind input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			sidebar_panels: this.model.get('sidebar_panels') || []	
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'sidebar_size':
				this.showSideBarSize();
				break;
			case 'sidebar_min_size':
				this.showSideBarMinSize();
				break;
		}
	},

	showSideBarSize: function() {
		this.showChildView('sidebar_size', new RangeInputView({

			// options
			//
			value: this.model.get('sidebar_size'),
			min: 0,
			max: 100,
			step: 5,

			// callbacks
			//
			onchange: () => this.onChangeSideBarSize()
		}));	
	},

	showSideBarMinSize: function() {
		this.showChildView('sidebar_min_size', new RangeInputView({

			// options
			//
			value: this.model.get('sidebar_min_size'),
			min: 0,
			max: 500,
			step: 25,

			// callbacks
			//
			onchange: () => this.onChangeSideBarMinSize()
		}));	
	},

	//
	// event handling methods
	//

	onChangeShowSideBar: function() {
		this.onChangeValue('show_sidebar', this.getValue('show_sidebar'));
	},

	onChangeSideBarSize: function() {
		this.onChangeValue('sidebar_size', this.getValue('sidebar_size'));
	},

	onChangeSideBarMinSize: function() {
		this.onChangeValue('sidebar_min_size', this.getValue('sidebar_min_size'));
	},

	onChangeSideBarPanels: function() {
		this.onChangeValue('sidebar_panels', this.getValue('sidebar_panels'));
	},

	onChangeSideBarViewKind: function() {
		this.onChangeValue('sidebar_view_kind', this.getValue('sidebar_view_kind'));
	}
});