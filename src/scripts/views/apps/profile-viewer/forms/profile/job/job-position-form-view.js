/******************************************************************************\
|                                                                              |
|                          job-position-form-view.js                           |
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

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="job-title form-group">
			<label class="required control-label"><i class="fa fa-id-card"></i>Title</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= title %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Job title" data-content="This is your job title or position in the company."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="company-name form-group">
			<label class="control-label"><i class="fa fa-industry"></i>Company</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= company_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Company" data-content="This is the name of your company."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="division form-group">
			<label class="control-label"><i class="fa fa-sitemap"></i>Division</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= division %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Division" data-content="This is the division, department, or group that you are part of."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="company-website form-group">
			<label class="control-label"><i class="fa fa-cloud"></i>Website</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= company_website %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Website" data-content="This is the url of your company website."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'company_name':
				return this.$el.find('.company-name input').val();
			case 'division':
				return this.$el.find('.division input').val();
			case 'title':
				return this.$el.find('.job-title input').val();
			case 'company_website':
				return this.$el.find('.company-website input').val();
		}
	},

	getValues: function() {
		return {
			company_name: this.getValue('company_name'),
			division: this.getValue('division'),
			title: this.getValue('title'),
			company_website: this.getValue('company_website')
		};
	}
});