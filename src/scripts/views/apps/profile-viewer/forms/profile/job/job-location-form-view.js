/******************************************************************************\
|                                                                              |
|                           job-location-form-view.js                          |
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
		}
	},

	getValues: function() {
		return {

			// when
			//
			from_date: this.hasValue('from_date')? DateUtils.parse(this.getValue('from_date'), 'yyyy-mm-dd') : null,
			to_date: this.hasValue('to_date')? DateUtils.parse(this.getValue('to_date'), 'yyyy-mm-dd') : null,

			// where
			//
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country')
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