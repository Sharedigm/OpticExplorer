/******************************************************************************\
|                                                                              |
|                        sound-settings-list-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of sound settings list item.             |
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
		<th class="event">
			<%= event.toTitleCase() %>
		</th>
		
		<td class="sound">
			<select>
				<option></option>
				<% for (let i = 0; i < options.length; i++) { %>
				<option value="<%= options[i] %>"<% if (sound == options[i]) { %> selected<% } %>><%= options[i] %></option>
				<% } %>
			</select>
			<button class="btn btn-sm" data-toggle="tooltip" title="Play Sound" data-placement="right">
				<i class="fa fa-volume-up"></i>
			</button>
		</td>
	`),

	events: {
		'change select': 'onChangeSelect',
		'click button': 'onClickButton'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('select').val();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			options: Object.keys(config.sounds)
		};
	},

	childViewOptions: function() {
		return {
			settings: this.model
		}; 
	},

	//
	// event handling methods
	//

	onChangeSelect: function() {
		let key = this.model.get('event');
		let value = this.getValue();
		this.options.settings.set(key, value);
	},

	onClickButton: function() {
		let value = this.getValue();
		if (value != '') {
			let sound = application.sounds[value];
			if (sound && application.audio) {
				sound.setVolume(application.getVolume() / 10);
				sound.play(application.audio);
			}
		}
	}
});