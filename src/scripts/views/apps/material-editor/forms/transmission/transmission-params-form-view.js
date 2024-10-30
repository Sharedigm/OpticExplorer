/******************************************************************************\
|                                                                              |
|                       transmission-params-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying transmission parameters.           |
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

	template: _.template(`	
		<div class="form-group" id="transmission">
			<label class="control-label">Transmission</label>
			<div class="controls">
				<label class="radio-inline">
					<input type="radio" id="absorption" name="transmission" value="absorption"<% if (transmission == 'absorption') {%> checked<% } %>>
					Absorption
				</label>
				<label class="radio-inline">
					<input type="radio" id="absorption-fresnel" name="transmission" value="absorption-fresnel"<% if (transmission == 'absorption-fresnel') {%> checked<% } %>>
					+ Fresnel
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Transmission" data-content="This determines how the transmission is computed."></i>
				</label>
			</div>
		</div>

		<div class="form-group" id="thickness">
			<label class="control-label">Thickness</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control" name="thickness"<% if (typeof thickness != 'undefined') { %> value="<%= thickness.val() %>"<% } %>>
					<div class="input-group-addon">
						<select class="units">
						<% for (let i = 0; i < length_units.length; i++) { %>
							<option value="<%= length_units[i] %>"<% if (typeof thickness != 'undefined' && thickness.targetUnits == length_units[i]) { %> selected<% } %>><%= length_units[i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Thickness" data-content="This is the thickness of the material."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'change #transmission input': 'onChangeTransmission',
		'change #thickness input': 'onChangeThickness',
		'change #thickness .units': 'onChangeThicknessUnits'
	},

	//
	// form attributes
	//

	transmission: 'absorption',
	thickness: new Units(10, 'mm'),

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'transmission':
				return this.$el.find('#transmission input:checked').val();
			case 'thickness':
				return this.getUnits('#thickness');
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			transmission: this.transmission,
			thickness: this.thickness,
			length_units: Units.units['length']
		};
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('transmission');
		}
	},

	onChangeTransmission: function() {
		this.transmission = this.getValue('transmission');
		this.onChange();
	},

	onChangeThickness: function() {

		// set form value on change
		//
		this.thickness = this.getValue('thickness');
		this.onChange();
	},

	onChangeThicknessUnits: function(event) {

		// convert form units on change
		//
		this.thickness = this.thickness.as($(event.target).val());
		this.$el.find('#thickness input').val(this.thickness.val());
		this.onChange();
	}
});