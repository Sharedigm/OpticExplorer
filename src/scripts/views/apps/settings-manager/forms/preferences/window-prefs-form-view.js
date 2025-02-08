/******************************************************************************\
|                                                                              |
|                          window-prefs-form-view.js                           |
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
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="window-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt"></i>Window Size</label>
			<div class="controls">
				<select>
					<% let keys = Object.keys(sizes); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let width = sizes[key][0]; %>
					<% let height = sizes[key][1]; %>
					<option value="<%= key %>"<% if (window_size == key) { %> selected<% } %>><%= key.toTitleCase() %> (<%= width %>x<%= height %>)</option>
					<% } %>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Window Size" data-content="This is the maximum initial size of the application window."></i>
			</div>
		</div>

		<div class="window-state form-group">
			<label class="control-label"><i class="fa fa-window-maximize"></i>Window State</label>
			<div class="controls">
				<div class="maximized checkbox-inline">
					<label><input type="checkbox"<% if (maximized) { %> checked<% } %>>Maximized</label>
				</div>

				<div class="use-full-screen checkbox-inline">
					<label><input type="checkbox"<% if (full_screen) { %> checked<% } %>>Full Screen</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Window State" data-content="This is the initial state of the application window."></i>
			</div>
		</div>
	`),

	events: {
		'change .window-size select': 'onChangeWindowSize',
		'change .maximized input': 'onChangeMaximized',
		'change .use-full-screen input': 'onChangeFullScreen'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'window_size':
				return this.$el.find('.window-size select').val();
			case 'maximized':
				return this.$el.find('.maximized input').is(':checked');
			case 'full_screen':
				return this.$el.find('.use-full-screen input').is(':checked');
		}
	},

	getValues: function() {
		return {
			window_size: this.getValue('window_size'),
			maximized: this.getValue('maximized'),
			full_screen: this.getValue('full_screen')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'window_size':
				this.$el.find('.window-size select').val(value);
				break;
			case 'maximized':
				this.$el.find('.maximized input').val(value);
				break;
			case 'full_screen':
				this.$el.find('.use-full-screen input').val(value);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			sizes: config.defaults.dialogs.sizes
		};
	},

	//
	// event handling methods
	//

	onChangeWindowSize: function() {
		this.onChangeValue('window_size', this.getValue('window_size'));
	},

	onChangeMaximized: function() {
		this.onChangeValue('maximized', this.getValue('maximized'));
	},

	onChangeFullScreen: function() {
		this.onChangeValue('full_screen', this.getValue('full_screen'));
	}
});