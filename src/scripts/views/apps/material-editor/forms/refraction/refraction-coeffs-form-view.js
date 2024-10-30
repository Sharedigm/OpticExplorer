/******************************************************************************\
|                                                                              |
|                        refraction-coeffs-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying refraction coefficients.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import FormView from '../../../../../views/forms/form-view.js';
import CoeffsListView from '../../../../../views/apps/material-editor/forms/lists/coeffs-list/coeffs-list-view.js';
import CoordsListView from '../../../../../views/apps/material-editor/forms/lists/coords-list/coords-list-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div id="coeffs-list" class="vertically scrollable"></div>
		<div id="coords-list" class="vertically scrollable"></div>
		<label id="error" class="error" style="display:none">This field is required.</label>
	`),

	regions: {
		'coeffs': '#coeffs-list',
		'coords': '#coords-list'
	},
	
	//
	// querying methods
	//

	getCoeffValues: function() {
		let values = this.$el.find('.value');
		let coeffs = [];
		for (let i = 1; i < values.length; i++) {
			let value = $(values[i]).html().trim();
			coeffs.push(parseFloat(value));
		}
		return coeffs;
	},

	getKeys: function() {
		return this.model && this.model.equation? this.model.equation.keys() : []
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.model) {
			if (this.model.get('formula') != 'tabulated') {
				this.showCoeffsList();
			} else {
				this.showCoordsList();
			}
		} else {
			this.showChildView('coeffs', new BaseView({
				tagName: 'ul',
				className: 'empty',
				template: template('No coefficients.')		
			}));
		}
	},

	showCoeffsList: function() {
		this.showChildView('coeffs', new CoeffsListView({

			// options
			//
			className: 'flush',
			array: this.getKeys(),
			editable: true,

			// callbacks
			//
			onchange: () => {
				this.onChange();
			}
		}));
	},

	showCoordsList: function() {
		this.showChildView('coords', new CoordsListView({

			// options
			//
			className: 'flush',
			array: this.model? this.model.get('n') : undefined,
			editable: true,

			// callbacks
			//
			onchange: () => {
				this.onChange();
			}
		}));
	},

	showError: function(error) {
		this.$el.find('#error').html(error).show();
	},

	hideError: function() {
		this.$el.find('#error').hide();
	},

	//
	// form validation methods
	//

	validate: function() {
		this.getChildView('coeffs').validate();
	},

	isValid: function() {
		return this.getChildView('coeffs').isValid();
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (!this.getChildView('coeffs').isValid()) {

			// show error message
			//
			this.showError(this.getChildView('coeffs').validate());
		} else {

			// hide error message
			//
			this.hideError();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});
