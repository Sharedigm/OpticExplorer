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

import FormView from '../../../../../../views/forms/form-view.js';
import CountrySelectorView from '../../../../../../views/forms/selectors/country-selector-view.js';
import DateUtils from '../../../../../../utilities/time/date-utils.js';

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
		
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>What</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="What" data-content="This is a description of your job."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="from-date form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>From date</label>
			<div class="controls">
				<div class="input-group">
					<input type="date" class="form-control" value="<%= from_date? from_date.format('yyyy-mm-dd') : '' %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="From date" data-content="This is your start date at this job."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="to-date form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>To date</label>
			<div class="controls">
				<div class="input-group">
					<input type="date" class="form-control" value="<%= to_date? to_date.format('yyyy-mm-dd') : '' %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="To date" data-content="This is your end date at this job."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="city form-group">
			<label class="control-label"><i class="fa fa-building"></i>City</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="city" placeholder="City" value="<%= city %>" />
					<span class="input-group-addon">,</span>
					<input type="text" class="form-control" name="state" placeholder="State" value="<%= state %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="City" data-content="The city, town, or village where you work."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="country form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Country</label>
			<div class="controls">
			</div>
		</div>
		
		<div class="achievements form-group">
			<label class="control-label"><i class="fa fa-star"></i>Achievements</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= achievements %></textarea>
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
					<textarea class="form-control" rows="4" maxlength="1000"><%= awards %></textarea>
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
					<textarea class="form-control" rows="4" maxlength="1000"><%= skills %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Skills" data-content="This is a description of the skills that you employed at this job."></i>
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
			case 'from_date':
				return this.$el.find('.from-date input').val() != '';
			case 'to_date':
				return this.$el.find('.to-date input').val() != '';
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// who
			//
			case 'company_name':
				return this.$el.find('.company-name input').val();
			case 'company_website':
				return this.$el.find('.company-website input').val();
			case 'division':
				return this.$el.find('.division input').val();

			// what
			//
			case 'title':
				return this.$el.find('.job-title input').val();
			case 'description':
				return this.$el.find('.description textarea').val();

			// when
			//
			case 'from_date':
				return this.$el.find('.from-date input').val();
			case 'to_date':
				return this.$el.find('.to-date input').val();

			// where
			//
			case 'city':
				return this.$el.find('.city [name="city"]').val();
			case 'state':
				return this.$el.find('.city [name="state"]').val();
			case 'country':
				return this.getChildView('country').getValue();

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

			// who
			//
			company_name: this.getValue('company_name'),
			company_website: this.getValue('company_website'),
			division: this.getValue('division'),

			// what
			//
			title: this.getValue('title'),
			description: this.getValue('description'),

			// when
			//
			from_date: this.hasValue('from_date')? DateUtils.parse(this.getValue('from_date'), 'yyyy-mm-dd') : null,
			to_date: this.hasValue('to_date')? DateUtils.parse(this.getValue('to_date'), 'yyyy-mm-dd') : null,

			// where
			//
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country'),
			
			// why / how
			//
			achievements: this.getValue('achievements'),
			awards: this.getValue('awards'),
			skills: this.getValue('skills')
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
	}
});