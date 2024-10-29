/******************************************************************************\
|                                                                              |
|                      notification-settings-list-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of a list of notification settings.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../views/collections/tables/sortable-table-list-view.js';
import NotificationSettingsListItemView from '../../../../../views/apps/settings-manager/mainbar/notification-settings-list/notification-settings-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th headers="event">
					<i class="fa fa-exclamation-triangle"></i>
					<label>Event</label>
				</th>
		
				<% for (let i = 0; i < channels.length; i++) { %>
				<% let channel = channels[i]; %>
				<% let name = channel; %>
				<% if (name == 'nexmo') { name = 'sms' } %>
				<th id="<%= channel %>" class="sorter-false" style="text-align:left; padding: 0 15px">
					<input class="all-notifications" type="checkbox"<% if (all_selected[i]) { %> checked<% } %> />
					<% if (name == 'mail') { %>
					<i class="fa fa-envelope"></i>
					<% } else if (name == 'sms') { %>
					<i class="fa fa-mobile"></i>
					<% } else if (name == 'slack') { %>
					<i class="fab fa-slack"></i>
					<% } %>
					<label><%= name.toTitleCase() %></label>
				</th>
				<% } %>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),
	childView: NotificationSettingsListItemView,

	sorting: {
		
		// disable sorting on message and password fields
		//
		headers: {
			'.sound': {
				sorter: false 
			}
		},

		// sort on first column in descending order 
		//
		sortList: [[0, 0]]
	},

	events: {
		'click th input': 'onClickTableHeaderInput'
	},

	//
	// getting methods
	//

	getValues: function() {
		let values = {};
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.getChildViewAt(i);
			let key = childView.model.get('event');
			let value = childView.getValue();
			values[key] = value;
		}
		return values;
	},

	//
	// querying methods
	//

	isAllSelectedInChannel: function(channel) {
		let keys = Object.keys(this.model.attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (!this.model.attributes[key].includes(channel)) {
				return false;
			}
		}
		return true;
	},

	isAllSelected: function() {
		let all_selected = [];
		for (let i = 0; i < this.options.channels.length; i++) {
			let channel = this.options.channels[i];
			all_selected.push(this.isAllSelectedInChannel(channel));
		}
		return all_selected;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			channels: this.options.channels,
			all_selected: this.isAllSelected()
		};
	},

	childViewOptions: function() {
		return {
			channels: this.options.channels,
			settings: this.model
		}; 
	},

	//
	// mouse event handling methods
	//

	onClickTableHeaderInput: function(event) {
		let element = $(event.target);
		let id = element.closest('th').attr('id');
		let checked = $(element).is(':checked');
		this.$el.find('td[headers="' + id + '"] input').prop('checked', checked);
		this.model.set(this.getValues());
	}
});