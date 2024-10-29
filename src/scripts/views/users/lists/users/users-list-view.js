/******************************************************************************\
|                                                                              |
|                               users-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of users.                        |
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
import UsersListItemView from '../../../../views/users/lists/users/users-list-item-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'users panels',
	empty: "No users.",

	//
	// views
	//

	childView: UsersListItemView,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.collapsed == undefined) {
			this.options.collapsed = false;
		}
	},

	//
	// getting methods
	//

	getCountry: function(model) {
		return this.options.countries && model && model.has('location')? this.options.countries.findWhere({
			'name': model.get('location').get('country')
		}) : undefined;
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	},
	
	childViewOptions: function(model) {
		return {
			country: this.getCountry(model),
			collapsed: this.options.collapsed,
			editable: this.options.editable
		}; 
	}
});
