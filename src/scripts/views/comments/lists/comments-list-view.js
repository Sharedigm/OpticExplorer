/******************************************************************************\
|                                                                              |
|                            comments-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of comments.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../views/collections/collection-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import CommentView from '../../../views/comments/lists/comment-view.js';
import Browser from '../../../utilities/web/browser.js';

export default CollectionView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	className: 'comments-list panels',
	childView: CommentView,

	events: {
		'mousedown': 'onMouseDown',
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.collapsable == undefined) {
			this.options.collapsable = false;
		}
		if (this.options.collapsed == undefined) {
			this.options.collapsed = true;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add multicolumn styling
		//
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	},
	
	childViewOptions: function() {
		return {

			// options
			//
			features: this.options.features,
			preferences: this.options.preferences,
			collapsed: this.options.collapsed,
			selected: this.options.selected,

			// capabilities
			//
			collapsable: this.options.collapsable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}; 
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}
		
		if (event.target.type != 'button') {
			this.deselectAll();
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.children.each((child) => {
			child.onKeyDown(event);
		});
	}
}));
