/******************************************************************************\
|                                                                              |
|                          link-password-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for defining link password attributes.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="well">
			<i class="fa fa-info-circle"></i>
			Links can be be protected so that the user of a link must provide a password.
		</div>

		<div class="password form-group">
			<label class="required control-label"><i class="fa fa-key"></i>Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="new-password"<% if (typeof password != 'undefined') { %> value="<%= password %>"<% } %> />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Password" data-content="This is a password that must be provided when accessing the link."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="show-password form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show password</label>
			<div class="controls">
			
				<div class="checkbox-inline">
					<input type="checkbox">
				</div>
			</div>
		</div>
	`),
	
	attributes: {
		'autocomplete': 'new-password'
	},

	events: {
		'click .show-password': 'onClickShowPassword'
	},

	//
	// form querying methods
	//

	getPassword: function() {
		let password = this.$el.find('.password input').val();
		if (password && password != '') {
			return password;
		}
	},

	getValue: function(kind) {
		switch (kind) {
			case 'password':
				return this.getPassword();
		}
	},

	//
	// form submission methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}

		// get form values
		//
		let password = this.getPassword();

		// fetch link
		//
		this.model.fetch({
			data: {
				password: password
			},

			// callbacks
			//
			success: (model) => {
				if (model.has('authenticated') && model.get('authenticated') == true) {
					model.set({
						password: password
					});

					// perform callback
					//
					if (options && options.success) {
						options.success(model);
					}
				} else {

					// perform callback
					//
					if (options && options.error) {
						options.error('Password is not correct.');
					}
				}
			},

			error: () => {
				options.error('Invalid link.');
			}
		});

		// form passed validation
		//
		return true;
	},

	//
	// mouse event handling methods
	//

	onClickShowPassword: function(event) {
		let showPassword = $(event.target).is(':checked');
		if (showPassword) {
			this.$el.find('.password input').attr('type', 'text');
		} else {
			this.$el.find('.password input').attr('type', 'password');
		}
	}
});
