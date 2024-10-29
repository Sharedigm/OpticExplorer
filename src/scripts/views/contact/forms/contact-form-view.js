/******************************************************************************\
|                                                                              |
|                             contact-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the contact us form of the application.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Contact from '../../../models/utilities/contact.js';
import FormView from '../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal wide',

	template: template(`
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is your (real) name."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="username form-group" style="display:none">
			<label class="control-label"><i class="fa fa-keyboard"></i>Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is your username (the name you use to sign in), if you have one."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="email form-group">
			<label class="control-label"><i class="fa fa-envelope"></i>Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="email" class="form-control" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="This is your email, if you'd like us to respond to your request or inquiry."></i>
					</div>
				</div>
			</div>
		</div>
		
		<% if (subjects) { %>
		<div class="subject form-group">
			<label class="control-label"><i class="fa fa-info-circle"></i>Subject</label>
			<div class="controls">
				<select>
					<% for (let i = 0; i < subjects.length; i++) { %>
					<option><%= subjects[i] %></option>
					<% } %>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Subject" data-content="This is the subject of your message."></i>
			</div>
		</div>
		<% } %>
		
		<div class="message wide form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="10"></textarea>
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the message to send."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="attachment form-group">
			<label class="control-label"><i class="fa fa-file"></i>Attachment</label>
			<div class="controls">
				<button class="select btn" style="float:left; margin-right:10px"><i class="fa fa-mouse-pointer"></i>Select File</button>
				<input type="file" id="file" class="form-control" style="float:left; margin-right:10px; display:none" />
				<button class="remove btn btn-sm" style="margin:2px; display:none"><i class="fa fa-xmark"></i></button>
			</div>
		</div>
		
		<div class="notes">
			<span class="required"></span>Fields are required
		</div>
		
		<div class="buttons">
			<button class="submit btn btn-primary btn-lg">
				<i class="fa fa-envelope"></i><%= label %>
			</button>
		</div>
	`),

	events: {
		'click .select': 'onClickSelect',
		'click .remove': 'onClickRemove',
		'change input[type="file"]': 'onChangeFile',
		'click .submit': 'onClickSubmit'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = new Contact();
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'username':
				return this.$el.find('.username input').val();
			case 'email':
				return this.$el.find('.email input').val();
			case 'subject':
				return this.$el.find('.subject option:selected').text();
			case 'message':
				return this.$el.find('.message textarea').val();
			case 'attachment':
				return this.$el.find('.attachment input[type="file"]')[0].files[0];
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			username: this.getValue('username'),
			email: this.getValue('email'),
			subject: this.getValue('subject'),
			message: this.getValue('message'),
			attachment: this.getValue('attachment')
		};
	},

	//
	// setting methods
	//

	setFilename: function(filename) {
		const fileInput = this.$el.find('input[type="file"]')[0];

		// Help Safari out
		//
		if (fileInput.webkitEntries.length) {
			fileInput.dataset.file = filename;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return this.options;
	},

	//
	// mouse event handling methods
	//

	onClickSelect: function(event) {
		this.$el.find('input[type="file"]').trigger('click');
		this.block(event);
	},

	onClickRemove: function(event) {
		this.$el.find('input[type="file"]')[0].value = null;
		this.$el.find('input[type="file"]').hide();
		this.$el.find('.remove').hide();
		this.block(event);
	},

	onClickSubmit: function() {
		application.showSpinner();

		// send contact email
		//
		this.submit({

			// callbacks
			//
			success: () => {
				application.hideSpinner();

				// go back to welcome view
				//
				application.navigate('#', {
					trigger: true
				});

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Message Sent',
					message: "Your message has been sent. Thank you for your feedback."
				});
			},

			error: () => {

				// show error
				//
				application.error({
					message: "Your message could not be sent."
				});
			}
		});
	},

	//
	// file event handling methods
	//

	onChangeFile: function(event) {
		this.$el.find('input[type="file"]').show();
		this.$el.find('.remove').show();

		// set input filename (required for Safari)
		//
		if (event) {
			if (event.target.files[0]) {
				let filename = event.target.files[0].name;
				this.setFilename(filename);
			} else {
				this.setFilename('No file chosen');
			}
		}
	},
});