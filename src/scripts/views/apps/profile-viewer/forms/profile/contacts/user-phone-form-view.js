/******************************************************************************\
|                                                                              |
|                            user-phone-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's phone number.               |
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
import '../../../../../../views/forms/validation/alphanumeric-rules.js';
import '../../../../../../views/forms/validation/telephonic-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="phone-kind form-group">
			<label class="control-label"><i class="fa fa-phone"></i>Kind</label>
			<div class="controls">
				<select>
					<option value="mobile"<% if (phone_kind == 'mobile') { %> selected<% } %>>Mobile</option>
					<option value="home"<% if (phone_kind == 'home') { %> selected<% } %>>Home</option>
					<option value="work"<% if (phone_kind == 'work') { %> selected<% } %>>Work</option>
				</select>
			</div>
		</div>
		
		<div class="phone-number form-group">
			<label class="control-label"><i class="fa fa-keyboard"></i>Number</label>
			<div class="controls">
				<div class="input-group" style="width:max-content">
					<input type="text" class="country-code form-control" size="2" value="<%= country_code %>">
		
					<span class="input-group-addon">(</span>
					<input type="text" class="area-code form-control" name="area-code" size="3" value="<%= area_code %>">
					<span class="input-group-addon">)</span>
		
					<input type="text" class="first-digits form-control" name="three-digits" size="3" value="<%= phone_number? phone_number.split('-')[0] : '' %>">
					<span class="input-group-addon">-</span>
					<input type="text" class="last-digits form-control" name="four-digits" size="4" value="<%= phone_number? phone_number.split('-')[1] : '' %>">
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Number" data-content="This is your phone number (country code, area code, and phone number)."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form attributes
	//

	rules: {
		'country-code': {
			numericOnly: true
		},
		'area-code': {
			required: false,
			numericOnly: true,
			areaCode: true
		},
		'three-digits': {
			required: true,
			numericOnly: true,
			threeDigits: true
		},
		'four-digits': {
			required: true,
			numericOnly: true,
			fourDigits: true
		},
		'phone-number': {
			numericOrDashesOnly: true,
			phoneNumber: true,
			ITUE164Format: true
		}
	},

	//
	// querying methods
	//

	isUnitedStates: function() {
		let countryCode = this.$el.find('.country-code').val();
		return countryCode == '1';
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'phone_kind':
				return this.$el.find('.phone-kind option:selected').val();
			case 'country_code':
				return this.$el.find('.phone-number .country-code').val();
			case 'area_code':
				return this.$el.find('.phone-number .area-code').val();
			case 'phone_number':
				return this.$el.find('.phone-number .first-digits').val() + '-' + this.$el.find('.phone-number .last-digits').val();
		}
	},

	getValues: function() {
		return {
			phone_kind: this.getValue('phone_kind'),
			country_code: this.getValue('country_code'),
			area_code: this.getValue('area_code'),
			phone_number: this.getValue('phone_number')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model
		};
	}
});