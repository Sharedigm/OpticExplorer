/******************************************************************************\
|                                                                              |
|                             contact-info-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a collection of contact info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardsView from '../../../../../../views/items/cards/cards-view.js';
import ContactPhoneView from '../../../../../../views/apps/contact-editor/mainbar/contacts/info/contact-phone-view.js';
import ContactEmailAddrView from '../../../../../../views/apps/contact-editor/mainbar/contacts/info/contact-email-addr-view.js';
import ContactAddressView from '../../../../../../views/apps/contact-editor/mainbar/contacts/info/contact-address-view.js';
import ContactWebsiteView from '../../../../../../views/apps/contact-editor/mainbar/contacts/info/contact-website-view.js';

export default CardsView.extend({

	//
	// rendering methods
	//
	
	childView: function(item) {
		if (item.has('phone_number')) {
			return ContactPhoneView;
		} else if (item.has('email_addr')) {
			return ContactEmailAddrView;
		} else if (item.has('street_address')) {
			return ContactAddressView;
		} else if (item.has('url')) {
			return ContactWebsiteView;
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
			onchange: this.options.onchange,
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
