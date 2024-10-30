/******************************************************************************\
|                                                                              |
|                    transmission-calculations-form-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for performing transmission calculations.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//
	
	tagName: 'form',
	className: 'form-horizontal',

	template: _.template(`
		<div class="form-group" id="absorption">
			<label class="control-label">Absorption coeff</label>
			<div class="controls">
				<p class="form-control-static">
					<span class="value"><% if (typeof absorption != 'undefined') { %><%= absorption.val().toPrecision(10) %><% } %></span>
					<select class="units">
					<% for (let i = 0; i < length_units.length; i++) { %>
						<option value="<%= length_units[i] + '^-1' %>"<% if (typeof absorption.targetUnits != 'undefined' && absorption.targetUnits == length_units[i] + '^-1') { %> selected<% } %>><%= length_units[i] + '^-1' %></option>
					<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Absorption Coefficient" data-content="The is the amount by which light is attenuated per unit of material."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group" id="wavelength">
			<label class="control-label">Wavelength</label>
			<div class="controls">
				<select>
					<% let keys = Object.keys(wavelengths); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<option value="<%= key %>"<% if (wavelength == key) {%> selected<% }%>><%= key%> (<%= wavelengths[key] %>)</option>
					<% } %>
					<option value="other"<% if (typeof wavelength == 'undefined' && !keys.contains(wavelength)) {%> selected<% }%>>Other</option>
				</select>
				<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Spectral Line" data-content="This is a Fraunhofer spectral line which is a very specific wavelength / color of light that is emitted or absorbed by a particular element and excitation state."></i>
			</div>
		</div>
		
		<div class="form-group" id="other-wavelength" style="display:none">
			<label class="control-label"></label>
			<div class="controls">
				<div class="input-group">
					<input type="number" name="wavelength" class="form-control"<% if (typeof wavelength != 'undefined') { %> value="<%= wavelength.in(wavelength_units[0]) %>"<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < wavelength_units.length; i++) { %>
							<option value="<%= wavelength_units[i] %>"<% if (wavelength && wavelength.isIn(wavelength_units[i])) { %> selected<% } %>><%= wavelength_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Wavelength" data-content="The is the wavelength at which the index of refraction is specified."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group" id="transmission">
			<label class="control-label">Transmission</label>
			<div class="controls">
				<p class="form-control-static">
					<span class="value"><%= transmission %></span> %
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Transmission" data-content="This is the percentage of light that will be transmitted through the material."></i>
				</p>
			</div>
		</div>
	`),

	events: {
		'change #absorption .units': 'onChangeAbsorptionUnits',
		'change #wavelength select': 'onChangeWavelength',
		'input #other-wavelength input': 'onChangeOtherWavelength',
		'change #other-wavelength .units': 'onChangeWavelengthUnits',
	},

	rules: {
		'wavelength': {
			inrange: true
		}
	},

	//
	// form attributes
	//

	thickness: new Units(10, 'mm'),
	absorption: new Units(0, 'mm^-1'),
	transmission: 1,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.wavelength = this.options.wavelengths[Object.keys(this.options.wavelengths)[0]];

		// set material attributes 
		//
		if (this.model) {
			this.absorption = this.model.getAbsorption(this.thickness, this.wavelength, 'cm');
			this.transmission = this.model.getTransmission(this.thickness, this.wavelength);
		}
	},

	//
	// querying methods
	//

	wavelengthInRange: function(wavelength) {
		if (!this.model.has('k')) {
			return;
		}

		let k = this.model.get('k');
		let range = {
			min: new Units(k[0][0], 'um'),
			max: new Units(k[k.length - 1][0], 'um')
		}
	
		if (wavelength.value < range.min.as(wavelength.units).val()) {
			return false;
		} else if (wavelength.value > range.max.as(wavelength.units).val()) {
			return false;		
		} else {
			return true;
		}
	},
	
	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'absorption':
				return this.getValue('#absorption');
			case 'name':
				return this.$el.find('#wavelength select').val();
			case 'wavelength': {
				let name = this.getValue('name');
				if (name == 'other') {
					return this.getUnits('#other-wavelength');
				} else {
					return this.options.wavelengths[name];
				}
			}
			case 'index_of_refraction': {
				let wavelength = this.getValue('wavelength');
				return this.model? this.model.getIndexOfRefraction(wavelength) : undefined;
			}
		}
	},

	getAbsorption: function() {
		let value = this.$el.find('#absorption .value').html();
		let units = this.$el.find('#absorption .units').val();
		return new Units(value, units);
	},

	getTransmission: function(thickness, wavelength) {
		return this.model.getTransmission(thickness, wavelength);
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'index_of_refraction':
				this.$el.find('#index-of-refraction .value').text(value.toPrecision(6));
				break;
			case 'transmission':
				this.$el.find('#transmission .value').text((value * 100).toPrecision(4));
				break;
		}
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// attributes
			//
			transmission: (this.transmission * 100).toPrecision(4),
			absorption: this.absorption,
			wavelength: this.wavelength,
			thickness: this.thickness,

			// wavelengths
			//
			wavelengths: this.options.wavelengths,

			// units
			//
			length_units: Units.units['length'],
			wavelength_units: ['nm', 'um', 'mm']
		};
	},

	showOtherWavelength: function() {
		this.$el.find('#other-wavelength').show();
	},

	hideOtherWavelength: function() {
		this.$el.find('#other-wavelength').hide();
	},

	update: function() {

		// update absorption
		//
		this.absorption = this.model.getAbsorption(this.thickness, this.wavelength, this.absorption.baseUnits());
		this.$el.find('#absorption .value').html(this.absorption.val().toPrecision(10));

		// update transmission
		//
		if (this.thickness && !isNaN(this.thickness.value) &&
			this.wavelength && !isNaN(this.wavelength.value)) {
			this.transmission = this.getTransmission(this.thickness, this.wavelength);		
		} else {
			this.transmission = 1;
		}	
		this.setValue('transmission', this.transmission);
	},

	//
	// form validation methods
	//

	addRules: function() {
		$.validator.addMethod('inrange', (value) => {
			return this.wavelengthInRange(value);
		}, 'Wavelength out of range.');
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeAbsorptionUnits: function() {

		// convert form units on change
		//
		this.absorption = this.getAbsorption();
		this.update();
		this.onChange();
	},

	onChangeWavelength: function() {

		// show / hide wavelength
		//
		if (this.getValue('name') == 'other') {
			this.showOtherWavelength();

			// clear wavelength
			//
			this.$el.find('#wavelength input').val('');
			this.wavelength = undefined;
			this.update();
		} else {
			this.hideOtherWavelength();

			// get wavelength from spectral line
			//
			this.wavelength = this.getValue('wavelength');
			this.update();
		}

		this.onChange();
	},

	onChangeOtherWavelength: function() {

		// set form value on change
		//
		this.wavelength = this.getValue('wavelength');
		this.update();
		this.onChange();
	},

	onChangeWavelengthUnits: function(event) {

		// convert form units on change
		//
		this.wavelength = this.wavelength.as($(event.target).val());
		this.$el.find('#wavelength input').val(this.wavelength.val());
		this.onChange();
	}
});