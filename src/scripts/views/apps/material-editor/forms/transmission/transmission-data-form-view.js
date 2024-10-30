/******************************************************************************\
|                                                                              |
|                        transmission-data-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for performing transmission calculations.         |
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
import CoordsListView from '../../../../../views/apps/material-editor/forms/lists/coords-list/coords-list-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div id="data" class="vertically scrollable"></div>
		<label id="error" class="error" style="display:none">This field is required.</label>
	`),

	regions: {
		'data': '#data'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		if (this.model && this.model.has('k')) {
			this.showCoordsList();
		} else {
			this.showChildView('data', new BaseView({
				tagName: 'ul',
				className: 'empty',
				template: template('No data.')		
			}));
		}
	},

	showCoordsList: function() {
		this.showChildView('data', new CoordsListView({

			// options
			//
			className: 'flush',
			titles: ['&lambda; (um)', 'K(&lambda;)'],
			array: this.model.get('k'),
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
		this.getChildView('data').validate();
	},

	isValid: function() {
		return this.getChildView('data').isValid();
	},
	
	//
	// event handling methods
	//

	onChange: function() {
		if (!this.getChildView('data').isValid()) {

			// show error message
			//
			this.showError(this.getChildView('data').validate());
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