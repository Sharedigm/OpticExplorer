/******************************************************************************\
|                                                                              |
|                    notification-settings-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of notification settings list item.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../views/collections/tables/table-list-item-view.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<th headers="event" style="margin-right:5px">
			<%= event.replace(/_/g, ' ').toTitleCase() %>
		</th>
		
		<% for (let i = 0; i < channels.length; i++) { %>
		<% let channel = channels[i]; %>
		<td headers="<%= channel %>"><input type="checkbox"<% if (notifications.includes(channel)) { %> checked<% } %> /></td>
		<% } %>
	`),

	events: {
		'click input': 'onClickInput'
	},

	//
	// getting methods
	//

	getValue: function() {
		let value = [];

		for (let i = 0; i < this.options.channels.length; i++) {
			let channel = this.options.channels[i];
			if (this.$el.find('[headers="' + channel + '"] input').is(':checked')) {
				value.push(channel);
			}
		}

		return value;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let notifications = this.model.get('notifications');
		if (!notifications || !notifications.length) {
			notifications = [];
		}
		
		return {
			notifications: notifications,
			channels: this.options.channels
		};
	},

	//
	// mouse event handling methods
	//

	onClickInput: function() {
		let key = this.model.get('event');
		let value = this.getValue();
		this.options.settings.set(key, value);
	}
});