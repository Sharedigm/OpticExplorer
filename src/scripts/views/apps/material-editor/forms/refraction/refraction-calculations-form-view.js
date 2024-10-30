/******************************************************************************\
|                                                                              |
|                     refraction-calculations-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for performing refraction calculations.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import Material from '../../../../../models/optics/materials/material.js';
import FormView from '../../../../../views/forms/form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
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
		
		<div class="form-group" id="index-of-refraction">
			<label class="control-label">Refraction (n)</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof indexOfRefraction != 'undefined') { %>
					<span class="value"><%= indexOfRefraction %></span>
					<% } %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Index of Refraction" data-content="The is the refractive index of this material at the specified spectral line."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group" id="abbe-number_d">
			<label class="control-label">Abbe # (V<sub>d</sub>)</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof abbeNumberD != 'undefined') { %>
					<%= abbeNumberD %>
					<% } %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Abbe Number" data-content="The is the Abbe number (refractive dispersion) of this material at the sodium D line."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group" id="abbe-number_e">
			<label class="control-label">Abbe # (V<sub>e</sub>)</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof abbeNumberE != 'undefined') { %>
					<%= abbeNumberE %>
					<% } %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Abbe Number" data-content="The is the Abbe number (refractive dispersion) of this material at the Mercury e line."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group" id="glass-code">
			<label class="control-label">Glass code</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof glassCode != 'undefined') { %>
					<%= glassCode %>
					<% } %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Glass Code" data-content="The is the glass code (MIL-G-174) of this material."></i>
				</p>
			</div>
		</div>
	`),

	events: {
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
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.wavelength = this.options.wavelengths[Object.keys(this.options.wavelengths)[0]];
		this.indexOfRefraction = this.model? this.model.getIndexOfRefraction(this.wavelength) : 1;
	},
	
	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
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

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'index_of_refraction':
				this.$el.find('#index-of-refraction .value').text(value.toPrecision(6));
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
			wavelength: this.wavelength,
			indexOfRefraction: this.indexOfRefraction? this.indexOfRefraction.toPrecision(6) : 1,
			glassCode: this.model? this.model.getGlassCode() : 0,

			// wavelengths
			//
			wavelengths: this.options.wavelengths,
			abbeNumberD: this.model? this.model.getAbbeNumber(Material.abbeWavelengths.D).toPrecision(6) : 0,
			abbeNumberE: this.model? this.model.getAbbeNumber(Material.abbeWavelengths.e).toPrecision(6) : 0,

			// units
			//
			length_units: Units.units['length'],
			wavelength_units: ['nm', 'um', 'mm']
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);
	},

	showOtherWavelength: function() {
		this.$el.find('#other-wavelength').show();
	},

	hideOtherWavelength: function() {
		this.$el.find('#other-wavelength').hide();
	},

	update: function() {
		this.updateValue('index_of_refraction');	
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