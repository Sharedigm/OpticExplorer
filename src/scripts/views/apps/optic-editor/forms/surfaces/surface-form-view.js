/******************************************************************************\
|                                                                              |
|                                surface-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying lens surface attributes.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Surface from '../../../../../models/optics/elements/surfaces/surface.js';
import Planar from '../../../../../models/optics/elements/surfaces/planar.js';
import Spherical from '../../../../../models/optics/elements/surfaces/spherical.js';
import FormView from '../../../../../views/forms/form-view.js';
import Units from '../../../../../utilities/math/units.js';
import '../../../../../views/forms/validation/alphanumeric-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="profile form-group">
			<label class="control-label">Profile</label>
			<div class="controls">
				<div class="controls">
					<select>
						<option value="spherical"<% if (profile == 'spherical') { %> selected <% } %>>Spherical</option>
						<option value="planar"<% if (profile == 'planar') { %> selected <% } %>>Planar</option>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Profile" data-content="This is the mathematical model to use to describe the shape of the lens's surface profile curve."></i>
				</div>
			</div>
		</div>

		<div class="curvature form-group"<% if (profile && profile != 'spherical') { %> style="display:none"<% } %>>
			<label class="required control-label">Curvature</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="curvature"<% if (profile == 'spherical' && radius_of_curvature) { %> value="<%= radius_of_curvature.toStr() %>"<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (radius_of_curvature && radius_of_curvature.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Curvature" data-content="This is the radius of curvature of the surface."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="diameter form-group">
			<label class="required control-label">Diameter</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="diameter" value="<%= diameter? diameter.toStr() : '' %>">
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (diameter && diameter.isIn(length_units[i])) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Diameter" data-content="This is the diameter of the surface."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="coating form-group">
			<label class="control-label">Coating</label>
			<div class="controls">
				<div class="controls">
					<select>
						<option value="none"<% if (!coating || coating == 'none') { %> selected<% } %>>None</option>
						<% for (i = 0; i < coatings.length; i++) { %>
						<option value="<%= coatings[i] %>"<% if (coatings[i] == coating) { %> selected<% } %>><%= coatings[i].toTitleCase() %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Coating" data-content="This is the type of coating applied to the surface."></i>
				</div>
			</div>
		</div>
	`),

	events: {
		'change .profile': 'onChangeProfile',
		'input .curvature input': 'onChangeCurvature',
		'change .curvature .units': 'onChangeCurvatureUnits',
		'input .diameter input': 'onChangeDiameter',
		'change .diameter .units': 'onChangeDiameterUnits',
		'change .coating input': 'onChangeCoating'
	},

	rules: {
		'curvature': {
			curvature: true,
			nonzero: true
		},
		'diameter': {
			diameter: true,
			positive: true,
			nonzero: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.profile = this.getSurfaceProfile(this.model);
		this.radius_of_curvature = this.model.get('radius_of_curvature');
		this.diameter = this.model.get('diameter');

		// add custom validation rules
		//
		this.addRules();
	},

	//
	// validation methods
	//

	addRules: function() {
		$.validator.addMethod('curvature', function (value, element) {
			let form = $(element).closest('form');
			let profile = form.find('.profile select').val();
			if (profile == 'planar') {
				return true;
			}

			// get curvature
			//
			let curvatureValue = parseFloat(value);
			let curvatureUnits = form.find('.curvature .units').val();

			// get diameter
			//
			let diameterValue = parseFloat(form.find('.diameter input').val());
			let diameterUnits = form.find('.diameter .units').val();

			// check curvature against diameter
			//
			if (diameterValue && curvatureValue) {
				let diameter = new Units(diameterValue, diameterUnits);
				let curvature = new Units(curvatureValue, curvatureUnits);
				return Math.abs(curvature.in(diameter.units)) >= diameter.value / 2;
			}
		}, 'The radius of curvature must be greater than or equal to half the diameter.');

		$.validator.addMethod('diameter', function (value, element) {
			let form = $(element).closest('form');
			let profile = form.find('.profile select').val();
			if (profile == 'planar') {
				return true;
			}

			let diameterValue = parseFloat(value);
			let diameterUnits = form.find('.diameter .units').val();

			// get curvature
			//
			let curvatureValue = parseFloat(form.find('.curvature input').val());
			let curvatureUnits = form.find('.curvature .units').val();

			// check diameter against curvature
			//
			if (diameterValue && curvatureValue) {
				let diameter = new Units(diameterValue, diameterUnits);
				let curvature = new Units(curvatureValue, curvatureUnits);
				return Math.abs(curvature.in(diameter.units)) >= diameter.value / 2;
			}
		}, 'The diameter must be greater than twice the radius of curvature.');
	},

	//
	// creating methods
	//

	createSurface: function(profile) {
		switch (profile) {
			case 'planar':
				return new Planar({
					diameter: this.diameter
				});
			case 'spherical':
				return new Spherical({
					diameter: this.diameter,
					radius_of_curvature: this.radius_of_curvature
				});
		}
	},

	//
	// getting methods
	//

	getSurfaceProfile: function(surface) {
		switch (surface.__proto__) {
			case Planar.prototype:
				return 'planar';
			case Spherical.prototype:
				return 'spherical'
		}
	},

	getElementView: function(element) {
		return this.options.viewport.getElementView(element);
	},

	//
	// form methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'profile':
				return this.$el.find('.profile select').val();
			case 'curvature': 
				return this.getUnits('.curvature');
			case 'diameter': 
				return this.getUnits('.diameter');
			case 'coating':
				return this.$el.find('.coating select').val();
		}
	},

	getValues: function() {
		return {
			profile: this.getValue('profile'),
			curvature: this.getValue('curvature'),
			diameter: this.getValue('diameter'),
			coating: this.getValue('coating')
		}
	},

	//
	// form methods
	//

	apply: function() {

		// check validation
		//
		if (!this.isValid()) {
			return false;
		}

		// check if profile changes
		//
		if (this.profile != this.getSurfaceProfile(this.model)) {
			this.changeProfileTo(this.profile);
		} else {

			// set model attributes
			//
			switch (this.profile) {
				case 'planar':
					this.model.set({
						diameter: this.diameter
					});
					break;
				case 'spherical':
					this.model.set({
						diameter: this.diameter,
						radius_of_curvature: this.radius_of_curvature
					});
					break;
			}
		}

		// apply coating
		//
		this.model.set({
			coating: this.getValue('coating')
		});

		return true;
	},

	changeProfileTo: function(profile) {
		let side = this.model.getSide();
		let element = this.model.parent;

		// update
		//
		this.model = this.createSurface(profile);

		// update parent
		//
		if (element) {
			element.setSurface(this.model, side);
		}

		// highlight changed surface
		//
		this.model.trigger('select');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			profile: this.profile,
			radius_of_curvature: this.model.get('radius_of_curvature'),
			diameter: this.model.get('diameter'),
			length_units: Units.units['length'],
			coating: this.model.get('coating'),
			coatings: Surface.coatings
		};
	},

	//
	// event handling methods
	//

	onChange: function() {

		// revalidate the form
		//
		this.validate();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeProfile: function() {

		// update form
		//
		this.profile = this.getValue('profile');
		switch (this.profile) {
			case 'planar':
				this.$el.find('.curvature').closest('.form-group').hide();
				break;
			case 'spherical':
				this.$el.find('.curvature').closest('.form-group').show();
				break;
		}
		this.onChange();
	},

	onChangeCurvature: function() {

		// set form value on change
		//
		this.radius_of_curvature = this.getValue('curvature');
		this.onChange();
	},

	onChangeCurvatureUnits: function(event) {

		// convert form units on change
		//
		this.radius_of_curvature = this.radius_of_curvature.as($(event.target).val());
		this.$el.find('.curvature input').val(this.radius_of_curvature.val());
		this.onChange();
	},

	onChangeDiameter: function() {

		// set form value on change
		//
		this.diameter = this.getValue('diameter');
		this.onChange();
	},

	onChangeDiameterUnits: function(event) {

		// convert form units on change
		//
		this.diameter = this.diameter.as($(event.target).val());
		this.$el.find('.diameter input').val(this.diameter.val());
		this.onChange();
	},

	onChangeCoating: function() {

		// convert form units on change
		//
		this.coating = this.getValue('coating');
		this.onChange();
	}
});