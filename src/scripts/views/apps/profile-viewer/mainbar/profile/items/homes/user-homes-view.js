/******************************************************************************\
|                                                                              |
|                              user-homes-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a collection of user homes.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardsView from '../../../../../../../views/items/cards/cards-view.js';
import UserHomeView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/homes/user-home-view.js';

export default CardsView.extend({

	//
	// attributes
	//

	childView: UserHomeView,

	//
	// rendering methods
	//
	
	childViewOptions: function() {
		return {

			// options
			//
			countries: this.options.countries,

			// capabilities
			//
			selectable: this.options.selectable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropon: this.options.ondropon,
			ondropout: this.options.ondropout,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}; 
	},

	onRender: function() {
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	}
});
