/******************************************************************************\
|                                                                              |
|                           user-book-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing info about a user's school.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedFormView from '../../../../../../../views/forms/tabbed-form-view.js';
import BookInfoFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/books/book-info-form-view.js';
import BookPublisherFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/books/book-publisher-form-view.js';
import BookDetailsFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/books/book-details-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "Info",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "Publisher",
			"icon": "fa fa-book"
		},
		{
			"name": "Details",
			"icon": "fa fa-list"
		}
	],
	
	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'info':
				this.showBookInfo();
				break;
			case 'publisher':
				this.showBookPublisher();
				break;
			case 'details':
				this.showBookDetails();
				break;
		}
	},

	showBookInfo: function() {
		this.showChildView('info', new BookInfoFormView({
			model: this.model
		}));
	},

	showBookPublisher: function() {
		this.showChildView('publisher', new BookPublisherFormView({
			model: this.model
		}));
	},

	showBookDetails: function() {
		this.showChildView('details', new BookDetailsFormView({
			model: this.model
		}));
	}
});