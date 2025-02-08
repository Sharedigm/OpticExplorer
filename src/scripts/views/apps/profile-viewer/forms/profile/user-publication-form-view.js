/******************************************************************************\
|                                                                              |
|                        user-publication-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's publication info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserBook from '../../../../../models/users/profile/publications/user-book.js';
import UserArticle from '../../../../../models/users/profile/publications/user-article.js';
import UserPatent from '../../../../../models/users/profile/publications/user-patent.js';
import FormView from '../../../../../views/forms/form-view.js';
import UserBookFormView from '../../../../../views/apps/profile-viewer/forms/profile/publications/books/user-book-form-view.js';
import UserArticleFormView from '../../../../../views/apps/profile-viewer/forms/profile/publications/articles/user-article-form-view.js';
import UserPatentFormView from '../../../../../views/apps/profile-viewer/forms/profile/publications/patents/user-patent-form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<form class="form-horizontal">
			<div class="publication-kind form-group">
				<label class="control-label"><i class="fa fa-question"></i>Publication kind</label>
				<div class="controls">
					<select>
						<option value="book"<% if (publication_kind == 'book') { %> selected<% } %>>Book</option>
						<option value="article"<% if (publication_kind == 'article') { %> selected<% } %>>Article</option>
						<option value="patent"<% if (publication_kind == 'patent') { %> selected<% } %>>Patent</option>
					</select>
				</div>
			</div>
		</form>
		
		<div class="user-book-form"<% if (publication_kind != 'book') { %> style="display:none"<% } %>></div>
		<div class="user-article-form"<% if (publication_kind != 'article') { %> style="display:none"<% } %>></div>
		<div class="user-patent-form"<% if (publication_kind != 'patent') { %> style="display:none"<% } %>></div>
	`),

	regions: {
		book: '.user-book-form',
		article: '.user-article-form',
		patent: '.user-patent-form'
	},

	events: _.extend({}, FormView.prototype.events, {
		'change .publication-kind select': 'onChangePublicationKind'
	}),

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.publication_kind == undefined) {
			this.options.publication_kind = 'book';
		}
		if (this.options.user_book == undefined) {
			this.options.user_book = new UserBook();
		}
		if (this.options.user_article == undefined) {
			this.options.user_article = new UserArticle();
		}
		if (this.options.user_patent == undefined) {
			this.options.user_patent = new UserPatent();
		}
	},

	//
	// getting methods
	//

	getKind: function() {
		return this.$el.find('.publication-kind option:selected').val();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			publication_kind: this.options.publication_kind
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('book', new UserBookFormView({
			model: this.options.user_book
		}));
		this.showChildView('article', new UserArticleFormView({
			model: this.options.user_article
		}));
		this.showChildView('patent', new UserPatentFormView({
			model: this.options.user_patent
		}));
	},

	//
	// form validating methods
	//

	isValid: function() {
		switch (this.getKind()) {
			case 'book':
				return this.getChildView('book').isValid();
			case 'article':
				return this.getChildView('article').isValid();
			case 'patent':
				return this.getChildView('patent').isValid();
		}
	},

	//
	// form methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}
		
		// submit form
		//
		switch (this.getKind()) {
			case 'book':
				return this.getChildView('book').submit(options);
			case 'article':
				return this.getChildView('article').submit(options);
			case 'patent':
				return this.getChildView('patent').submit(options);
		}
	},

	//
	// event handling methods
	//

	onChangePublicationKind: function() {
		switch (this.getKind()) {
			case 'book':
				this.getRegion('book').$el.show();
				this.getRegion('article').$el.hide();
				this.getRegion('patent').$el.hide();
				break;
			case 'article':
				this.getRegion('book').$el.hide();
				this.getRegion('article').$el.show();
				this.getRegion('patent').$el.hide();
				break;
			case 'patent':
				this.getRegion('book').$el.hide();
				this.getRegion('article').$el.hide();
				this.getRegion('patent').$el.show();
				break;
		}
	}
});
