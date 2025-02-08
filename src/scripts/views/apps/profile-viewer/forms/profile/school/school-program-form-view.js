/******************************************************************************\
|                                                                              |
|                         school-program-form-view.js                          |
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
		<div class="degree form-group">
			<label class="control-label"><i class="fa fa-graduation-cap"></i>Degree</label>
			<div class="controls">
				<select>
					<option value="none"<% if (degree == 'none') { %> selected<% } %>>None</option>
					<option value="primary"<% if (degree == 'primary') { %> selected<% } %>>Primary / Elementary School</option>
					<option value="middle"<% if (degree == 'middle') { %> selected<% } %>>Middle School</option>
					<option value="secondary"<% if (!degree || degree == 'secondary') { %> selected<% } %>>Secondary / High School</option>
					<optgroup label="Bachelor">
						<option value="B.A."<% if (degree == 'B.A.') { %> selected<% } %>>Bachelor of Arts (B.A.)</option>
						<option value="B.S."<% if (degree == 'B.S.') { %> selected<% } %>>Bachelor of Science (B.S.)</option>
						<option value="B.F.A."<% if (degree == 'B.F.A.') { %> selected<% } %>>Bachelor of Science (B.F.A.)</option>
						<option value="B.A.S."<% if (degree == 'B.A.S.') { %> selected<% } %>>Bachelor of Applied Science (B.A.S.)</option>
					</optgroup>
					<optgroup label="Master">
						<option value="M.A."<% if (degree == 'M.A.') { %> selected<% } %>>Master of Arts (M.A.)</option>
						<option value="M.S."<% if (degree == 'M.S.') { %> selected<% } %>>Master of Science (M.S.)</option>
						<option value="M.B.A."<% if (degree == 'M.B.A.') { %> selected<% } %>>Master of Business Admin (M.B.A.)</option>
						<option value="M.F.A."<% if (degree == 'M.F.A.') { %> selected<% } %>>Master of Fine Arts (M.F.A.)</option>
					</optgroup>
					<optgroup label="Doctoral">
						<option value="Ph.D."<% if (degree == 'Ph.D.') { %> selected<% } %>>Doctor of Philosophy (Ph.D.)</option>
						<option value="J.D."<% if (degree == 'J.D.') { %> selected<% } %>>Juris Doctor (J.D.)</option>
						<option value="M.D."<% if (degree == 'M.D.') { %> selected<% } %>>Doctor of Medicine (M.D.)</option>
						<option value="D.D.S."<% if (degree == 'D.D.S.') { %> selected<% } %>>Doctor of Dental Surgery (D.D.S.)</option>
					</optgroup>
				</select>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Degree" data-content="This is the type of degree that you received at this school."></i>
			</div>
		</div>

		<div class="grade-levels form-group"<% if (degree || degree != 'none') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-bars"></i>Grade level</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="from-grade-level form-control" placeholder="starting grade" value="<%= from_grade_level != 0? from_grade_level : undefined %>" />
					<span class="input-group-addon">-</span>
					<input type="number" class="to-grade-level form-control" placeholder="ending grade" value="<%= to_grade_level != 0? to_grade_level : undefined %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Grade level" data-content="This is the span of grade levels of your term at this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="years form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>When</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="from-year form-control" placeholder="first year" value="<%= from_year %>" />
					<span class="input-group-addon">-</span>
					<input type="number" class="to-year form-control" placeholder="last year" value="<%= to_year %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the span of years when you attended this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="major form-group">
			<label class="control-label"><i class="fa fa-certificate"></i>Major</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= major_subject %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Subject" data-content="This is the major subject of study from your term at this school."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="minor form-group">
			<label class="control-label"><i class="fa fa-certificate"></i>Minor</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= minor_subject %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Subject" data-content="This is the minor subject of study from your term at this school."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormView.prototype.events, {
		'change .degree select': 'onChangeDegree'
	}),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'degree':
				return this.$el.find('.degree select option:selected').val();
			case 'from_grade_level':
				return parseInt(this.$el.find('.from-grade-level').val());
			case 'to_grade_level':
				return parseInt(this.$el.find('.to-grade-level').val());
			case 'from_year':
				return parseInt(this.$el.find('.from-year').val());
			case 'to_year':
				return parseInt(this.$el.find('.to-year').val());
			case 'major_subject':
				return this.$el.find('.major input').val();
			case 'minor_subject':
				return this.$el.find('.minor input').val();
		}
	},

	getValues: function() {
		return {
			degree: this.getValue('degree'),
			from_grade_level: this.getValue('from_grade_level'),
			to_grade_level: this.getValue('to_grade_level'),
			from_year: this.getValue('from_year'),
			to_year: this.getValue('to_year'),
			major_subject: this.getValue('major_subject'),
			minor_subject: this.getValue('minor_subject')
		};
	},

	//
	// event handling methods
	//

	onChangeDegree: function() {
		let degree = this.$el.find('.degree select option:selected').val();
		if (degree != 'N.A.' && degree != 'none') {
			this.$el.find('.grade-levels').hide();
		} else {
			this.$el.find('.grade-levels').show();
		}
	}
});