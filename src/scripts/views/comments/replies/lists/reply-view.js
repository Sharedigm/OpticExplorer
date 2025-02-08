/******************************************************************************\
|                                                                              |
|                                reply-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single reply.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Reply from '../../../../models/comments/reply.js';
import CommentView from '../../../../views/comments/lists/comment-view.js';
import ReplyFormView from '../../../../views/comments/replies/forms/reply-form-view.js';
import HtmlUtils from '../../../../utilities/web/html-utils.js';

export default CommentView.extend({

	//
	// attributes
	//

	className: 'collapsable reply',

	template: template(`
		<div class="small tile">
			<% if (is_current) { %>
			<% if (thumbnail_url) { %>
			<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)">
				<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
				<i class="placeholder far fa-user"></i>
			</div>
			<% } else { %>
			<div class="thumbnail">
				<i class="fa fa-user"></i>
			</div>
			<% } %>
			<% } else { %>
			<a class="user">
				<% if (thumbnail_url) { %>
				<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)">
					<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
				<% } %>
			</a>
			<% } %>
		</div>
		
		<div class="info">
			<div class="comment-bubble lower right<% if (has_images && num_images > 1) { %> block<% } %>">
				<div class="comment-inner">
					<div class="title">	
						<span class="name">
							<% if (is_current) { %>you<% } else { %><a class="user"><%= name %></a><% } %>
						</span>	
					</div>
					<span class="message"><%= message %></span>
		
					<% if (has_files) { %>
					<div class="file-attachments"></div>
					<% } %>
					<% if (has_images) { %>
					<div class="image-attachments">
						<div class="gallery"></div>
					</div>
					<% } %>
				</div>
				<div class="comment-arrow"></div>
			</div>
		
			<div class="fineprint specifics">
				<a class="when">
					<i class="fa fa-calendar-alt" data-toggle="tooltip" data-placement="top" title="<%= created_at.format('fullDate') %>" style="margin-right:5px"></i><%= when %>
				</a>
		
				<span class="badges">
					<div class="likes success badge" data-toggle="tooltip" data-placement="top" title="Liked by <%= likes %>"<% if (num_likes == 0) { %> style="display:none"<% } %>>
						<i class="fa fa-thumbs-up"></i>
						<span class="num-likes"><%= num_likes %></span>
					</div>
				</span>
		
				<div class="options buttons">
					<% if (collapsable) { %>
					<span class="expander">
						<button type="button" class="expand btn-sm" data-toggle="tooltip" title="Expand">
							<i class="fa fa-caret-down"></i>	
						</button>
						<button type="button" class="collapse btn-sm" data-toggle="tooltip" title="Collapse">
							<i class="fa fa-caret-up"></i>
						</button>
					</span>
					<% } %>
		
					<% if (likeable) { %>
					<button type="button" class="like success btn btn-sm" data-toggle="tooltip" data-placement="top" title="Like">
						<i class="fa fa-thumbs-up"></i>	
					</button>
					<% } %>
		
					<% if (unlikeable) { %>
					<button type="button" class="unlike success btn btn-sm" data-toggle="tooltip" data-placement="top" title="Unlike">
						<i class="fa fa-thumbs-o-up"></i>	
					</button>
					<% } %>
		
					<% if (dislikeable) { %>
					<button type="button" class="dislike warning btn btn-sm" data-toggle="tooltip" data-placement="top" title="Dislike">
						<i class="fa fa-thumbs-down"></i>	
					</button>
					<% } %>
		
					<% if (editable) { %>
					<button type="button" class="success edit btn btn-sm" data-toggle="tooltip" data-placement="top" title="Edit">
						<i class="fa fa-pencil-alt"></i>	
					</button>
					<% } %>
		
					<% if (replyable) { %>
					<button type="button" class="reply caution btn btn-sm" data-toggle="tooltip" data-placement="top" title="Reply">
						<i class="fa fa-reply"></i>	
					</button>
					<% } %>
		
					<% if (editable) { %>
					<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">
						<i class="fa fa-xmark"></i>	
					</button>
					<% } %>
				</div>
		
				<span class="expander" style="display:none">
					<a><i class="fa fa-reply"></i><span class="num-replies"></span></a>
				</span>
			</div>
		</div>
		
		<div class="hideable">
			<div class="replies"></div>
		</div>
		
		<div class="new-reply"></div>
	`),

	regions: {
		attachments: '.file-attachments',
		gallery: '> .info .gallery',
		replies: {
			el: '> .hideable .replies',
			replaceElement: true
		},
		reply: '> .new-reply'
	},

	events: {

		// mouse events
		//
		'mousedown > .info .comment-bubble': 'onMouseDown',
		'click > .tile .user': 'onClickUser',
		'click > .info .user': 'onClickUser',
		'click > .info .when': 'onClickWhen',
		'click > .info .expander': 'onClickExpander',
		'click > .info .buttons .like': 'onClickLike',
		'click > .info .buttons .edit': 'onClickEdit',
		'click > .info .buttons .reply': 'onClickReply',
		'click > .info .buttons .delete': 'onClickDelete',
		'click > .info .gallery > img': 'onClickGalleryImage',
		'click > .info .comment-bubble a': 'onClickLink',
		'dblclick > .info .comment-bubble': 'onDoubleClickComment',

		// touch events
		//
		'tap > .info .comment-bubble': 'onTap'
	},

	allow_nested_replies: true,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.selectable == undefined) {
			this.options.selectable = true;
		}
		if (this.options.collapsable == undefined) {
			this.options.collapsable = false;
		}
		if (this.options.collapsed == undefined) {
			this.options.collapsed = false;
		}
		if (this.options.likeable == undefined) {
			this.options.likeable = this.model.isLikeableByCurrentUser();
		}
		if (this.options.dislikeable == undefined) {
			this.options.dislikeable = false;
		}
		if (this.options.replyable == undefined) {
			this.options.replyable = this.allow_nested_replies;
		}
		if (this.options.autocollapse == undefined) {
			this.options.autocollapse = false;
		}
		if (this.options.autoscroll == undefined) {
			this.options.autoscroll = true;
		}
	},

	//
	// querying methods
	//

	isOwned: function() {
		return this.model.isOwnedBy(application.session.user);
	},

	hasTop: function() {
		return this.parent.hasTop();
	},

	//
	// getting methods
	//

	getReplies: function() {
		let replies = this.get('replies');
		if (!replies || replies.length == 0) {
			return;
		} else if (replies.length == 1) {
			return '1 ' + '<span class="non-hideable">hidden</span>' + ' reply';
		} else {
			return replies.length + ' ' + '<span class="non-hideable">hidden</span>' + ' replies';
		}
	},

	getTop: function() {
		return this.parent.getTop();
	},

	getThumbnailUrl: function() {
		return this.get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// opening methods
	//

	open: function() {

		// check if we can edit this reply
		//
		if (!this.model.isOwnedBy(application.session.user)) {
			return;
		}

		import(
			'../../../../views/comments/replies/dialogs/edit-reply-dialog-view.js'
		).then((EditReplyDialogView) => {

			// show edit reply dialog
			//
			this.app.show(new EditReplyDialogView.default({
				model: this.model,

				// options
				//
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: () => this.render()
			}));
		});
	},

	addNewReply: function(reply) {

		// add to list
		//
		this.addReply(reply);

		// play add sound
		//
		application.play('add');
	},

	addReply: function(reply) {

		// add reply to list
		//
		this.get('replies').add(reply);

		// update view
		//
		this.showReplies();
		this.showNumReplies();
		this.expand();
	},

	edit: function() {
		this.open();
	},

	delete: function(options) {
		
		// check if we need to confirm
		//
		if (!options || options.confirm != false) {
			let message = this.model.get('message');

			// format / limit message
			//
			if (message) {
				message = HtmlUtils.htmlToText(message || '').firstWords(15);
			}

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Reply",
				message: message? "Are you sure you want to delete the reply " + '"' +
					message + '"?' : "Are you sure you want to delete this reply?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete reply
			//
			this.model.destroy(options);

			// play remove sound
			//
			application.play('remove');
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// options
			//
			href: application.getUrl() + '#users/' + this.get('user').get('id'),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			name: this.get('user').get('short_name'),
			message: HtmlUtils.returnify(HtmlUtils.linkify(this.get('message'))),

			// state
			//
			is_current: this.get('user').isCurrent(),
			collapsed: this.options.collapsed,

			// details
			//
			likes: this.has('likes')? this.get('likes').join(', ') : undefined,
			has_files: this.get('attachments').hasItems('non_visual'),
			has_images: this.get('attachments').hasItems('visual'),
			num_images: this.get('attachments').numItems('visual'),
			when: this.model.when(),

			// capabilities
			//
			collapsable: false,
			editable: this.options.editable && this.isOwned(),
			likeable: this.options.likeable && this.options.editable,
			unlikeable: this.options.unlikeable && this.options.editable,
			dislikeable: this.options.dislikeable && this.options.editable,
			replyable: this.options.replyable && this.options.editable
		};
	},

	showReplyForm: function() {
		this.showChildView('reply', new ReplyFormView({
			model: new Reply({
				reply_id: this.get('id'),
			}),

			// options
			//
			preferences: this.options.preferences,

			// callbacks
			//
			onsubmit: (model) => this.onSubmit(model),
			oncancel: () => this.onCancel()
		}));
	},

	showAddReplyDialog: function() {
		import(
			'../../../../views/comments/replies/dialogs/add-reply-dialog-view.js'
		).then((AddReplyDialogView) => {

			// show add reply dialog
			//
			application.show(new AddReplyDialogView.default({

				// options
				//
				reply: this.model,
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: (model) => this.addNewReply(model)
			}));
		});
	},

	//
	// form handling methods
	//

	onSubmit: function(reply) {

		// remove add reply form
		//
		this.getRegion('reply').reset();

		// show reply button
		//
		this.$el.find('.buttons .reply').show();

		// add to list
		//
		this.addNewReply(reply);
	},

	//
	// mouse event handling methods
	//

	onClickEdit: function(event) {
		this.edit();

		// block event from parent
		//
		this.block(event);
	},

	onClickDelete: function(event) {
		this.delete();

		// block event from parent
		//
		this.block(event);
	},

	onDoubleClickComment: function(event) {
		if (this.model.isOwnedBy(application.session.user)) {
			this.edit();
		}

		// block event from parent
		//
		this.block(event);
	}
});
