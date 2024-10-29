/******************************************************************************\
|                                                                              |
|                          sound-settings-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of a list of sound settings.             |
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
import SoundSettingsListItemView from '../../../../../views/apps/settings-manager/mainbar/sound-settings-list/sound-settings-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="event">
					<i class="fa fa-volume-up"></i>
					<label>Event</label>
				</th>
		
				<th class="sound">
					<i class="fa fa-file-audio"></i>
					<label>Sound</label>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),
	childView: SoundSettingsListItemView,

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
	}
});