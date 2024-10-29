/******************************************************************************\
|                                                                              |
|                             checkable-containable.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for selectable container views.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Containable from '../../../views/behaviors/containers/containable.js';

export default _.extend({}, Containable, {

	//
	// querying methods
	//

	hasChecked: function() {
		return this.hasChildren((child) => child.isChecked());
	},

	//
	// counting methods
	//

	numChecked: function() {
		return this.numChildren((child) => child.isChecked());
	},

	//
	// getting methods
	//

	getChecked: function() {
		return this.getChildren((child) => child.isChecked());
	},

	getCheckedModels: function() {
		return this.getChildModels((child) => child.isChecked());
	},
	
	//
	// setting methods
	//

	setAllChecked: function(checked, filter) {
		this.each((child) => {
			child.setChecked(checked);
		}, filter);
	},

	invertChecked: function(filter) {
		this.each((child) => {
			child.toggleChecked();
		}, filter);
	}
});