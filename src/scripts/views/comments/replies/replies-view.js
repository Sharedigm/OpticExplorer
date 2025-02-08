/******************************************************************************\
|                                                                              |
|                                replies-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a set of replies.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Reply from '../../../models/comments/reply.js';
import BaseView from '../../../views/base-view.js';
import Collapsable from '../../../views/behaviors/expanders/collapsable.js';
import RepliesListView from '../../../views/comments/replies/lists/replies-list-view.js';
import ReplyFormView from '../../../views/comments/replies/forms/reply-form-view.js';

export default BaseView.extend(_.extend({}, Collapsable, {

	//
	// attributes
	//

	className: 'collapsable replies',

	template: template(`
		<div class="replies-list"></div>
		<div class="new-reply"></div>
	`),
	
	regions: {
		list: {
			el: '.replies-list',
			replaceElement: true
		},
		add: {
			el: '.new-reply',
			replaceElement: false
		}
	},

	events: {
		'click > .header .expander': 'onClickExpander',
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
			this.options.collapsed = false;
		}
		if (this.options.replyable == undefined) {
			this.options.replyable = true;
		}
		if (this.options.closeable == undefined) {
			this.options.closeable = this.collection.length == 0;
		}

		// listen for changes to collection
		//
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// querying methods
	//

	hasTop: function() {
		return this.parent.hasTop();
	},

	//
	// getting methods
	//

	getTop: function() {
		return this.parent.getTop();
	},

	getHeading: function() {
		if (this.collection.length == 0) {
			return 'no replies';
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
	// editing methods
	//

	addReply: function(reply) {

		// add new reply to list
		//
		this.collection.add(reply);

		// update
		//
		this.onAdd();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// options
			//
			heading: this.getHeading(),

			// state
			//
			collapsed: this.options.collapsed,

			// capabilities
			//
			collapsable: this.options.collapsable,
			closeable: this.options.closeable,
			editable: this.options.editable,
			replyable: this.options.replyable
		};
	},

	onRender: function() {

		// show child views
		//
		this.showRepliesList();
		/*
		if (this.options.replyable) {
			this.showAddReplyForm();
		}
		*/

		if (this.options.collapsed) {
			this.$el.addClass('collapsed');
		}
	},
	
	showRepliesList: function() {
		
		// show child views
		//
		this.showChildView('list', new RepliesListView({
			collection: this.collection,

			// options
			//
			preferences: this.options.preferences,

			// state
			//
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

	showAddReplyForm: function() {
		this.showChildView('add', new ReplyFormView({
			model: new Reply(),

			// options
			//
			post: this.model,
			preferences: this.options.preferences,

			// callbacks
			//
			onsubmit: (model) => this.onSubmit(model),
			oncancel: (model) => this.onCancel(model)
		}));
	},

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

		// update
		//
		this.onChange();
	},

	onChange: function() {

		// update view
		//
		this.update();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// form event handling methods
	//

	onSubmit: function(reply) {

		// clear new reply form
		//
		this.getChildView('add').clear();

		// add reply to list
		//
		this.addReply(reply);
	},

	onCancel: function() {

		// show add reply button
		//
		this.$el.find('.header .add-btn').show();

		// expand list
		//
		if (this.options.autocollapse) {
			this.expand();
		}
	},

	onClickCollapse: function(event) {

		// collapse replies panel
		//
		this.collapse();

		// block event from parent
		//
		this.block(event);
	},

	onClickExpand: function(event) {

		// expand replies panel
		//
		this.expand();

		// block event from parent
		//
		this.block(event);
	},

	onClickClose: function(event) {

		// hide replies panel
		//
		this.$el.parent().hide();

		// block event from parent
		//
		this.block(event);
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
