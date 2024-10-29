/******************************************************************************\
|                                                                              |
|                           user-talents-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's talents info.                |
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
		<div class="skills form-group">
			<label class="control-label"><i class="fa fa-lightbulb"></i>Skills</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= skills? skills.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Skills" data-content="This is a list of things that you are skilled at."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="experiences form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Experiences</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= experiences? experiences.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Experiences" data-content="This is a list of things that you have experienced."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="goals form-group">
			<label class="control-label"><i class="fa fa-trophy"></i>Goals</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= goals? goals.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Goals" data-content="This is a list of goals that you are working towards."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// querying methods
	//

	hasValue: function(key) {
		switch (key) {
			case 'skills':
				return this.$el.find('.skills textarea').val() != '';
			case 'experiences':
				return this.$el.find('.experiences textarea').val() != '';
			case 'goals':
				return this.$el.find('.goals textarea').val() != '';
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		let value;

		switch (key) {
			case 'skills':
				value = this.hasValue('skills')? this.$el.find('.skills textarea').val() : undefined;
				break;
			case 'experiences':
				value = this.hasValue('experiences')? this.$el.find('.experiences textarea').val() : undefined;
				break;
			case 'goals':
				value = this.hasValue('goals')? this.$el.find('.goals textarea').val() : undefined;
				break;
		}

		if (value) {
			value = value.split(',').trim();
		}

		return value;
	},

	getValues: function() {
		return {
			skills: this.getValue('skills'),
			experiences: this.getValue('experiences'),
			goals: this.getValue('goals')
		};
	}
});