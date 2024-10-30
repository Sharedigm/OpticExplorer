/******************************************************************************\
|                                                                              |
|                        refraction-params-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying refraction parameters.             |
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
		<div class="form-group" id="formula">
			<label class="control-label">Formula</label>
			<div class="controls">
				<div class="controls">
					<select>
						<option value="abbe"<% if (formula == 'abbe') {%> selected<% }%>>Abbe</option>
						<option value="cauchy"<% if (formula == 'cauchy') {%> selected<% }%>>Cauchy</option>
						<option value="sellmeier"<% if (formula == 'sellmeier') {%> selected<% }%>>Sellmeier</option>
						<option value="sellmeier2"<% if (formula == 'sellmeier2') {%> selected<% }%>>Sellmeier (2)</option>
						<option value="polynomial"<% if (formula == 'polynomial') {%> selected<% }%>>Polynomial</option>
						<option value="tabulated"<% if (formula == 'tabulated') {%> selected<% }%>>Tabulated</option>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Equation" data-content="This is the type of equation to use to model the index of refraction verses wavelength."></i>
				</div>
			</div>
		</div>

		<% if (typeof formula == 'undefined' || formula == 'abbe') { %>
		<div class="form-group" id="abbe-number-kind">
			<label class="control-label">Abbe number kind</label>
			<div class="controls">
				<label class="radio-inline">
					<input type="radio" id="D" name="abbe-number-kind" value="D"<% if (abbe_number_kind == 'D') {%> checked<% } %>>
					<span class="math">$$ V_D $$</span>
				</label>
				<label class="radio-inline">
					<input type="radio" id="e" name="abbe-number-kind" value="e"<% if (abbe_number_kind == 'e') {%> checked<% } %>>
					<span class="math">$$ V_e $$</span>
				</label>
				<label class="radio-inline">
					<input type="radio" id="x" name="abbe-number-kind" value="x"<% if (abbe_number_kind == 'x') {%> checked<% } %>>
					<span class="math">$$ V_x $$</span>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Abbe Number Kind" data-content="This determines the spectral lines that are used to measure the Abbe number.  The Abbe number is most commonly defined by the indices of refraction at the sodium D, and hydrogen F and C spectral lines.  Alternatively, it may be defined by the indices of refraction at the mercury e and cadmuim F' and C' lines or by any other set of three indices of refraction at different wavelengths."></i>
				</label>
			</div>
		</div>
		<% } else if (formula != 'tabulated') { %>
		<div class="form-group" id="terms">
			<label class="control-label">Terms</label>
			<div class="controls">
				<div class="controls">
					<select>
						<% for (let i = 1; i <= 7; i++) { %>
						<option value="<%= i %>"<% if (typeof terms != 'undefined' && i == terms) { %> selected <% } %>><%= i %></option>
						<% } %>
					</select>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Terms" data-content="This is the number of terms to use in the equation."></i>
				</div>
			</div></div>
		<% } %>
	`),

	events: {
		'change #formula select': 'onChangeFormulaSelect',
		'change #terms select': 'onChangeTermsSelect',
		'change #abbe-number-kind input': 'onChangeAbbeNumberKind'
	},

	//
	// form attributes
	//

	abbe_number_kind: 'D',
	terms: 3,

	//
	// constructor
	//

	initialize: function() {

		// set model attributes
		//
		if (this.model) {
			this.formula = this.model.get('formula');
			if (this.model.equation) {
				this.terms = this.model.equation.terms? this.model.equation.terms() : 3;
			}
		}
	},

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'formula':
				return this.$el.find('#formula select').val();
			case 'terms':
				return this.$el.find('#terms select').val();
			case 'abbe_number_kind':
				return this.$el.find('input[name="abbe-number-kind"]:checked').val();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			formula: this.formula,
			abbe_number_kind: this.abbe_number_kind,
			terms: this.terms
		};
	},

	onRender: function() {

		// add popover triggers
		//
		this.addPopovers();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('refraction');
		}
	},

	onChangeFormulaSelect: function() {
		this.formula = this.getValue('formula');
		this.onChange();
	},

	onChangeTermsSelect: function() {
		this.terms = this.getValue('terms');
		this.onChange();
	},

	onChangeAbbeNumberKind: function() {
		this.abbe_number_kind = this.getValue('abbe_number_kind');
		this.onChange();
	}
});