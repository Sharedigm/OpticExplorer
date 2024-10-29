/******************************************************************************\
|                                                                              |
|                           user-school-form-view.js                           |
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
import CountrySelectorView from '../../../../../../views/forms/selectors/country-selector-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<fieldset>
			<legend>School</legend>
		
			<div class="school-name form-group">
				<label class="required control-label"><i class="fa fa-university"></i>School</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" value="<%= school_name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="School" data-content="This is the name of your school."></i>
						</div>
					</div>
				</div>
			</div>
		
			<div class="school-website form-group">
				<label class="control-label"><i class="fa fa-cloud"></i>Website</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="form-control" value="<%= school_website %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Website" data-content="This is the url of your school website."></i>
						</div>
					</div>
				</div>
			</div>
		
			<div class="city form-group">
				<label class="control-label"><i class="fa fa-building"></i>City</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="name form-control" placeholder="City" value="<%= city %>" />
						<span class="input-group-addon">,</span>
						<input type="text" class="state form-control" placeholder="State" value="<%= state %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="City" data-content="The city, town, or village where you went to school."></i>
						</div>
					</div>
				</div>
			</div>
		
			<div class="country form-group">
				<label class="control-label"><i class="fa fa-globe-americas"></i>Country</label>
				<div class="controls">
				</div>
			</div>
		</fieldset>
		
		<fieldset>
			<legend>Program</legend>
		
			<div class="degree form-group">
				<label class="control-label"><i class="fa fa-graduation-cap"></i>Degree</label>
				<div class="controls">
					<select>
						<option value="N.A."<% if (!degree) { %> selected<% } %>>N.A.</option>
						<option value="none"<% if (degree == 'none') { %> selected<% } %>>None</option>
						<option value="primary"<% if (degree == 'primary') { %> selected<% } %>>Primary School</option>
						<option value="middle"<% if (degree == 'middle') { %> selected<% } %>>Middle School</option>
						<option value="secondary"<% if (degree == 'secondary') { %> selected<% } %>>Secondary School</option>
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
		
			<div class="grade-levels form-group"<% if (degree) { %> style="display:none"<% } %>>
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
		
			<div class="subject form-group">
				<label class="control-label"><i class="fa fa-certificate"></i>Subject</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="major-subject form-control" placeholder="major" value="<%= major_subject %>" />
						<span class="input-group-addon">/</span>
						<input type="text" class="minor-subject form-control" placeholder="minor" value="<%= minor_subject %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Subject" data-content="This is the subject of study from your term at this school."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
		
		<fieldset>
			<legend>Extra</legend>
		
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
		</fieldset>
	`),

	regions: {
		country: '.country .controls'
	},

	events: _.extend({}, FormView.prototype.events, {
		'change .degree select': 'onChangeDegree'
	}),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'school_name':
				return this.$el.find('.school-name input').val();
			case 'school_website':
				return this.$el.find('.school-website input').val();
			case 'city':
				return this.$el.find('.city .name').val();
			case 'state':
				return this.$el.find('.city .state').val();
			case 'country':
				return this.getChildView('country').getValue();
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
				return this.$el.find('.major-subject').val();
			case 'minor_subject':
				return this.$el.find('.minor-subject').val();
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
			school_name: this.getValue('school_name'),
			school_website: this.getValue('school_website'),
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country'),
			degree: this.getValue('degree'),
			from_grade_level: this.getValue('from_grade_level'),
			to_grade_level: this.getValue('to_grade_level'),
			from_year: this.getValue('from_year'),
			to_year: this.getValue('to_year'),
			major_subject: this.getValue('major_subject'),
			minor_subject: this.getValue('minor_subject'),
			sports: this.getValue('sports'),
			clubs: this.getValue('clubs'),
			activities: this.getValue('activities'),
			honors: this.getValue('honors')
		};
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showCountrySelector();
	},

	showCountrySelector: function() {
		this.showChildView('country', new CountrySelectorView({
			initialValue: this.model.has('country')? this.model.get('country') : 'United States'
		}));
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