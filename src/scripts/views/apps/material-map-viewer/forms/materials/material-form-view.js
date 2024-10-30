/******************************************************************************\
|                                                                              |
|                            material-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying material attributes.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`

		<div class="name form-group">
			<label class="control-label">Name</label>
			<div class="controls">
				<input class="form-control" value="<%= name %>">
			</div>
		</div>

		<div class="catalog form-group">
			<label class="control-label">Catalog</label>
			<div class="controls">
				<input class="form-control" value="<%= catalog %>">
			</div>
		</div>

		<div class="index-of-refraction form-group">
			<label class="required control-label">Index</label>
			<div class="controls">
				<input class="required form-control" value="<%= index_of_refraction %>">
			</div>
		</div>

		<div class="abbe-number form-group">
			<label class="required control-label">Abbe Number</label>
			<div class="controls">
				<input type="number" class="required form-control" value="<%= abbe_number %>">
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'catalog':
				return this.$el.find('.catalog input').val();
			case 'index_of_refraction':
				return parseFloat(this.$el.find('.index-of-refraction input').val());
			case 'abbe_number':
				return parseFloat(this.$el.find('.abbe-number input').val());
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			catalog: this.getValue('catalog'),
			index_of_refraction: this.getValue('index_of_refraction'),
			abbe_number: this.getValue('abbe_number')
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('name'),
			catalog: this.model.get('catalog'),
			index_of_refraction: this.model.get('index_of_refraction'),
			abbe_number: this.model.get('abbe_number')
		};
	}
});