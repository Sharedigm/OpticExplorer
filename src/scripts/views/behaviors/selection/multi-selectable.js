/******************************************************************************\
|                                                                              |
|                              multi-selectable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for enabling multi selection.         |
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
	// attributes
	//

	multi_selectable: false,

	//
	// querying methods
	//

	isMultiSelectable: function() {
		return this.multi_selectable;
	},

	//
	// enable / disable multi-selection
	//

	setMultiSelectable: function(multiSelectable) {

		// set container attributes
		//
		this.multi_selectable = multiSelectable;

		// set child attributes
		//
		this.each((child) => {
			child.multi_selectable = multiSelectable;
		});

		// update
		//
		if (this.onChangeSelect) {
			this.onChangeSelect();
		}
	}
};