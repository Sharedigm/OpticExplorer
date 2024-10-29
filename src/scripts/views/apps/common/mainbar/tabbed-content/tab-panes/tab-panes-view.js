/******************************************************************************\
|                                                                              |
|                              tab-panes-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying tab panes.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../../../../views/collections/collection-view.js';
import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	className: 'tab-content',
	childView: TabPaneView,

	//
	// querying methods
	//

	hasActiveView: function() {
		return this.getChildViewAt(this.getActiveIndex()) != undefined;
	},

	//
	// getting methods
	//

	getActiveIndex: function() {
		for (let i = 0; i < this.children.length; i++) {
			if (this.getChildViewAt(i).isActive()) {
				return i;
			}
		}
	},

	getActiveView: function() {
		return this.getChildViewAt(this.getActiveIndex());
	},
	
	//
	// setting methods
	//

	setActiveIndex: function(index) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).setActive(index == i);
		}
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return _.extend(this.options, {
			index: this.collection.indexOf(model),
			active: this.collection.indexOf(model) == this.collection.length - 1
		}); 
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		for (let i = 0; i < this.children.length; i++) {

			// resize children
			//
			if (this.getChildViewAt(i).onResize) {
				this.getChildViewAt(i).onResize(event);
			}
		}
	}
});