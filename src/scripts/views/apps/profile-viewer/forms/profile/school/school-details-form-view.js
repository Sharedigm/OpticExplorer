/******************************************************************************\
|                                                                              |
|                         school-details-form-view.js                          |
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
	`),

	regions: {
		country: '.country .controls'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'school_name':
				return this.$el.find('.school-name input').val();
			case 'city':
				return this.$el.find('.city .name').val();
			case 'state':
				return this.$el.find('.city .state').val();
			case 'country':
				return this.getChildView('country').getValue();
			case 'school_website':
				return this.$el.find('.school-website input').val();
		}
	},

	getValues: function() {
		return {
			school_name: this.getValue('school_name'),
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country'),
			school_website: this.getValue('school_website')
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