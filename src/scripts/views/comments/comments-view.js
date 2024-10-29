/******************************************************************************\
|                                                                              |
|                               comments-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a set of comments.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Comment from '../../models/comments/comment.js';
import BaseView from '../../views/base-view.js';
import Comments from '../../collections/comments/comments.js';
import Collapsable from '../../views/behaviors/expanders/collapsable.js';
import CommentsListView from '../../views/comments/lists/comments-list-view.js';
import CommentFormView from '../../views/comments/forms/comment-form-view.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, Collapsable, {

	//
	// attributes
	//

	className: 'collapsable comments',

	template: template(`
		<div class="header info">
			<a class="expander">
				<i class="fa fa-comment"></i>
				<span class="fineprint"><%= heading %></span>
			</a>
		
			<div class="buttons">
				<% if (editable) { %>
				<button type="button" class="add-btn caution btn btn-sm" data-toggle="tooltip" title="Add Comment"<% if (closeable) { %> style="display:none"<% } %>>
					<i class="fa fa-plus"></i>	
				</button>
				<% } %>
				<button type="button" class="close-btn warning btn btn-sm" data-toggle="tooltip" title="Close"<% if (!closeable) { %> style="display:none"<% } %>>
					<i class="fa fa-xmark"></i>	
				</button>
			</div>
		</div>
		
		<div class="hideable">
			<div class="comments-list"></div>
			<div class="new-comment"></div>
		</div>
	`),

	regions: {
		list: {
			el: '.comments-list',
			replaceElement: true
		},
		add: {
			el: '.new-comment',
			replaceElement: false
		}
	},

	events: {
		'click > .header .expander': 'onClickExpander',
		'click > .header .add-btn': 'onClickAdd',
		'click > .header .close-btn': 'onClickClose'
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.collapsable == undefined) {
			this.options.collapsable = true;
		}
		if (this.options.collapsed == undefined) {
			this.options.collapsed = true;
		}
		if (this.options.commentable == undefined) {
			this.options.commentable = true;
		}
		if (this.options.closeable == undefined) {
			this.options.closeable = false;
		}

		// set attributes
		//
		if (!this.collection) {
			this.collection = new Comments();
		}

		// listen for changes to collection
		//
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('list')) {
			this.getChildView('list').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getHeading: function() {
		if (this.collection.length == 0) {
			return 'no comments';
		} else if (this.collection.length == 1) {
			return '1 ' + '<span class="non-hideable">hidden</span>' + ' comment';
		} else {
			return this.collection.length + ' ' + '<span class="non-hideable">hidden</span>' + ' comments';
		}
	},

	//
	// selecting methods
	//

	selectAll: function() {
		this.getChildView('list').selectAll();
	},

	deselectAll: function() {
		this.getChildView('list').deselectAll();
	},

	//
	// commenting methods
	//

	addNewComment: function(comment) {

		// add comment to list
		//
		this.addComment(comment);

		// play add sound
		//
		application.play('add');
	},

	addComment: function(comment) {

		// add comment to list
		//
		this.collection.add(comment);

		// expand to show all
		//
		this.expand();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// options
			//
			heading: this.getHeading(),
			collapsed: this.options.collapsed,

			// capabilities
			//
			collapsable: this.options.collapsable,
			closeable: this.options.closeable,
			editable: this.options.editable,
			commentable: this.options.commentable
		};
	},

	onRender: function() {

		// show child views
		//
		this.showCommentsList();
		/*
		if (this.options.commentable) {
			this.showAddCommentForm();
		}
		*/

		if (this.options.collapsed) {
			this.$el.addClass('collapsed');
		}
	},
	
	showCommentsList: function() {
		
		// show child views
		//
		this.showChildView('list', new CommentsListView({
			collection: this.collection,

			// options
			//
			features: this.options.features,
			preferences: this.options.preferences,
			collapsed: this.options.collapsed,
			selected: this.options.selected,

			// capabilities
			//
			collapsable: this.options.collapsable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}));
	},

	showAddCommentDialog: function() {
		import(
			'../../views/comments/dialogs/add-comment-dialog-view.js'
		).then((AddCommentDialogView) => {

			// show add comment dialog
			//
			application.show(new AddCommentDialogView.default({

				// options
				//
				post: this.model,
				features: this.options.features,
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: (model) => this.addNewComment(model)
			}));
		});
	},

	showAddCommentForm: function() {
		this.showChildView('add', new CommentFormView({
			model: new Comment({
				post_id: this.model.get('id')
			}),

			// options
			//
			focused: false,
			cancelable: true,
			features: this.options.features,
			preferences: this.options.preferences,

			// callbacks
			//
			onsubmit: (model) => this.onSubmit(model),
			oncancel: () => this.onCancel()
		}));

		// hide add comment button
		//
		this.$el.find('.header .add-btn').hide();
	},

	//
	// updating methods
	//

	update: function() {

		// update count
		//
		this.$el.find('> .header .fineprint').html(this.getHeading());

		// show / hide close button
		//
		if (this.collection.length > 0) {
			this.$el.find('.header .close-btn').hide();
		} else {
			this.$el.find('.header .close-btn').show();
			this.close();
		}
	},

	focus: function() {
		this.getChildView('add').focus();
	},

	//
	// closing methods
	//

	close: function() {
		this.$el.parent().hide();

		// perform callback
		//
		if (this.options.onclose) {
			this.options.onclose();
		}
	},

	//
	// form event handling methods
	//

	onSubmit: function(comment) {
		
		// remove add comment form
		//
		this.getChildView('add').destroy();

		// show add comment button
		//
		this.$el.find('.header .add-btn').show();

		// add new comment to list
		//
		this.addNewComment(comment);
	},

	onCancel: function() {

		// show add comment button
		//
		this.$el.find('.header .add-btn').show();

		// close if no comments
		//
		if (this.collection.length == 0) {
			this.close();
		}
	},

	//
	// list event handling methods
	//

	onAdd: function() {

		// update
		//
		this.onChange();
	},

	onRemove: function() {

		// perform callback
		//
		this.onChange();
	},

	onChange: function() {
		this.update();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onClickExpander: function() {
		this.toggleCollapse({
			// recursive: true
		});

		// perform callback
		//
		if (this.options.onExpand) {
			this.options.onExpand();
		}
	},

	onClickAdd: function() {
		if (Browser.device == 'phone') {
			this.showAddCommentDialog();
		} else {
			this.expand();
			this.showAddCommentForm();
			this.focus();

			// perform callback
			//
			if (this.options.onadd) {
				this.options.onadd();
			}
		}
	},

	onClickClose: function() {
		this.close();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('list')) {
			this.getChildView('list').onKeyDown(event);
		}
		if (this.hasChildView('add')) {
			this.getChildView('add').onKeyDown(event);
		}
	}
}));