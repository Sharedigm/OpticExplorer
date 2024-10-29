/******************************************************************************\
|                                                                              |
|                          user-invitation-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a new user invitation.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-user"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="name" value="<%= invitee_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name address of the intended recipient."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="email form-group">
			<label class="required control-label"><i class="fa fa-envelope"></i>Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required email form-control" name="email" placeholder="name@domain" value="<%= invitee_email %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="This is the email address of the intended recipient."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" name="message" rows="4" maxlength="1000"><%= message %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the email message to send."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'email':
				return this.$el.find('.email input').val();
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			invitee_name: this.getValue('name'),
			invitee_email: this.getValue('email'),
			message: this.getValue('message'),
			registration_url: application.getUrl() + '#register'
		};
	}
});