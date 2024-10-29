/******************************************************************************\
|                                                                              |
|                             table-selectable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a selectable behavior for tables.                        |
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

	events: {
		'mousedown th': 'onMouseDownTableHead'
	},

	//
	// mouse event handling methods
	//

	onMouseDownTableHead: function() {
		if (this.selectable) {
			this.deselectAll();
		}
	}
};