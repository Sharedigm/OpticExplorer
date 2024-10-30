/******************************************************************************\
|                                                                              |
|                     reflection-calculations-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for performing reflection calculations.           |
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
import SpectralLines from '../../../../../utilities/optics/spectral-lines.js';
import LightUtils from '../../../../../utilities/optics/light-utils.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="form-group" id="angle">
			<label class="control-label">Incidence</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" value="<%= angle.val() %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < angle_units.length; i++) { %>
							<option 
							<% if (!angle_units[i].contains('"')) { %>
							value="<%= angle_units[i] %>"
							<% } else { %>
							value='<%= angle_units[i] %>'
							<% } %>
							<% if (typeof angle != 'undefined' && angle.targetUnits == angle.units[i]) { %> selected<% } %>><%= angle_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Incidence" data-content="This is the angle of incidence between the light and the surface normal."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group" id="reflectance">
			<label class="control-label">Reflectance</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof reflectance != 'undefined') { %>
					<span class="value"><%= reflectance %></span> %
					<% } %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Reflectance" data-content="The is the reflectance of this material at the specified incidence and interface."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group external" id="brewsters-angle"<% if (interface == 'internal') { %> style="display:none"<% } %>>
			<label class="control-label">Brewster's angle</label>
			<div class="controls">
				<p class="form-control-static">
					<span class="value"><%= brewsters_angle.value %></span>
					<select class="units">
					<% for (let i = 0; i < angle_units.length; i++) { %>
						<option 
						<% if (!angle_units[i].contains('"')) { %>
						value="<%= angle_units[i] %>"
						<% } else { %>
						value='<%= angle_units[i] %>'
						<% } %>
						<% if (typeof angle != 'undefined' && angle.targetUnits == angle_units[i]) { %> selected<% } %>><%= angle_units[i] %></option>
					<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Brewster's Angle" data-content="This is the angle where reflected light will be linearly polarized."></i>
				</p>
			</div>
		</div>
		
		<div class="form-group internal" id="critical-angle"<% if (interface == 'external') { %> style="display:none"<% } %>>
			<label class="control-label">Critical angle</label>
			<div class="controls">
				<p class="form-control-static">
					<span class="value"><%= critical_angle.value %></span>
					<select class="units">
					<% for (let i = 0; i < angle_units.length; i++) { %>
						<option 
						<% if (!angle_units[i].contains('"')) { %>
						value="<%= angle_units[i] %>"
						<% } else { %>
						value='<%= application.units["angle"][i] %>'
						<% } %>
						<% if (typeof angle != 'undefined' && angle.targetUnits == angle_units[i]) { %> selected<% } %>><%= angle_units[i] %></option>
					<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Critical Angle" data-content="This is the angle at which total internal reflection occurs."></i>
				</p>
			</div>
		</div>
	`),

	events: {
		'change #angle input': 'onChangeAngle',
		'change #angle .units': 'onChangeAngleUnits',
		'change #brewsters-angle .units': 'onChangeBrewstersAngleUnits',
		'change #critical-angle .units': 'onChangeCriticalAngleUnits'
	},

	//
	// form attributes
	//

	angle: new Units(0, 'deg'),
	interface: 'external',
	reflectance: 0,
	brewsters_angle: 0,
	critical_angle: 0,

	//
	// querying methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'angle':
				return this.getUnits('#angle');
			case 'medium':
				return this.parent.getChildView('params').medium;
			case 'wavelength':
				return SpectralLines.sodium.D;
			case 'index_of_refraction':
				return this.model? this.model.getIndexOfRefraction(this.getValue('wavelength')) : 1;
			case 'polarization':
				return this.parent.getChildView('params').polarization;
			case 'reflectance':
				return this.getReflectance();
			case 'brewsters_angle':
				return this.getBrewstersAngle();
			case 'critical_angle':
				return this.getCriticalAngle();
		}
	},

	getReflectance: function() {
		let angle = this.getValue('angle').in('deg');
		let medium = this.getValue('medium');
		let wavelength = this.getValue('wavelength');
		let n1 = medium? medium.getIndexOfRefraction(wavelength) : 1;
		let n2 = this.getValue('index_of_refraction')
		let polarization = this.getValue('polarization');

		switch (this.interface) {
			case 'external':
				return LightUtils.fresnelReflectance(n1, n2, angle, polarization);
			case 'internal':
				return LightUtils.fresnelReflectance(n2, n1, angle, polarization);
		}
	},

	getBrewstersAngle: function() {
		if (!this.model) {
			return new Units(0, 'deg');
		}
		return new Units(this.model.getBrewstersAngle(this.medium, {
			wavelength: this.getValue('wavelength')
		}), 'deg');
	},

	getCriticalAngle: function() {
		if (!this.model) {
			return new Units(0, 'deg');
		}
		return new Units(this.model.getCriticalAngle(this.medium, {
			wavelength: this.getValue('wavelength')
		}), 'deg');
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'interface':
				this.setInterface(value);
				break;
			case 'reflectance':
				this.$el.find('#reflectance .value').text((value * 100).toPrecision(4));
				break;
			case 'brewsters_angle':
				this.setUnits('#brewsters-angle', value);
				break;
			case 'critical_angle':
				this.setUnits('#critical-angle', value);
				break;				
		}
	},

	setInterface: function(kind) {
		this.interface = kind;
		switch (kind) {
			case 'external':
				this.$el.find('.external').show();
				this.$el.find('.internal').hide();
				break;
			case 'internal':
				this.$el.find('.internal').show();
				this.$el.find('.external').hide();
				break;
		}
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			interface: this.interface,
			angle: this.angle,
			reflectance: this.reflectance * 100,
			brewsters_angle: this.brewsters_angle,
			critical_angle: this.critical_angle,
			angle_units: ['deg']
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// set attributes
		//
		this.reflectance = this.getReflectance();
		this.brewsters_angle = this.getBrewstersAngle();
		this.critical_angle = this.getCriticalAngle();

		// update form
		//
		this.setValue('reflectance', this.reflectance);
		this.setValue('brewsters_angle', this.brewsters_angle);
		this.setValue('critical_angle', this.critical_angle);

		// add math formatting
		//
		this.showMath();
	},

	showWavelength: function() {
		this.$el.find('#wavelength').show();
	},

	hideWavelength: function() {
		this.$el.find('#wavelength').hide();
	},

	showMath: function() {

		// add math formatting
		//
		MathJax.typeset();
	},

	update: function() {
		this.updateValue('reflectance');
		this.updateValue('brewsters_angle');
		this.updateValue('critical_angle');
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update view
		//
		this.update();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeAngle: function() {
		this.angle = this.getValue('angle');
		this.onChange();
	},

	onChangeAngleUnits: function(event) {
		this.angle = this.angle.as($(event.target).val());
		this.$el.find('#angle input').val(this.angle.val());
		this.onChange();
	},

	onChangeBrewstersAngleUnits: function(event) {

		// convert form units on change
		//
		this.brewsters_angle = this.brewsters_angle.as($(event.target).val());
		this.$el.find('#brewsters-angle .value').html(this.brewsters_angle.val());
	},

	onChangeCriticalAngleUnits: function(event) {

		// convert form units on change
		//
		this.critical_angle = this.critical_angle.as($(event.target).val());
		this.$el.find('#critical-angle .value').html(this.critical_angle.val());
	}
});