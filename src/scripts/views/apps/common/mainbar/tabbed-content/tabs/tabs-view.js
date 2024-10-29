/******************************************************************************\
|                                                                              |
|                                  tabs-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a collection of tabs.            |
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
import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';
import '../../../../../../../vendor/bootstrap/js/tab.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'nav nav-tabs',
	childView: TabView,

	attributes: {
		role: 'tablist'
	},

	//
	// querying methods
	//

	hasTabs: function() {
		return this.children.length != 0;
	},

	hasMultipleTabs: function() {
		return this.children.length > 1;
	},

	hasActiveView: function() {
		for (let i = 0; i < this.children.length; i++) {
			if (this.getChildViewAt(i).isActive()) {
				return true;
			}
		}
		return false;
	},

	//
	// counting methods
	//

	numTabs: function() {
		return this.children.length;
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

	getActiveTabView: function() {
		for (let i = 0; i < this.children.length; i++) {
			if (this.getChildViewAt(i).isActive()) {
				return this.getChildViewAt(i);
			}
		}		
	},

	//
	// setting methods
	//

	setActiveIndex: function(index) {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).setActive(index == i);
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(index);
		}
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		let index = this.collection.indexOf(model);

		return {
			model: model,

			// options
			//
			index: index,
			count: this.options.index,
			active: index == this.collection.length - 1,
			closeable: this.options.closeable,

			// callbacks
			//
			onclick: this.options.onclick,
			onclose: this.options.onclose
		};
	}
});