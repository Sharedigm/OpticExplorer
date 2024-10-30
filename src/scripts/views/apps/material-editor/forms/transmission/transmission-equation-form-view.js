/******************************************************************************\
|                                                                              |
|                      transmission-equation-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying transmission formulas              |
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
import '../../../../../../vendor/bootstrap/js/dropdown.js';

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

	transmission: 'absorption',

	//
	// equation formatting methods
	//

	getEquation: function(transmission) {
		switch (transmission) {
			case 'absorption':
				return '$$ T = e ^ { -\\tau \\alpha } $$' + '<br/>' +
					'$$ where \\ \\alpha = 4 \\cdot pi \\cdot \\frac { k } { \\lambda } $$';
			case 'absorption-fresnel':
				return '$$ T = e ^ { -\\tau \\alpha } (1 - R) ^ 2 $$' + '<br/>' +
					'$$ where \\ \\alpha = 4 \\cdot pi \\cdot \\frac { k } { \\lambda } $$';
			case 'absorption-fresnel-reflection':
				return '$$ T = e ^ { -\\tau \\alpha } (1 - R) ^ 2 / (1 - (R tau) ^ 2) $$' + '<br/>' +
					'$$ where \\ \\alpha = 4 \\cdot pi \\cdot \\frac { k } { \\lambda } $$'
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			equation: this.getEquation(this.transmission)
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
		this.$el.find('#equation').html(this.getEquation(this.transmission));
		
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
		this.transmission = this.parent.getChildView('params').transmission;

		// update view
		//
		this.showEquation();
	}
});