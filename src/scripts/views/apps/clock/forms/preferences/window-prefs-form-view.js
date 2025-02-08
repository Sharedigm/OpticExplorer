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
		'change .maximized input': 'onChangeMaximized',
		'change .use-full-screen input': 'onChangeFullScreen'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'maximized':
				return this.$el.find('.maximized input').is(':checked');
			case 'full_screen':
				return this.$el.find('.use-full-screen input').is(':checked');
		}
	},

	getValues: function() {
		return {
			maximized: this.getValue('maximized'),
			full_screen: this.getValue('full_screen')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'maximized':
				this.$el.find('.maximized input').val(value);
				break;
			case 'full_screen':
				this.$el.find('.use-full-screen input').val(value);
				break;
		}
	},

	//
	// event handling methods
	//

	onChangeMaximized: function() {
		this.onChangeValue('maximized', this.getValue('maximized'));
	},

	onChangeFullScreen: function() {
		this.onChangeValue('full_screen', this.getValue('full_screen'));
	}
});