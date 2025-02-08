/******************************************************************************\
|                                                                              |
|                          user-contact-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's contact info.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPhone from '../../../../../models/users/profile/contacts/user-phone.js';
import UserEmailAddr from '../../../../../models/users/profile/contacts/user-email-addr.js';
import UserAddress from '../../../../../models/users/profile/contacts/user-address.js';
import UserWebsite from '../../../../../models/users/profile/contacts/user-website.js';
import FormView from '../../../../../views/forms/form-view.js';
import UserPhoneFormView from '../../../../../views/apps/profile-viewer/forms/profile/contacts/user-phone-form-view.js';
import UserEmailAddrFormView from '../../../../../views/apps/profile-viewer/forms/profile/contacts/user-email-addr-form-view.js';
import UserAddressFormView from '../../../../../views/apps/profile-viewer/forms/profile/contacts/user-address-form-view.js';
import UserWebsiteFormView from '../../../../../views/apps/profile-viewer/forms/profile/contacts/user-website-form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<form class="form-horizontal">
			<div class="contact-kind form-group">
				<label class="control-label"><i class="fa fa-question"></i>Contact</label>
				<div class="controls">
					<select>
						<option value="phone"<% if (contact_kind == 'phone') { %> selected<% } %>>Phone</option>
						<option value="email-addr"<% if (contact_kind == 'email-addr') { %> selected<% } %>>Email Addr</option>
						<option value="address"<% if (contact_kind == 'address') { %> selected<% } %>>Address</option>
						<option value="website"<% if (contact_kind == 'website') { %> selected<% } %>>Website</option>
					</select>
				</div>
			</div>
		</form>
		
		<div class="user-phone-form"<% if (contact_kind != 'phone') { %> style="display:none"<% } %>></div>
		<div class="user-email-addr-form"<% if (contact_kind != 'email-addr') { %> style="display:none"<% } %>></div>
		<div class="user-address-form"<% if (contact_kind != 'address') { %> style="display:none"<% } %>></div>
		<div class="user-website-form"<% if (contact_kind != 'website') { %> style="display:none"<% } %>></div>
	`),

	regions: {
		phone: '.user-phone-form',
		email: '.user-email-addr-form',
		address: '.user-address-form',
		website: '.user-website-form'
	},

	events: _.extend({}, FormView.prototype.events, {
		'change .contact-kind select': 'onChangeContactKind'
	}),

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.contact_kind == undefined) {
			this.options.contact_kind = 'phone';
		}
		if (this.options.user_phone == undefined) {
			this.options.user_phone = new UserPhone();
		}
		if (this.options.user_email_addr == undefined) {
			this.options.user_email_addr = new UserEmailAddr();
		}
		if (this.options.user_address == undefined) {
			this.options.user_address = new UserAddress();
		}
		if (this.options.user_website == undefined) {
			this.options.user_website = new UserWebsite();
		}
	},

	//
	// getting methods
	//

	getKind: function() {
		return this.$el.find('.contact-kind option:selected').val();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			contact_kind: this.options.contact_kind
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('phone', new UserPhoneFormView({
			model: this.options.user_phone
		}));
		this.showChildView('email', new UserEmailAddrFormView({
			model: this.options.user_email_addr
		}));
		this.showChildView('address', new UserAddressFormView({
			model: this.options.user_address
		}));
		this.showChildView('website', new UserWebsiteFormView({
			model: this.options.user_website
		}));
	},

	//
	// form validating methods
	//

	isValid: function() {
		switch (this.getKind()) {
			case 'phone':
				return this.getChildView('phone').isValid();
			case 'email-addr':
				return this.getChildView('email').isValid();
			case 'address':
				return this.getChildView('address').isValid();
			case 'website':
				return this.getChildView('website').isValid();
		}
	},

	//
	// form methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}
		
		// submit form
		//
		switch (this.getKind()) {
			case 'phone':
				return this.getChildView('phone').submit(options);
			case 'email-addr':
				return this.getChildView('email').submit(options);
			case 'address':
				return this.getChildView('address').submit(options);
			case 'website':
				return this.getChildView('website').submit(options);
		}
	},

	//
	// event handling methods
	//

	onChangeContactKind: function() {
		switch (this.getKind()) {
			case 'phone':
				this.getRegion('phone').$el.show();
				this.getRegion('email').$el.hide();
				this.getRegion('address').$el.hide();
				this.getRegion('website').$el.hide();
				break;
			case 'email-addr':
				this.getRegion('phone').$el.hide();
				this.getRegion('email').$el.show();
				this.getRegion('address').$el.hide();
				this.getRegion('website').$el.hide();
				break;
			case 'address':
				this.getRegion('phone').$el.hide();
				this.getRegion('email').$el.hide();
				this.getRegion('address').$el.show();
				this.getRegion('website').$el.hide();
				break;
			case 'website':
				this.getRegion('phone').$el.hide();
				this.getRegion('email').$el.hide();
				this.getRegion('address').$el.hide();
				this.getRegion('website').$el.show();
				break;
		}
	}
});
