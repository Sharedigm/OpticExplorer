/******************************************************************************\
|                                                                              |
|                           user-address-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's address.                    |
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
		<div class="address-kind form-group">
			<label class="control-label"><i class="fa fa-home"></i>Kind</label>
			<div class="controls">
				<select>
					<option value="home"<% if (address_kind == 'home') { %> selected<% } %>>Home</option>
					<option value="work"<% if (address_kind == 'work') { %> selected<% } %>>Work</option>
				</select>
			</div>
		</div>
		
		<div class="street-address form-group">
			<label class="control-label"><i class="fa fa-road"></i>Address</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="street-address" value="<%= street_address %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Street address" data-content="The street address where you reside."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="apartment form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Apartment</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="apartment" value="<%= apartment %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Apartment" data-content="Additional information about your street address (building #, apartment #, etc.)"></i>
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
						<i class="active fa fa-question-circle" data-toggle="popover" title="City" data-content="The city, town, or village where you reside."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="postal-code form-group">
			<label class="control-label"><i class="fa fa-envelope"></i>Postal code</label>
			<div class="controls">
				<div class="postal-code input-group">
					<input type="text" class="form-control" size="11" maxlength="11" name="postal-code" value="<%= postal_code %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Postal code" data-content="The postal or 'zip' code where you reside."></i>
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
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'address_kind':
				return this.$el.find('.address-kind option:selected').val();
			case 'street_address':
				return this.$el.find('.street-address input').val();
			case 'apartment':
				return this.$el.find('.apartment input').val();
			case 'city':
				return this.$el.find('.city [name="city"]').val();
			case 'state':
				return this.$el.find('.city [name="state"]').val();
			case 'postal_code':
				return this.$el.find('.postal-code input').val();
			case 'country':
				return this.getChildView('country').getValue();
		}
	},

	getValues: function() {
		return {
			address_kind: this.getValue('address_kind'),
			street_address: this.getValue('street_address'),
			apartment: this.getValue('apartment'),
			city: this.getValue('city'),
			state: this.getValue('state'),
			postal_code: this.getValue('postal_code'),
			country: this.getValue('country')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model
		};
	},

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
			initialValue: this.model.getCountryName() || 'United States'
		}));
	}
});
