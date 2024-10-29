/******************************************************************************\
|                                                                              |
|                              table-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../views/collections/lists/list-view.js';
import TableListItemView from '../../../views/collections/tables/table-list-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	tagName: 'table',
	childView: TableListItemView,
	childViewContainer: 'tbody',

	events: {
		'mousedown th': 'onMouseDownTableHead'
	},

	selectable: true,

	//
	// setting methods
	//

	setShowNumbering: function(showNumbering) {
		if (showNumbering) {
			this.$el.addClass('numbered');
		} else {
			this.$el.removeClass('numbered');
		}
	},

	setFlush: function(isFlush) {
		if (isFlush) {
			this.$el.addClass('flush');
		} else {
			this.$el.removeClass('flush');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ListView.prototype.onRender.call(this);

		// add optional numbering
		//
		this.setShowNumbering(this.show_numbering);
		this.setFlush(this.options.flush || this.flush);
	},

	attachHtml: function(elements) {

		// add elements to DOM
		//
		this.Dom.appendContents($(this.el).find('tbody'), elements);
	},

	//
	// mouse event handling methods
	//

	onMouseDownTableHead: function() {
		if (this.selectable) {
			this.deselectAll();
		}
	}
});