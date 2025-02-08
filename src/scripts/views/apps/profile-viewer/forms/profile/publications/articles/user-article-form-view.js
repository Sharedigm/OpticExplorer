/******************************************************************************\
|                                                                              |
|                         user-article-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing info about a user's article.          |
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
import ArticleInfoFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/articles/article-info-form-view.js';
import ArticlePublisherFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/articles/article-publisher-form-view.js';
import ArticleDetailsFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/articles/article-details-form-view.js';

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
				this.showArticleInfo();
				break;
			case 'publisher':
				this.showArticlePublisher();
				break;
			case 'details':
				this.showArticleDetails();
				break;
		}
	},

	showArticleInfo: function() {
		this.showChildView('info', new ArticleInfoFormView({
			model: this.model
		}));
	},

	showArticlePublisher: function() {
		this.showChildView('publisher', new ArticlePublisherFormView({
			model: this.model
		}));
	},

	showArticleDetails: function() {
		this.showChildView('details', new ArticleDetailsFormView({
			model: this.model
		}));
	}
});