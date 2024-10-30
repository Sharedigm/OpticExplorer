/******************************************************************************\
|                                                                              |
|                       refraction-equation-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying refraction formulas.               |
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
		<div class="form-group" id="math" style="display:table; width:100%; min-height:50px">
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

	formula: 'abbe',
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
	// equation formatting methods
	//

	getEquation: function(kind) {
		switch (kind || 'abbe') {
			case 'abbe':
				return this.getAbbeEquation();
			case 'cauchy':
				return this.getCauchyEquation();
			case 'sellmeier':
				return this.getSellmeierEquation();
			case 'sellmeier2':
				return this.getSellmeier2Equation();
			case 'polynomial':
				return this.getPolynomialEquation();
			case 'tabulated':
				return 'none';	
		}
	},

	getAbbeEquation: function() {
		let equation = "$$ n(\\lambda) = B + { C \\over \\lambda ^ 2 }, \\ where \\ ";
		switch (this.abbeNumberKind || 'D') {
			case 'D':
				equation += "V_D = { { n_D - 1 } \\over { n_F - n_C } } $$"
				break;
			case 'e':
				equation += "V_e = { { n_e - 1 } \\over { n_F' - n_C' } } $$"
				break;
			case 'x':
				equation += "V_x = { { n_2 - 1 } \\over { n_1 - n_3 } } $$"
				break;
		}
		return equation;
	},

	getCauchyEquation: function() {
		let coeff = 'B';
		let equation = "$$ n(\\lambda) = " + coeff;
		let power = 2;
		for (let i = 1; i <= this.terms - 1; i++) {
			equation += " + ";
			coeff = String.fromCharCode(coeff.charCodeAt(0) + 1);
			equation += '{ ' + coeff + " \\over \\lambda ^ { " + power + '} } ';
			power += 2;
		}
		equation += "$$";
		return equation;
	},

	getSellmeierEquation: function() {
		let equation = "$$ n^2(\\lambda) = 1";
		for (let i = 1; i <= this.terms; i++) {
			equation += " + ";
			if (i == 4) {
				equation += "` <br> `";
			}
			equation += "{ B_" + i + " \\lambda^2 \\over \\lambda^2 - C_" + i + " }"
		}
		equation += "$$";
		return equation;
	},

	getSellmeier2Equation: function() {
		let equation = "$$ n^2(\\lambda) = 1";
		for (let i = 1; i <= this.terms; i++) {
			equation += " + ";
			if (i == 4) {
				equation += "` <br> `";
			}
			equation += "{ B_" + i + " \\lambda^2 \\over \\lambda^2 - C_" + i + "^2 }"
		}
		equation += "$$";
		return equation;
	},

	getPolynomialEquation: function() {
		let equation = "$$ n^2(\\lambda) = ";
		for (let i = 1; i <= this.terms; i++) {
			if (i > 1) {
				equation += " + ";
			}
			equation += "B_" + i + " \\lambda ^ { C_" + i + ' } ';
		}
		equation += "$$";
		return equation;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			equation: this.getEquation(this.formula)
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
		this.$el.find('#equation').html(this.getEquation(this.formula));
		
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
		this.formula = this.parent.getChildView('params').formula;
		this.terms = this.parent.getChildView('params').terms;

		// update view
		//
		this.showEquation();
	}
});