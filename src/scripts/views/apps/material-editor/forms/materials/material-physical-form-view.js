/******************************************************************************\
|                                                                              |
|                         material-physical-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying material physical attributes.      |
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

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="form-group" id="density">
			<label class="control-label">Density</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" name="density" class="form-control"<% if (typeof density != 'undefined') { %> value="<%= density.numerator.value %>"<% } %>>
					<div class="input-group-addon">
						<select class="numerator units">
						<% for (let i = 0; i < application.units['mass'].length; i++) { %>
							<option value="<%= application.units['mass'][i] %>"<% if (typeof density != 'undefined' && density.numerator.targetUnits == application.units['mass'][i]) { %> selected<% } %>><%= application.units['mass'][i] %></option>
						<% } %>
						</select>
						/
						<select class="denominator units">
						<% for (let i = 0; i < application.units['length'].length; i++) { %>
							<option value="<%= application.units['length'][i] + '^3' %>"<% if (typeof density != 'undefined' && density.denominator.targetUnits == application.units['length'][i] + '^3') { %> selected<% } %>><%= application.units['length'][i] + '^3' %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Density" data-content="The is the density of this particular material at standard temperature and pressure."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'input #density input': 'onChangeDensity',
		'change #density .numerator.units': 'onChangeDensityNumeratorUnits',
		'change #density .denominator.units': 'onChangeDensityDenominatorUnits'
	},
	
	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.density = this.model.get('density');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			density: this.density
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeDensity: function() {

		// set form value on change
		//
		this.density = this.getDensity();
		this.onChange();
	},

	onChangeDensityNumeratorUnits: function(event) {

		// convert form units on change
		//
		this.density.numerator.to($(event.target).val());
		this.$el.find('#density input').val(this.density.val());
		this.onChange();
	},

	onChangeDensityDenominatorUnits: function(event) {

		// convert form units on change
		//
		this.density.denominator.to($(event.target).val());
		this.$el.find('#density input').val(this.density.val());
		this.onChange();
	}
});