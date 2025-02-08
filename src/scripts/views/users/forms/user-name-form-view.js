/******************************************************************************\
|                                                                              |
|                            user-name-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of the user's name.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<fieldset>
			<div class="name form-group">
				<label class="required control-label"><i class="fa fa-quote-left"></i>Name</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="name" value="<%= name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is your full name."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	`),

	//
	// form attributes
	//

	messages: {
		'name': {
			required: "Enter your full name."
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
		}
	},

	getValues: function() {

		// split names into first, middle, last
		//
		let name = this.getValue('name');
		let names = name.split(' ');
		let first_name, preferred_name, middle_name, last_name;

		// last name only
		//
		if (names.length == 1) {
			last_name = names[length];

		// first and last names
		//
		} else if (names.length == 2) {
			first_name = names[0];
			last_name = names[1];

		// first, preferred or middle, and last names
		//
		} else if (names.length == 3) {
			first_name = names[0];
			if (names[1].startsWith('(')) {
				preferred_name = names[1].replace('(', '').replace(')', '');
			} else {
				middle_name = names[1];
			}
			last_name = names[2];

		// first, preferred, middle (multiple), and last names
		//
		} else {
			first_name = names[0];
			if (names[1].startsWith('(')) {
				preferred_name = names[1].replace('(', '').replace(')', '');
				middle_name = names.slice(2, -1).join(' ');
			} else {
				middle_name = names.slice(1, -1).join(' ');
			}
			last_name = names[names.length - 1];
		}

		return {
			first_name: first_name,
			preferred_name: preferred_name,
			middle_name: middle_name,
			last_name: last_name
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.getFullName()
		}
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// hide details
		//
		if (this.options.collapsed) {
			this.$el.find('.details').remove();
		}
	}
});