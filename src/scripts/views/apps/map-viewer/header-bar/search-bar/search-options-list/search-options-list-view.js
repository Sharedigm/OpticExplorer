/******************************************************************************\
|                                                                              |
|                         search-options-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of search options.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../../models/base-model.js';
import BaseCollection from '../../../../../../collections/base-collection.js';
import CollectionView from '../../../../../../views/collections/collection-view.js';
import SearchOptionsListItemView from '../../../../../../views/apps/map-viewer/header-bar/search-bar/search-options-list/search-options-list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'dropdown-menu panels',

	// views
	//
	childView: SearchOptionsListItemView,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new BaseCollection();

		// convert array of suggestions into a collection
		//
		if (this.options.suggestions) {
			this.addSuggestions(this.options.suggestions);
		}
	},

	//
	// methods
	//

	addSuggestions: function(suggestions) {

		// create models for each item in suggestions array
		//
		for (let i = 0; i < suggestions.length; i++) {
			this.collection.add(new BaseModel(suggestions[i]));
		}
	}
});