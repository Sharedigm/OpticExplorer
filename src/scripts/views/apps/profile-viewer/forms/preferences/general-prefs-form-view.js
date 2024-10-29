/******************************************************************************\
|                                                                              |
|                           preferences-form-view.js                           |
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
		<div class="open-connections-in-new-window form-group">
			<label class="control-label"><i class="fa fa-folder-open"></i>Open Connections</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="open-folders" value="same-window"<% if (!open_connections_in_new_window) { %> checked<% } %>>Same Window</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="open-folders" value="new-window"<% if (open_connections_in_new_window) { %> checked<% } %>>New Window</label>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .open-connections-in-new-window input': 'onChangeOpenConnectionsInNewWindow'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'open_connections_in_new_window':
				return this.$el.find('.open-connections-in-new-window input:checked').val() == 'new-window';
		}
	},

	getValues: function() {
		return {
			open_connections_in_new_window: this.getValue('open_connections_in_new_window')
		};
	},

	//
	// event handling methods
	//

	onChangeOpenConnectionsInNewWindow: function() {
		this.onChangeValue('open_connections_in_new_window', this.getValue('open_connections_in_new_window'));
	}
});
