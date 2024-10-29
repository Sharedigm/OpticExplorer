/******************************************************************************\
|                                                                              |
|                        desktop-options-panel-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing an options panel form.                |
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
		<div class="show-app-name form-group">
			<label class="control-label"><i class="fa fa-rocket"></i>Header</label>
			<div class="controls">
				<div class="checkbox-inline">
					<label><input type="checkbox"<% if (show_app_name) { %> checked<% } %> />
					&nbsp;<label>Show desktop app name in header bar</label>
				</div>
			</div>
		</div>
		
		<div class="show-clock form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Clock</label>
			<div class="controls">
				<div class="checkbox-inline">
					<label><input type="checkbox"<% if (show_clock) { %> checked<% } %> />
					&nbsp;<label>Show clock in header bar</label>
				</div>
			</div>
		</div>
		
		<div class="show-app-info form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Footer</label>
			<div class="controls">
				<div class="checkbox-inline">
					<label><input type="checkbox"<% if (show_app_info) { %> checked<% } %> />
					&nbsp;<label>Show app info in footer bar</label>
				</div>
			</div>
		</div>
		
		<div class="options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Options</label>
			<div class="controls">
		
				<div class="show-trash-in-corner checkbox-inline">
					<label><input type="checkbox"<% if (show_trash_in_corner) { %> checked<% } %> />
					&nbsp;<label>Show trash in corner</label>
				</div>

				<div class="show-dialog-parallax-shift checkbox-inline">
					<label><input type="checkbox"<% if (show_dialog_parallax_shift) { %> checked<% } %> />
					&nbsp;<label>Show dialog parallax shift</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .show-app-name input': 'onChangeShowAppName',
		'change .show-clock input': 'onChangeShowClock',
		'change .show-app-info input': 'onChangeShowAppInfo',
		'change .show-trash-in-corner input': 'onChangeShowTrashInCorner',
		'change .show-dialog-parallax-shift input': 'onChangeShowDialogParallaxShift'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = application.settings.desktop;
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'show_app_name':
				return this.$el.find('.show-app-name input').is(':checked');
			case 'show_clock':
				return this.$el.find('.show-clock input').is(':checked');
			case 'show_app_info':
				return this.$el.find('.show-app-info input').is(':checked');
			case 'show_trash_in_corner':
				return this.$el.find('.show-trash-in-corner input').is(':checked');
			case 'show_dialog_parallax_shift':
				return this.$el.find('.show-dialog-parallax-shift input').is(':checked');
		}
	},

	getValues: function() {
		return {
			show_app_name: this.getValue('show_app_name'),
			show_clock: this.getValue('show_clock'),
			show_app_info: this.getValue('show_app_info'),
			show_trash_in_corner: this.getValue('show_trash_in_corner'),
			show_dialog_parallax_shift: this.getValue('show_dialog_parallax_shift')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_app_name: this.model.get('show_app_name'),
			show_clock: this.model.get('show_clock'),
			show_app_info: this.model.get('show_app_info'),
			show_trash_in_corner: this.model.get('show_trash_in_corner'),
			show_dialog_parallax_shift: this.model.get('show_dialog_parallax_shift')
		};
	},

	//
	// event handling methods
	//

	onChangeShowAppName: function() {
		this.model.set('show_app_name', this.getValue('show_app_name'));
	},

	onChangeShowClock: function() {
		this.model.set('show_clock', this.getValue('show_clock'));
	},

	onChangeShowAppInfo: function() {
		this.model.set('show_app_info', this.getValue('show_app_info'));
	},

	onChangeShowTrashInCorner: function() {
		this.model.set('show_trash_in_corner', this.getValue('show_trash_in_corner'));
	},

	onChangeShowDialogParallaxShift: function() {
		this.model.set('show_dialog_parallax_shift', this.getValue('show_dialog_parallax_shift'));
	}
});