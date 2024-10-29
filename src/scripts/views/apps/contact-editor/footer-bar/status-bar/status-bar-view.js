/******************************************************************************\
|                                                                              |
|                               status-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'status-bar',

	template: template(`
		<span class="info-bar">
			<i class="fa fa-id-card"></i>
			<% if (num_selected > 0 && num_contacts > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_contacts %> contacts selected
			<% } %>
			<% } else if (num_contacts != undefined) { %>
			<%= num_contacts %> contacts
			<% } else { %>
			Loading...
			<% } %>
		</span>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			num_contacts: this.parent.app.numContacts(),
			num_selected: this.parent.app.numSelected(),
			is_mobile: Browser.is_mobile
		};
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	}
});