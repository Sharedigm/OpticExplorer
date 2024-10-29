/******************************************************************************\
|                                                                              |
|                              email-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form for email composition.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import FormView from '../../../../../../views/forms/form-view.js';
import FileIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import DirectoryIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/directory-icon-view.js';
import VolumeIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/volume-icon-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal wide',

	template: template(`
		<div class="items">
			<div class="icon-grid"></div>
		</div>

		<div class="to form-group">
			<label class="required control-label"><i class="fa fa-user"></i>To</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required email form-control" name="email" placeholder="name@domain" value="<%= to %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="To" data-content="This is a comma separated list of one or more email addresses of the intended recipient(s)."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="cc form-group">
			<label class="control-label"><i class="fa fa-user"></i>CC</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="email form-control" name="email" placeholder="name@domain" value="<%= cc %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="CC" data-content="This is a comma separated list of zero or more email addresses of the carbon copy recipient(s)."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="subject form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Subject</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= subject %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Subject" data-content="This is the subject of the email."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" name="message" rows="3" maxlength="1000"><%= message %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the email message to send."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		item: '.icon-grid',
	},

	//
	// form attributes
	//

	messages: {
		'email': {
			required: "Enter a valid email address.",
			email: "This email address is not valid."
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'to':
				return this.stringToAddrs(this.$el.find('.to input').val());
			case 'cc':
				return this.stringToAddrs(this.$el.find('.cc input').val());
			case 'subject':
				return this.$el.find('.subject input').val();
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			to: this.getValue('to'),
			cc: this.getValue('cc'),
			subject: this.getValue('subject'),
			message: this.getValue('message')
		};
	},

	getItemIconView: function(item) {
		if (item instanceof Volume) {
			return VolumeIconView;
		} else if (item instanceof File) {
			return FileIconView;
		} else if (item instanceof Directory) {
			return DirectoryIconView;
		}
	},

	//
	// converting methods
	//

	stringToAddrs: function(string) {
		let addrs;

		if (string.contains(',')) {
			addrs = string.split(',');
			for (let i = 0; i < addrs.length; i++) {
				addrs[i] = addrs[i].trim();
			}
		} else if (string) {
			addrs = [string];
		}

		return addrs;
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			to: this.options.to,
			cc: this.options.cc,
			subject: this.options.cc,
			message: this.options.message
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		if (this.model) {
			this.showItem();
		}
	},

	showItem: function() {
		let ItemIconView = this.getItemIconView(this.model);

		this.showChildView('item', new ItemIconView({
			model: this.model,

			// capabilities
			//
			selectable: false
		}));
	}
});