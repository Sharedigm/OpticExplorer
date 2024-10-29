/******************************************************************************\
|                                                                              |
|                           general-prefs-form-view.js                         |
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

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="view-kind form-group">
			<label class="control-label"><i class="fa fa-eye"></i>View</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="view-kind" value="month">Month</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="view-kind" value="day">Day</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Mode" data-content="This is the view mode that the calendar is in."></i>
			</div>
		</div>
	`),

	events: {
		'click .view-kind input': 'onClickViewKind',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'view_kind':
				return this.$el.find('.view-kind input:checked').val();
		}
	},

	getValues: function() {
		return {
			view_kind: this.getValue('view_kind'),
		};
	},

	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'view_kind':
				this.$el.find('.view-kind input[value="' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// mouse event handling methods
	//

	onClickViewKind: function() {
		this.onChangeValue('view_kind', this.getValue('view_kind'));
	}
});
