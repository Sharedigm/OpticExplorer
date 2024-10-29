/******************************************************************************\
|                                                                              |
|                      user-general-profile-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's general profile info.        |
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
import DateUtils from '../../../../../../utilities/time/date-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="bio form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Bio</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="10" maxlength="1000"><%= bio %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Bio" data-content="Your bio is a personal statement about yourself that lets others know a bit about you, your values, and your personality."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="birth-date form-group">
			<label class="control-label"><i class="fa fa-birthday-cake"></i>Birthdate</label>
			<div class="controls">
				<div class="input-group">
					<input type="date" class="form-control" value="<%= birth_date? birth_date.format('yyyy-mm-dd') : '' %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Birthdate" data-content="This is your date of birth."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="gender form-group">
			<label class="control-label"><i class="fa fa-transgender"></i>Gender</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="gender" value="male"<% if (gender == 'male') {%> checked<% } %>>Male</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="gender" value="female"<% if (gender == 'female') {%> checked<% } %>>Female</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="gender" value="other"<% if (gender == 'other') {%> checked<% } %>>Other</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="gender" value=""<% if (!gender) {%> checked<% } %>>Unspecified</label>
				</div>
		
				<div class="radio-inline" style="display:none">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Gender" data-content="This is the gender that you are or identify with."></i>
				</div>
		
			</div>
		</div>
	`),

	//
	// querying methods
	//

	hasValue: function(key) {
		switch (key) {
			case 'bio':
				return this.$el.find('.bio textarea').val() != '';
			case 'birth_date':
				return this.$el.find('.birth-date input').val() != '';
			case 'gender':
				return this.$el.find('.gender input:checked').val() != '';
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'bio':
				return this.hasValue('bio')? this.$el.find('.bio textarea').val() : undefined;
			case 'birth_date':
				return this.hasValue('birth_date')? DateUtils.parse(this.$el.find('.birth-date input').val(), 'yyyy-mm-dd') : undefined;
			case 'gender':
				return this.hasValue('gender')? this.$el.find('.gender input:checked').val() : undefined;
		}
	},

	getValues: function() {
		return {
			bio: this.getValue('bio'),
			birth_date: this.getValue('birth_date'),
			gender: this.getValue('gender')
		};
	}
});