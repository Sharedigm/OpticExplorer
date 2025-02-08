/******************************************************************************\
|                                                                              |
|                         user-email-addr-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's email address.              |
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
		<div class="email-addr-kind form-group">
			<label class="control-label"><i class="fa fa-share"></i>Kind</label>
			<div class="controls">
				<select>
					<option value="home"<% if (email_addr_kind == 'home') { %> selected<% } %>>Home</option>
					<option value="work"<% if (email_addr_kind == 'work') { %> selected<% } %>>Work</option>
				</select>
			</div>
		</div>
		
		<div class="email-addr form-group">
			<label class="control-label"><i class="fa fa-envelope"></i>Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="email" placeholder="name@domain" value="<%= email_addr %>">
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="This is your email address."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form attributes
	//

	rules: {
		'email': {
			email: true
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'email_addr_kind':
				return this.$el.find('.email-addr-kind option:selected').val();
			case 'email_addr':
				return this.$el.find('.email-addr input').val();
		}
	},

	getValues: function() {
		return {
			email_addr_kind: this.getValue('email_addr_kind'),
			email_addr: this.getValue('email_addr')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model
		};
	}
});
