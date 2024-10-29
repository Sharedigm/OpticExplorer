/******************************************************************************\
|                                                                              |
|                         share-by-email-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for sharing an item via email.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Link from '../../../../../../models/storage/sharing/link.js';
import DialogView from '../../../../../../views/dialogs/dialog-view.js';
import EmailFormView from '../../../../../../views/apps/file-browser/sharing/mail/forms/email-form-view.js';
import EmailLinkInfoFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/email-link-info-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-envelope"></i>
					</div>
					<div class="title">
						Share by Email
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="email-form"></div>
					<form class="send-as form-horizontal wide">
						<div class="form-group">
							<label class="control-label"><i class="fa fa-download"></i>Send as</label>
							<div class="controls">
		
								<div class="radio-inline">
									<label><input type="radio" name="send-as" value="attachment"<% if (options['send-as'] == 'attachment') { %> checked="checked"<% } %>>Attachment</label>
								</div>
		
								<div class="radio-inline">
									<label><input type="radio" name="send-as" value="link"<% if (options['send-as'] == 'link') { %> checked="checked"<% } %>>Link</label>
								</div>
							</div>
						</div>
					</form>
					<div class="link-info" style="display:none">
						<div class="link-info-form"></div>
					</div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="send btn btn-primary"<% if (options['send-as'] == 'link') { %> style="display:none"<% } %>>
							<i class="fa fa-envelope"></i>Send
						</button>
						<button class="next btn btn-primary"<% if (options['send-as'] == 'attachment') { %> style="display:none"<% } %>>
							<i class="fa fa-arrow-right"></i>Next
						</button>
						<button class="prev btn" style="display:none">
							<i class="fa fa-arrow-left"></i>Prev
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		email: {
			el: '.email-form',
			replaceElement: true
		},
		link: {
			el: '.link-info-form',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'input input': 'onChange',
		'click .send-as input[value="link"]': 'onClickSendAsLink',
		'click .send-as input[value="attachment"]': 'onClickSendAsAttachment',
		'click .next': 'onClickNext',
		'click .prev': 'onClickPrev',
		'click .send': 'onClickSend'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.small,
	
	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options['send-as'] == undefined) {
			this.options['send-as'] = 'attachment';
		}
		
		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.data = {
			to: this.options.to,
			cc: this.options.cc,
			subject: this.model? this.model.getName() : undefined,
			message: this.options.message
		};
	},

	//
	// getting methods
	//

	getSendAs: function() {
		return this.$el.find('input[name="send-as"]:checked').attr('value');
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.send').prop('disabled', disabled !== false);
	},

	//
	// sending methods
	//

	sendMail: function(data) {
		this.model.sendByMail({
			data: data,

			// callbacks
			//
			success: () => {

				// play send sound
				//
				application.play('send');

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not send email.",
					response: response
				});
			}
		});
	},

	createLink: function(data, options) {

		// create link to file
		//
		this.model.createLink(_.extend(
			this.getChildView('link').getData(), data), {
			
			// callbacks
			//
			success: (model) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create link",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			options: this.options
		};
	},

	onRender: function() {

		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showEmailForm();
		this.showLinkInfoForm();

		// set initiaal state
		//
		this.setDisabled(true);
	},

	showEmailForm: function() {
		this.showChildView('email', new EmailFormView({
			model: this.model,

			// options
			//
			to: this.data.to,
			cc: this.data.cc,
			subject: this.data.subject,
			message: this.data.message,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		}));
	},

	showLinkInfoForm: function() {
		this.showChildView('link', new EmailLinkInfoFormView({
			model: new Link({
				apps: 'Email',
				target: this.model
			})
		}));
	},

	showNextButton: function() {
		this.$el.find('.send').hide();
		this.$el.find('.next').show();
		this.$el.find('.prev').hide();
	},

	showPrevButton: function() {
		this.$el.find('.send').show();
		this.$el.find('.next').hide();
		this.$el.find('.prev').show();
	},

	showSendButton: function() {
		this.$el.find('.send').show();
		this.$el.find('.next').hide();
	},

	//
	// mouse event handling methods
	//

	onClickSendAsLink: function() {
		this.showNextButton();
	},

	onClickSendAsAttachment: function() {
		this.showSendButton();
	},

	onClickNext: function() {

		// check form validation
		//
		if (this.getChildView('email').isValid()) {

			// show link info form
			//
			this.$el.find('.send-as').hide();
			this.getChildView('email').$el.hide();
			this.$el.find('.link-info').show();
			this.showPrevButton();
		}	
	},

	onClickPrev: function() {

		// show email form
		//
		this.$el.find('.link-info').hide();
		this.getChildView('email').$el.show();
		this.$el.find('.send-as').show();
		this.showNextButton();
	},

	onClickSend: function() {
		let form = this.getChildView('email');

		// check form validation
		//
		if (form.isValid()) {
			let values = form.getValues();
			let sendAs = this.getSendAs();

			if (sendAs == 'link') {
				this.createLink({
					apps: 'Email',
					message: values.message
				}, {

					// callbacks
					//
					success: (model) => {
						this.sendMail(_.extend(values, {
							url: model.getUrl()
						}));		
					}
				});
			} else {
				this.sendMail(values);
			}
		}
	}
});
