/******************************************************************************\
|                                                                              |
|                              data-sheet-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a material's data sheet.                       |
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
import SpectralLines from '../../../../../utilities/optics/spectral-lines.js';
import LightUtils from '../../../../../utilities/optics/light-utils.js';
import Units from '../../../../../utilities/math/units.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal data-sheet',

	template: template(`
		<div class="title"><%= name %> Data Sheet</div>

		<% if (description) { %>
		<p class="description"><%= description %></p>
		<% } %>

		<div class="panels">
			<div class="panel" id="characteristics">
				<div class="header">
					<label><i class="fa fa-info-circle"></i>Characteristics</label>
				</div>

				<div class="table">
					<div class="form-group" id="index-of-refraction">
						<label class="control-label">n<sub>d</sub></label>
						<div class="controls">
							<p class="form-control-static">
								<span class="value"><%= n_d || 'none' %></span>
								<i class="active fa fa-question-circle" data-toggle="popover" title="Index of Refraction" data-content="This is the index of refraction at the helium d line (587.56 nm)."></i>
							</p>
						</div>
					</div>

					<div class="form-group" id="index-of-refraction-e">
						<label class="control-label">n<sub>e</sub></label>
						<div class="controls">
							<p class="form-control-static">
								<span class="value"><%= n_e || 'none' %></span>
								<i class="active fa fa-question-circle" data-toggle="popover" title="Index of Refraction" data-content="This is the index of refraction at the mercury e line (546.07 nm)."></i>
							</p>
						</div>
					</div>

					<div class="form-group" id="abbe-number">
						<label class="control-label">v<sub>d</sub></label>
						<div class="controls">
							<p class="form-control-static">
								<span class="value"><%= v_d || 'none' %></span>
								<i class="active fa fa-question-circle" data-toggle="popover" title="Abbe Number" data-content="This is the Abbe number at the helium d line (587.56 nm)."></i>
							</p>
						</div>
					</div>

					<div class="form-group" id="abbe-number-e">
						<label class="control-label">v<sub>e</sub></label>
						<div class="controls">
							<p class="form-control-static">
								<span class="value"><%= v_e || 'none' %></span>
								<i class="active fa fa-question-circle" data-toggle="popover" title="Abbe Number" data-content="This is the Abbe number at the mercury e line (546.07 nm)."></i>
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="panel" id="specifications">
				<div class="header">
					<label><i class="fa fa-list"></i>Specifications</label>
				</div>

				<div class="form-group" id="glass-code">
					<label class="control-label">Glass Code</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= glass_code || 'none' %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Glass Code" data-content="A glass code is a method of classifying glasses for optical use."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="wavelength-min">
					<label class="control-label">&lambda; Min</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= wavelength_range && wavelength_range.min? wavelength_range.min.toString() : 'none' %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Wavelength Min" data-content="This is the minimum wavelength for which this glass model is valid."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="wavelength-max">
					<label class="control-label">&lambda; Max</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= wavelength_range && wavelength_range.max? wavelength_range.max.toString() : 'none' %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Wavelength Max" data-content="This is the maximum wavelength for which this glass model is valid."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="dispersion">
					<label class="control-label">dPgF</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= dpgf || 0 %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Partial Dispersion (dPfF)" data-content="This is a measure of the deviation of the partial dispersion along the perpendicular to the normal line."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="absorption">
					<label class="control-label">Absorption</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= absorption || 0 %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Absorption" data-content="This is the amount of absorption that occurs per unit distance as light traverses the material."></i>
						</p>
					</div>
				</div>
			</div>

			<% if (indices_of_refraction) { %>
			<div class="panel" id="refraction">
				<div class="header">
					<label><i class="fa fa-arrow-trend-down"></i>Refraction</label>
				</div>
				
				<% for (let i = 0; i < indices_of_refraction.length; i++) { %>
				<div class="form-group">
					<% let index = indices_of_refraction[i]; %>
					<label class="control-label" style="min-width:150px">
						<%= index.name %> (<%= index.wavelength.toString({ precision: 3 }) %>)
						<div class="tile" style="background-color:<%= index.color %>"></div>
					</label>
					<div class="controls" style="width:auto">
						<p class="form-control-static">
							<span class="value"><%= index.index_of_refraction? index.index_of_refraction.toPrecision(6) : undefined %></span>
						</p>
					</div>
				</div>
				<% } %>
			</div>
			<% } %>

			<div class="panel" id="physical">
				<div class="header">
					<label><i class="fa fa-cube"></i>Physical</label>
				</div>

				<div class="form-group" id="temperature">
					<label class="control-label">Temperature</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= temperature || '20.0 °C' %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Temperature" data-content="This is the temperature at which this material model is valid."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="density">
					<label class="control-label">Density</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= density || 'none' %></span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Density" data-content="This is the mass per unit volume of this material."></i>
						</p>
					</div>
				</div>

				<% if (thermal_expansion && thermal_expansion.min) { %>
				<div class="form-group" id="thermal-expansion">
					<label class="control-label">Thermal Expansion</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value">
								<%= thermal_expansion.min.coefficient %>
								at
								<%= thermal_expansion.min.temperature_range %>
							</span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Thermal Expansion" data-content="This is a measure of how much the material expands volumetrically with temperature."></i>
						</p>
					</div>
				</div>
				<% } %>

				<% if (thermal_expansion && thermal_expansion.max) { %>
				<div class="form-group" id="thermal-expansion">
					<label class="control-label">Thermal Expansion</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value">
								<%= thermal_expansion.max.coefficient %>
								at
								<%= thermal_expansion.max.temperature_range %>
							</span>
							<i class="active fa fa-question-circle" data-toggle="popover" title="Thermal Expansion" data-content="This is a measure of how much the material expands volumetrically with temperature."></i>
						</p>
					</div>
				</div>
				<% } %>
			</div>

			<div class="panel" id="environmental-resistance" style="display:none">
				<div class="header">
					<label><i class="fa fa-globe"></i>Environmental Resistance</label>
				</div>

				<div class="form-group" id="climatic-resistance">
					<label class="control-label">Climatic resistance</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= climatic_resistance %></span>
						</p>
					</div>
				</div>

				<div class="form-group" id="stain-resistance">
					<label class="control-label">Stain resistance</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= stain_resistance %></span>
						</p>
					</div>
				</div>

				<div class="form-group" id="acid-resistance">
					<label class="control-label">Acid resistance</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= acid_resistance %></span>
						</p>
					</div>
				</div>

				<div class="form-group" id="alkali-resistance">
					<label class="control-label">Alkali resistance</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= alkali_resistance %></span>
						</p>
					</div>
				</div>

				<div class="form-group" id="phosphate-resistance">
					<label class="control-label">Phosphate resistance</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"></span>
						</p>
					</div>
				</div>
			</div>

			<% if (critical_angle || brewsters_angle) { %>
			<div class="panel" id="angles">
				<div class="header">
					<label><i class="fa fa-arrow-rotate-right"></i>Angles</label>
				</div>

				<div class="form-group" id="critical-angle">
					<label class="control-label">Critical</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= critical_angle %></span>&deg;
							<i class="active fa fa-question-circle" data-toggle="popover" title="Critical Angle" data-content="This is the angle of incidence beyond which rays of light will undergo total internal reflection."></i>
						</p>
					</div>
				</div>

				<div class="form-group" id="brewsters-angle">
					<label class="control-label">Brewster's</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= brewsters_angle %></span>&deg;
							<i class="active fa fa-question-circle" data-toggle="popover" title="Brewster's Angle" data-content="Brewster's angle is an angle of incidence at which light with a particular polarization is perfectly transmitted through a transparent dielectric surface."></i>
						</p>
					</div>
				</div>
			</div>
			<% } %>

			<% if (reflectances) { %>
			<div class="panel" id="reflection">
				<div class="header">
					<label><i class="fa fa-right-left"></i>Reflection</label>
				</div>

				<div class="table">
					<% for (let i = 0; i < reflectances.length; i++) { %>
					<div class="form-group">
						<label class="control-label"><%= reflectances[i].angle.toStr() %> &deg</label>
						<div class="controls">
							<p class="form-control-static">
								<span class="value">
									<% if (reflectances[i].reflectance) { %>
									<%= (reflectances[i].reflectance * 100).toPrecision(3) + '%' %>
									<% } %>
								</span>
							</p>
						</div>
					</div>
					<% } %>
				</div>
			</div>
			<% } %>

			<% if (transmissions) { %>
			<div class="panel" id="transmission">
				<div class="header">
					<label><i class="fa fa-arrows-up-to-line rotated"></i>Transmission</label>
				</div>

				<% for (let i = 0; i < transmissions.length; i++) { %>
				<div class="form-group">
					<% let transmission = transmissions[i]; %>
					<label class="control-label" style="min-width:150px">
						<%= transmission.name %> (<%= transmission.wavelength.toString({ precision: 3 }) %>)
						<div class="tile" style="background-color:<%= transmission.color %>"></div>
					</label>
					<div class="controls" style="width:auto">
						<p class="form-control-static">
							<span class="value"><%= transmission.transmission? ((transmission.transmission * 100).toPrecision(3) + '%') : undefined %></span>
						</p>
					</div>
				</div>
				<% } %>
			</div>
			<% } %>

			<div class="panel" id="notes">
				<div class="header">
					<label><i class="fa fa-pencil"></i>Notes</label>
				</div>

				<div class="form-group" id="references">
					<label class="control-label">References</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= references || 'none' %></span>
						</p>
					</div>
				</div>

				<div class="form-group" id="comments">
					<label class="control-label">Comments</label>
					<div class="controls">
						<p class="form-control-static">
							<span class="value"><%= comments || 'none' %></span>
						</p>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getReflectances: function(steps) {
		let reflectances = [];
		for (let i = 0; i < steps; i++) {
			let angle = new Units(90 * i / (steps - 1), 'deg');
			let reflectance = this.model? this.model.getReflectance(angle) : undefined;
			reflectances.push({
				angle: angle,
				reflectance: reflectance
			});
		}
		return reflectances;
	},

	getIndicesOfRefraction: function(wavelengths) {
		let indices = [];
		let keys = Object.keys(wavelengths);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let wavelength = wavelengths[key];
			let index = this.model? this.model.getIndexOfRefraction(wavelength) : undefined;
			indices.push({
				name: key,
				wavelength: wavelength,
				color: LightUtils.wavelengthToColor(wavelength),
				index_of_refraction: index
			});
		}
		return indices;
	},

	getTransmissions: function(wavelengths, thickness) {
		let transmissions = [];
		let keys = Object.keys(wavelengths);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let wavelength = wavelengths[key];
			let transmission = this.model? this.model.getTransmission(thickness, wavelength) : undefined;
			transmissions.push({
				name: key,
				wavelength: wavelength,
				color: LightUtils.wavelengthToColor(wavelength),
				transmission: transmission
			});
		}
		return transmissions;
	},

	getShortened: function(string) {
		if (!string) {
			return;
		}
		string = string.replace('>http://', '>');
		return string;
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'selected':
				this.options.selected = value;
				if (value) {
					this.setSelected(value);
				}
				break;
		}
	},

	setActive: function(active) {
		if (active) {
			this.render();
		}
	},

	setPanelVisibility: function() {
		if (!this.model) {
			return;
		}

		if (this.model.isReflective()) {
			this.$el.find('#reflection').show();
		} else {
			this.$el.find('#reflection').hide();
		}

		if (this.model.isTransmissive()) {
			this.$el.find('#transmission').show();
		} else {
			this.$el.find('#transmission').hide();
		}
	},

	setWavelengthsSelected: function(selector, selected) {
		let formGroups = this.$el.find(selector + ' .form-group');
		for (let i = 0; i < selected.length; i++) {
			let formGroup = $(formGroups[i]);
			if (selected[i].checked) {
				formGroup.show();
			} else {
				formGroup.hide();
			}
		}
	},

	setSelected: function(selected) {
		this.setWavelengthsSelected('#refraction', selected);
		this.setWavelengthsSelected('#transmission', selected);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,
			name: this.model.getName(),
			description: this.model.get('description'),

			// characteristics
			//
			n_d: this.model.getIndexOfRefraction(SpectralLines.helium.d).toPrecision(6),
			v_d: this.model.getAbbeNumber(Material.abbeWavelengths.d).toPrecision(6),
			n_e: this.model.getIndexOfRefraction(SpectralLines.mercury.e).toPrecision(6),
			v_e: this.model.getAbbeNumber(Material.abbeWavelengths.e).toPrecision(6),

			// specifications
			//
			wavelength_range: this.model.has('wavelength_range')? this.model.get('wavelength_range') : undefined,
			critical_angle: this.model.getCriticalAngle().toPrecision(4),
			brewsters_angle: this.model.getBrewstersAngle().toPrecision(4),
			glass_code: this.model.getGlassCode(),
			glass_status: this.model.get('glass_status'),
			dpgf: this.model.get('dpgf'),
			reflectances: this.getReflectances(10),
			indices_of_refraction: this.getIndicesOfRefraction(this.options.wavelengths),
			transmissions: this.getTransmissions(this.options.wavelengths, new Units(10, 'cm')),
			absorption: this.model.getAbsorption(new Units(1, 'cm'), SpectralLines.helium.d, 'cm').toString({ precision: 4}),

			// physical
			//
			temperature: this.model.get('temperature'),
			density: this.model.get('density'),
			thermal_expansion: this.model.get('thermal_expansion'),

			// environmental
			//
			climatic_resistance: this.model.get('climatic_resistance'),
			stain_resistance: this.model.get('stain_resistance'),
			acid_resistance: this.model.get('acid_resistance'),
			alkali_resistance: this.model.get('alkali_resistance'),
			phosphate_resistance: this.model.get('phosphate_resistance'),

			// metadata
			//
			references: this.getShortened(this.model.get('references')),
			comments: this.model.get('comments')
		}
	},

	onRender: function() {
		this.setPanelVisibility();

		// add popover triggers
		//
		this.addPopovers();
	},

	update: function() {
		this.render();
	}
});