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
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="tasks-per-page form-group">
			<label class="control-label"><i class="fa fa-long-arrow-alt-down"></i>Task / Page</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Tasks / Page" data-content="This is the number of tasks to display per page."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		projects: {
			el: '.selector',
			replaceElement: true
		},
		tasks_per_page: '.tasks-per-page .range-input'
	},

	events: {
		'change .tasks-per-page input': 'onChangeOption'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'tasks_per_page':
				return Math.round(this.getChildView('tasks_per_page').getValue());
		}
	},

	getValues: function() {
		return {
			tasks_per_page: this.getValue('tasks_per_page')
		};
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showRegion('tasks_per_page');
	},

	showRegion: function(name) {
		switch (name) {
			case 'tasks_per_page':
				this.showTasksPerPage();
				break;
		}
	},

	showTasksPerPage: function() {
		this.showChildView('tasks_per_page', new RangeInputView({

			// options
			//
			value: this.model.get('tasks_per_page'),
			min: 1,
			max: 100,
			step: 1,
			scale: 'logarithmic'
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeOption: function(event) {
		let className = $(event.target).closest('.form-group').attr('class');
		let option = className.replace('form-group', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);	
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});
