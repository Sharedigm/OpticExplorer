/******************************************************************************\
|                                                                              |
|                            place-name-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing the name of a place.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="name required form-group">
			<label class="required form-label"><i class="fa fa-quote-left"></i>Place name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>" />
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="The name of this place or location."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'input input': 'onChange'
	},

	//
	// form setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'name':
				this.$el.find('.name input').val(value);
				break;
		}
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.options.name
		};
	}
});
