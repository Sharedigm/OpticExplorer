/******************************************************************************\
|                                                                              |
|                           user-publications-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a collection of user publications.      |
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
import UserBookView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/publications/user-book-view.js';
import UserArticleView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/publications/user-article-view.js';
import UserPatentView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/items/publications/user-patent-view.js';

export default CardsView.extend({

	//
	// rendering methods
	//
	
	childView: function(item) {
		let attributes = Object.keys(item.attributes);

		// find publication type
		//
		if (attributes.includes('isbn_number')) {
			return UserBookView;
		} else if (attributes.includes('issn_number')) {
			return UserArticleView;
		} else if (attributes.includes('patent_number')) {
			return UserPatentView;
		} else {

			// show error message
			//
			application.error({
				message: "Invalid publication found."
			});
		}
	},

	childViewOptions: function() {
		return {

			// options
			//
			countries: this.options.countries,
			expanded: this.options.expanded,

			// capabilities
			//
			expandable: this.options.expandable,
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
