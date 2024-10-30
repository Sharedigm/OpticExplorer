/******************************************************************************\
|                                                                              |
|                       reflection-equation-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying reflection formulas                |
|        (the Fresnel equations).                                              |
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
import '../../../../../../vendor/mathjax/es5/tex-mml-chtml.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="form-group" style="display:table; width:100%; min-height:50px">
			<div style="display:table-cell; text-align:center; vertical-align:middle">
				<div id="equation" class="math well">
					<%= equation %>
				</div>
			</div>
		</div>
	`),

	//
	// form attributes
	//

	polarization: 'unpolarized',

	//
	// equation formatting methods
	//

	getPolarizedEquationHTML: function() {
		return '$$ R = \\frac { 1 } { 2 } (R_s + R_p) $$' +
			'$$ where \\ R_s = ' + 'reflectance (perpendicular),' +
			'R_p = ' + 'reflectance (parallel) $$';
	},

	getSPolarizedEquationHTML: function() {
		return '$$ R_s = \\left( ' +
			'{ n_1 cos \\theta_i - n_2 \\sqrt {( 1 - (\\frac { n_1 } { n_2 } sin \\theta_i) ^ 2 }} ' +
			'\\over ' +
			'{ n_1 cos \\theta_i + n_2 \\sqrt {( 1 - (\\frac { n_1 } { n_2 } sin \\theta_i) ^ 2 }} ' +
			'\\right) ^ 2 $$';
	},

	getPPolarizedEquationHTML: function() {
		return '$$ R_p = \\left( ' +
			'{ n_1 \\sqrt { 1 - ( \\frac { n_1 } { n_2 } sin \\theta_i) ^ 2 } - n_2 cos \\theta_i }' +
			'\\over ' +
			'{ n_1 \\sqrt { 1 - ( \\frac { n_1 } { n_2 } sin \\theta_i) ^ 2 } + n_2 cos \\theta_i } ' +
			'\\right) ^ 2 $$';
	},

	getEquationHTML: function(polarization) {
		switch (polarization || 'unpolarized') {
			case 's-polarized':
				return this.getSPolarizedEquationHTML();
			case 'p-polarized':
				return this.getPPolarizedEquationHTML();
			case 'unpolarized':
				return this.getPolarizedEquationHTML();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			equation: this.getEquationHTML(this.polarization)
		};
	},

	onRender: function() {

		// add math formatting
		//
		window.setTimeout(() => {
			this.showMath();
		}, 100);
	},

	showEquation: function() {

		// update equation html
		//
		this.$el.find('#equation').html(this.getEquationHTML(this.polarization));
		
		this.showMath();
	},

	showMath: function() {

		// add math formatting
		//
		MathJax.typeset();
	},

	//
	// updating methods
	//

	update: function() {

		// get parameters
		//
		this.polarization = this.parent.getChildView('params').polarization;

		// update view
		//
		this.showEquation();
	}
});