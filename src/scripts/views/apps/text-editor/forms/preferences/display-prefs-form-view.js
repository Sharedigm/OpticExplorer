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
	`),

	events: {
		'change .window-size select': 'onChangeWindowSize',
		'change .show-sidebar input': 'onChangeShowSideBar'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'window_size':
				return this.$el.find('.window-size select').val();		
			case 'show_sidebar':
				return this.$el.find('.show-sidebar input').is(':checked');
		}
	},

	getValues: function() {
		return {
			window_size: this.getValue('window_size'),
			show_sidebar: this.getValue('show_sidebar')
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
			case 'show_sidebar':
				this.$el.find('.show-sidebar input[type="checkbox"]').prop('checked', value);
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

	onChangeShowSideBar: function() {
		this.onChangeValue('show_sidebar', this.getValue('show_sidebar'));
	}
});
