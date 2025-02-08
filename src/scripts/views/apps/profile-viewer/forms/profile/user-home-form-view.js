/******************************************************************************\
|                                                                              |
|                            user-home-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's home.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import CountrySelectorView from '../../../../../views/forms/selectors/country-selector-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="city form-group">
			<label class="required control-label"><i class="fa fa-building"></i>City</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="city" placeholder="City" value="<%= city %>" />
					<span class="input-group-addon">,</span>
					<input type="text" class="form-control" name="state" placeholder="State" value="<%= state %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="City" data-content="The city, town, or village where you reside."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="country form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Country</label>
			<div class="controls">
			</div>
		</div>
		
		<div class="years form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>When</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="from-year form-control" placeholder="first year" value="<%= from_year || '' %>" />
					<span class="input-group-addon">-</span>
					<input type="number" class="to-year form-control" placeholder="last year" value="<%= to_year %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the span of years when you lived at this location."></i>
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
			case 'city':
				return this.$el.find('.city [name="city"]').val();
			case 'state':
				return this.$el.find('.city [name="state"]').val();
			case 'country':
				return this.getChildView('country').getValue();
			case 'from_year':
				return parseInt(this.$el.find('.from-year').val());
			case 'to_year':
				return parseInt(this.$el.find('.to-year').val());
		}
	},

	getValues: function() {
		return {
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country'),
			from_year: this.getValue('from_year'),
			to_year: this.getValue('to_year')
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

		// show country selector
		//
		this.showChildView('country', new CountrySelectorView({
			initialValue: this.model.has('country')? this.model.get('country') : 'United States'
		}));

		// add country selector callback
		//
		this.getChildView('country').onclickmenuitem = () => {
			let country = this.getChildView('country').getSelected();
			let countryCode = country.get('phone_code');

			// set default phone country codes
			//
			this.$el.find('[name="country-code"]').val(countryCode);
		};
	}
});