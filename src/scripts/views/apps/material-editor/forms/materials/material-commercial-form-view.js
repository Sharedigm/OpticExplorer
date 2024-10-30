/******************************************************************************\
|                                                                              |
|                        material-commercial-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying material commercial attributes.    |
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
		<div class="form-group" id="cost">
			<label class="control-label">Cost</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" name="cost" class="form-control"<% if (typeof cost != 'undefined') { %> value="<%= cost.numerator.value %>"<% } %>>
					<div class="input-group-addon">
						<select class="numerator units">
						<% for (let i = 0; i < application.units['currency'].length; i++) { %>
							<option value="<%= application.units['currency'][i] %>"<% if (typeof cost != 'undefined' && cost.numerator.targetUnits == application.units['currency'][i]) { %> selected<% } %>><%= application.units['currency'][i] %></option>
						<% } %>
						</select>
						/
						<select class="denominator units">
						<% for (let i = 0; i < application.units['mass'].length; i++) { %>
							<option value="<%= application.units['mass'][i] %>"<% if (typeof cost != 'undefined' && cost.denominator.targetUnits == application.units['mass'][i]) { %> selected<% } %>><%= application.units['mass'][i] %></option>
						<% } %>
						</select>
					</div>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Cost" data-content="The is the unit cost of this material."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'input #cost input': 'onChangeCost',
		'change #cost .numerator.units': 'onChangeCostNumeratorUnits',
		'change #cost .denominator.units': 'onChangeCostDenominatorUnits'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.cost = this.model.get('cost');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			cost: this.cost
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

	onChangeCost: function() {

		// set form value on change
		//
		this.cost = this.getCost();
		this.onChange();
	},

	onChangeCostNumeratorUnits: function(event) {

		// convert form units on change
		//
		this.cost.numerator.to($(event.target).val());
		this.$el.find('#cost input').val(this.cost.val());
		this.onChange();
	},

	onChangeCostDenominatorUnits: function(event) {

		// convert form units on change
		//
		this.cost.denominator.to($(event.target).val());
		this.$el.find('#cost input').val(this.cost.val());
		this.onChange();
	}
});