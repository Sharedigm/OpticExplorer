/******************************************************************************\
|                                                                              |
|                             user-job-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's job.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="job-title form-group">
			<label class="control-label"><i class="fa fa-id-card"></i>Title</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= title %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Job title" data-content="This is your job title or role in the company or organization."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="company-name form-group">
			<label class="control-label"><i class="fa fa-university"></i>Organization</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= company_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Organiation" data-content="This is the name of your company or organization."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		country: '.country .controls'
	},

	//
	// querying methods
	//

	hasValue: function(key) {
		switch (key) {
			case 'title':
				return this.$el.find('.job-title input').val() != '';
			case 'company_name':
				return this.$el.find('.company-name input').val() != '';
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'title':
				return this.$el.find('.job-title input').val();
			case 'company_name':
				return this.$el.find('.company-name input').val();
		}
	},

	getValues: function() {
		return {
			title: this.getValue('title'),
			company_name: this.getValue('company_name')
		};
	}
});