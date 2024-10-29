/******************************************************************************\
|                                                                              |
|                            section-index-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Page from '../../../../../models/indices/page.js';
import Section from '../../../../../models/indices/section.js';
import BaseCollection from '../../../../../collections/base-collection.js';
import TreeView from '../../../../../views/items/trees/tree-view.js';
import PageIndexView from '../../../../../views/apps/help-viewer/sidebar/indices/page-index-view.js';

export default TreeView.extend({

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		TreeView.prototype.initialize.call(this);

		// create collection
		//
		this.collection = new BaseCollection(this.get('items'));
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.model.get('icon');
	},

	getName: function() {
		return this.model.get('name');
	},

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Page) {
			return PageIndexView;
		} else if (item instanceof Section) {
			return this.constructor;
		}
	}
});