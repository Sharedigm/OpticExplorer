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
		
				<div class="show-video-info checkbox-inline">
					<label><input type="checkbox"<% if (show_video_info) { %> checked<% } %>>Video Info</label>
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
					<label><input type="checkbox" value="videos"<% if (sidebar_panels.includes('videos')) { %> checked<% } %>>Videos</label>
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
		
		<div class="info-bar-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Info Bar Size (%)</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Info Bar Size" data-content="This is the size of the info bar window pane."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		sidebar_size: '.sidebar-size .range-input',
		sidebar_min_size: '.sidebar-min-size .range-input',
		info_bar_size: '.info-bar-size .range-input'
	},

	events: {
		'change .show-sidebar input': 'onChangeShowSideBar',
		'change .show-video-info input': 'onChangeShowVideoInfo',
		'change .sidebar-panels input': 'onChangeSideBarPanels',
		'change .sidebar-view-kind input': 'onChangeSideBarViewKind',
		'change .show-videos input': 'onChangeShowVideos'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_sidebar':
				return this.$el.find('.show-sidebar input').is(':checked');
			case 'show_video_info':
				return this.$el.find('.show-video-info input').is(':checked');
			case 'sidebar_size':
				return this.getChildView('sidebar_size').getValue();
			case 'sidebar_min_size':
				return this.getChildView('sidebar_min_size').getValue();
			case 'sidebar_panels': 
				return this.getElementsValues('.sidebar-panels input:checked');
			case 'sidebar_view_kind':
				return this.$el.find('.sidebar-view-kind input:checked').val();
			case 'info_bar_size':
				return this.getChildView('info_bar_size').getValue();
		}
	},

	getValues: function() {
		return {
			show_sidebar: this.getValue('show_sidebar'),
			show_video_info: this.getValue('show_video_info'),
			sidebar_size: this.getValue('sidebar_size'),
			sidebar_min_size: this.getValue('sidebar_min_size'),
			sidebar_panels: this.getValue('sidebar_panels'),
			sidebar_view_kind: this.getValue('sidebar_view_kind'),
			info_bar_size: this.getValue('info_bar_size')
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
			case 'show_video_info':
				this.$el.find('.show-video-info input[type="checkbox"]').prop('checked', value);
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
			case 'info_bar_size':
				this.getChildView('info_bar_size').setValue(value);
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
			case 'info_bar_size':
				this.showInfoBarSize();
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

	showInfoBarSize: function() {
		this.showChildView('info_bar_size', new RangeInputView({

			// options
			//
			value: this.model.get('info_bar_size'),
			min: 0,
			max: 100,
			step: 5,

			// callbacks
			//
			onchange: () => this.onChangeInfoBarSize()
		}));
	},

	//
	// event handling methods
	//

	onChangeShowSideBar: function() {
		this.onChangeValue('show_sidebar', this.getValue('show_sidebar'));
	},

	onChangeShowVideoInfo: function() {
		this.onChangeValue('show_video_info', this.getValue('show_video_info'));
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
	},

	onChangeInfoBarSize: function() {
		this.onChangeValue('info_bar_size', this.getValue('info_bar_size'));
	}
});