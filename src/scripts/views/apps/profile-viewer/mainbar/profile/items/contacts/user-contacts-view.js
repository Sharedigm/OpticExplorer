/******************************************************************************\
|                                                                              |
|                             user-contacts-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a collection of user contacts.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardsView from '../../../../../../../views/items/cards/cards-view.js';
import UserPhoneView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/contacts/user-phone-view.js';
import UserEmailAddrView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/contacts/user-email-addr-view.js';
import UserAddressView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/contacts/user-address-view.js';
import UserWebsiteView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/contacts/user-website-view.js';

export default CardsView.extend({

	//
	// rendering methods
	//
	
	childView: function(item) {
		if (item.has('phone_number')) {
			return UserPhoneView;
		} else if (item.has('email_addr')) {
			return UserEmailAddrView;
		} else if (item.has('street_address')) {
			return UserAddressView;
		} else if (item.has('url')) {
			return UserWebsiteView;
		} else {

			// show error message
			//
			application.error({
				message: "Invalid contact info found."
			});
		}
	},

	childViewOptions: function() {
		return {

			// options
			//
			countries: this.options.countries,
			expanded: this.options.expanded,

			// capabilities
			//
			expandable: this.options.expandable,
			selectable: this.options.selectable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropon: this.options.ondropon,
			ondropout: this.options.ondropout,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}; 
	},

	onRender: function() {
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	}
});
