/******************************************************************************\
|                                                                              |
|                           job-actions-form-view.js                           |
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
		<div class="achievements form-group">
			<label class="control-label"><i class="fa fa-star"></i>Achievements</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="3" maxlength="1000"><%= achievements %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Kudos" data-content="This is a description of your achievements at this job."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="awards form-group">
			<label class="control-label"><i class="fa fa-trophy"></i>Awards</label>
			<div class="controls">
				<div class="input-group">			
					<textarea class="form-control" rows="3" maxlength="1000"><%= awards %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Awards" data-content="This is a description of awards that you received at this job."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="skills form-group">
			<label class="control-label"><i class="fa fa-rocket"></i>Skills</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="3" maxlength="1000"><%= skills %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Skills" data-content="This is a description of the skills that you employed at this job."></i>
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

			// why / how
			//
			case 'achievements':
				return this.$el.find('.achievements textarea').val();
			case 'awards':
				return this.$el.find('.awards textarea').val();
			case 'skills':
				return this.$el.find('.skills textarea').val();
		}
	},

	getValues: function() {
		return {
			
			// why / how
			//
			achievements: this.getValue('achievements'),
			awards: this.getValue('awards'),
			skills: this.getValue('skills')
		};
	}
});