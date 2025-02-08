/******************************************************************************\
|                                                                              |
|                          school-extras-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's school.                      |
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
		<div class="sports form-group">
			<label class="control-label"><i class="fa fa-football-ball"></i>Sports</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= sports %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Sports" data-content="Sports that you participated in during your term at this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="clubs form-group">
			<label class="control-label"><i class="fa fa-users"></i>Clubs</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= clubs %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Clubs" data-content="Clubs that you participated in during your term at this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="activities form-group">
			<label class="control-label"><i class="fa fa-paper-plane"></i>Activities</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= activities %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Activities" data-content="Activities that you participated in during your term at this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="honors form-group">
			<label class="control-label"><i class="fa fa-trophy"></i>Honors</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= honors %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Honors" data-content="Honors that you received during your term at this school."></i>
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
			case 'sports':
				return this.$el.find('.sports input').val();
			case 'clubs':
				return this.$el.find('.clubs input').val();
			case 'activities':
				return this.$el.find('.activities input').val();
			case 'honors':
				return this.$el.find('.honors input').val();
		}
	},

	getValues: function() {
		return {
			sports: this.getValue('sports'),
			clubs: this.getValue('clubs'),
			activities: this.getValue('activities'),
			honors: this.getValue('honors')
		};
	}
});