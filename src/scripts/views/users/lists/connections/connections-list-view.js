/******************************************************************************\
|                                                                              |
|                           connections-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of connections.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../../views/collections/collection-view.js';
import SelectableContainable from '../../../../views/behaviors/containers/selectable-containable.js';
import MouseDragSelectBehavior from '../../../../views/behaviors/mouse/mouse-drag-select-behavior.js';
import ConnectionsListItemView from '../../../../views/users/lists/connections/connections-list-item-view.js';

export default CollectionView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	tagName: 'ul',
	className: 'users selectable panels',
	empty: "No connections.",

	//
	// views
	//

	childView: ConnectionsListItemView,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.collapsed == undefined) {
			this.options.collapsed = true;
		}

		// add drag select behavior
		//
		if (this.options.selectable) {
			this.dragBehavior = new MouseDragSelectBehavior(this, {
				el: this.$el,
				on: true,

				// callbacks
				//
				onMouseUp: (event) => {

					// perform callback
					//
					if (this.options.ondragend) {
						this.options.ondragend(event);
					}
				}
			});
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	},
	
	childViewOptions: function() {
		return {

			// capabilities
			//
			selectable: this.options.selectable,
			detailed: this.options.detailed,
			editable: this.options.editable,
		
			// callbacks
			//
			onmousedown: this.dragBehavior? this.dragBehavior.mouseDownHandler : null,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}; 
	},

	//
	// selection event handling methods
	//

	onSelect: function() {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	//
	// drag and drop event handling methods
	//

	onDragEnd: function() {

		// perform callback
		//
		if (this.options.ondragend) {
			this.options.ondragend();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		if (this.dragBehavior) {
			this.dragBehavior.off();
		}
	}
}));
