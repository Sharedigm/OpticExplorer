/******************************************************************************\
|                                                                              |
|                                 list-view.js                                 |
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

import SelectableCollectionView from '../../../views/collections/selectable-collection-view.js';
import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default SelectableCollectionView.extend({

	//
	// views
	//

	childView: ListItemView,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		SelectableCollectionView.prototype.initialize.call(this);

		// watch collection
		//
		this.listenTo(this.collection, 'add', this.update, this);
		this.listenTo(this.collection, 'remove', this.update, this);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.$el.find('table').wrap('<div class="table-responsive"></div>');
	},

	//
	// updating methods
	//

	update: function() {

		// renumber (if list is numbered)
		//
		this.renumber();
	},

	renumber: function() {
		let count = 1;
		this.$el.find('td.number').each((index, element) => {
			$(element).html(count++);
		});
	}
});