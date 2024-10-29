/******************************************************************************\
|                                                                              |
|                                 checkable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of checking behavior.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// querying methods
	//

	isChecked: function() {
		return this.$el.find('input').is(':checked');
	},
	
	//
	// setting methods
	//

	setChecked: function(checked) {
		return this.$el.find('input').prop('checked', checked);
	},

	toggleChecked: function() {
		if (this.isChecked()) {
			this.uncheck();
		} else {
			this.check();
		}
	}
};