/******************************************************************************\
|                                                                              |
|                                comment-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single comment.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../models/connections/connection.js';
import Reply from '../../../models/comments/reply.js';
import UserPreferences from '../../../models/preferences/user-preferences.js';
import Items from '../../../collections/storage/items.js';
import ModelView from '../../../views/items/model-view.js';
import Collapsable from '../../../views/behaviors/expanders/collapsable.js';
import Selectable from '../../../views/behaviors/selection/selectable.js';
import FilesView from '../../../views/apps/file-browser/mainbar/files/files-view.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import ImageGalleryView from '../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-view.js';
import ReplyFormView from '../../../views/comments/replies/forms/reply-form-view.js';
import HtmlUtils from '../../../utilities/web/html-utils.js';
import Browser from '../../../utilities/web/browser.js';

export default ModelView.extend(_.extend({}, Collapsable, Selectable, FileDownloadable, {

	//
	// attributes
	//

	className: 'collapsable comment',

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

	// image attributes
	//
	thumbnailSize: 25,
	maxImageSize: 300,

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
		if (this.options.unlikeable == undefined) {
			this.options.unlikeable = this.model.isUnlikeableByCurrentUser();
		}
		if (this.options.dislikeable == undefined) {
			this.options.dislikeable = false;
		}
		if (this.options.replyable == undefined) {
			this.options.replyable = true;
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
		return this.getTop() != null;
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
		return this.getParentView('posts') || this.getParentView('post') || this.getParentView('comments');
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

		// check if we can edit this comment
		//
		if (!this.model.isOwnedBy(application.session.user)) {
			return;
		}

		this.showEditCommentDialogView();
	},

	openImage: function(imageFile) {
		application.launch('image_viewer', {
			model: imageFile,
			collection: new Items([imageFile]),
			defaults: {
				show_sidebar: false
			}
		});
	},

	//
	// methods
	//

	like: function() {
		this.model.like({

			// callbacks
			//
			success: () => {

				// update
				//
				this.updateLikesBadge();
				this.$el.find('> form > .info .buttons .like').hide();
			}
		});
	},

	edit: function() {
		this.open();
	},

	reply: function() {
		if (Browser.device == 'phone') {
			this.showAddReplyDialog();
		} else {
			this.showAddReplyForm();
		}
	},

	//
	// list methods
	//

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
				title: "Delete Comment",
				message: message? "Are you sure you want to delete the comment " + '"' +
					message + '"?' : "Are you sure you want to delete this comment?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete comment
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

	onRender: function() {
		this.app = this.getParentView('app') || application;

		// arrange photos in gallery
		//
		this.$el.find('.gallery').jpictura(this.options.gallery);

		// collapse
		//
		if (this.options.collapsed) {
			this.collapse();
		}

		// show child views
		//
		if (this.get('attachments').hasItems('non_visual')) {
			this.showAttachments();
		}
		if (this.get('attachments').hasItems('visual')) {
			this.showGallery();
		}
		this.showNumReplies();
		this.showReplies();

		// select item
		//
		if (this.model.is(this.options.selected)) {
			this.select();
		}

		// add tooltip triggers
		//
		this.addTooltips({
			container: this.parent.$el
		});
	},
	
	showWhen: function() {
		application.launch('calendar', {
			date: this.get('created_at')
		});
	},
	
	showAttachments: function() {
		this.showChildView('attachments', new FilesView({
			collection: new Items(this.get('attachments').getItems('non_visual')),
			
			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: 'icons',
				detail_kind: null,
				show_hidden_files: true,
				sort_kind: null
			}),

			// capabilities
			//
			selectable: true,
			highlightable: false,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropout: this.options.ondropout
		}));
	},

	showInlineImage: function(attachment) {
		let url = attachment.getUrl({max_size: this.maxImageSize});
		let image = $('<img src="' + url + '"' + ' data-toggle="tooltip" data-placement="bottom" title="' + attachment.get('path') + '"' + '>');
		this.$el.find('.gallery').append(image);
	},

	showInlineVideo: function(attachment) {
		let url = attachment.getUrl({max_size: this.maxImageSize});
		let image = $('<video src="' + url + '"' + ' data-toggle="tooltip" data-placement="bottom" title="' + attachment.get('path') + '"' + 'controls>');
		this.$el.find('.gallery').append(image);
	},

	showGallery: function() {
		let attachments = this.get('attachments');

		if (attachments.numItems('visual') == 1) {

			// show visual attachment inline
			//
			if (attachments.numItems('image')) {
				this.showInlineImage(this.get('attachments').getItems('visual')[0]);
			} else if (attachments.numItems('video')) {
				this.showInlineVideo(this.get('attachments').getItems('video')[0]);
			}
		} else {

			// show gallery of image attachments
			//
			this.showChildView('gallery', new ImageGalleryView({
				collection: new Items(this.get('attachments').getItems('image')),
				max_size: this.maxImageSize,
				max_images: this.maxImages
			}));

			// show video attachments
			//
			let videos = this.get('attachments').getItems('video');
			for (let i = 0; i < videos.length; i++) {
				let attachment = videos[i];
				let url = attachment.getUrl({max_size: this.maxImageSize});
				let image = $('<video src="' + url + '"' + ' data-toggle="tooltip" data-placement="bottom" title="' + attachment.get('path') + '"' + 'controls>');
				this.$el.find('.gallery').append(image);
			}
		}
	},

	showNumReplies: function() {
		let replies = this.get('replies');
		let expander = this.$el.find('> .info > .specifics > .expander');

		if (!replies || replies.length == 0) {
			expander.find('.num-replies').empty();
			expander.hide();
		} else if (replies.length == 1) {
			expander.find('.num-replies').html('1 ' + '<span class="non-hideable">hidden</span>' + ' reply');
			expander.removeAttr('style');
		} else {
			expander.find('.num-replies').html(replies.length + ' ' + '<span class="non-hideable">hidden</span>' + ' replies');
			expander.removeAttr('style');
		}
	},

	showReplies: function() {
		import(
			'../../../views/comments/replies/replies-view.js'
		).then((RepliesView) => {

			// check if view still exists
			//
			if (this.isDestroyed()) {
				return;
			}

			// show replies list
			//
			this.showChildView('replies', new RepliesView.default({
				collection: this.get('replies'),

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

			// listen for changes to number of replies
			//
			this.listenTo(this.get('replies'), 'add, remove', () => {
				this.showNumReplies();
			});
		});
	},

	//
	// dialog rendering methods
	//

	showEditCommentDialogView() {
		import(
			'../../../views/comments/dialogs/edit-comment-dialog-view.js'
		).then((EditCommentDialogView) => {

			// show edit comment dialog
			//
			this.app.show(new EditCommentDialogView.default({
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

	showAddReplyDialog: function() {
		import(
			'../../../views/comments/replies/dialogs/add-reply-dialog-view.js'
		).then((AddReplyDialogView) => {

			// show add reply dialog
			//
			application.show(new AddReplyDialogView.default({

				// options
				//
				comment: this.model,
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: (model) => this.addNewReply(model)
			}));
		});
	},

	showAddReplyForm: function() {
		this.deselect();
		
		// collapse list
		//
		if (this.options.autocollapse) {
			this.collapse();
		}

		// hide reply button
		//
		this.$el.find('.buttons .reply').hide();

		// show add reply form
		//
		this.showReplyForm();

		// scroll into view
		//
		if (this.options.autoscroll && !this.getChildView('reply').inView(true)) {
			this.getChildView('reply').el.scrollIntoView(false);
		}
	},

	showReplyForm: function() {
		this.showChildView('reply', new ReplyFormView({
			model: new Reply({
				comment_id: this.get('id'),
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

	updateLikesBadge: function() {
		let numLikes = this.get('num_likes');
		let likes = this.get('likes');
		let badge = this.$el.find('> .info .likes.badge');

		// update badge
		//
		badge.attr('data-original-title', 'Liked by ' + likes.join(', '));
		badge.find('.num-likes').text(numLikes);

		// show / hide badge
		//
		if (numLikes) {
			badge.show();
		} else {
			badge.hide();
		}
	},

	//
	// dialog rendering methods
	//

	showUser: function() {
		new Connection({
			id: this.get('user').get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {

				// show connection's profile info
				//
				application.showUser(model);	
			}
		});
	},

	//
	// form event handling methods
	//

	onSubmit: function(reply) {

		// remove add reply form
		//
		this.getRegion('reply').reset();

		// show reply button
		//
		this.$el.find('.buttons .reply').show();

		// update
		//
		this.addNewReply(reply);
	},

	onCancel: function() {

		// show reply button
		//
		this.$el.find('.buttons .reply').show();

		// expand list
		//
		if (this.options.autocollapse) {
			this.expand();
		}
	},

	//
	// mouse event handling methods
	//

	onClickUser: function(event) {
		this.showUser();

		// block event from parent
		//
		this.block(event);
	},
	
	onClickWhen: function(event) {
		this.showWhen();

		// block event from parent
		//
		this.block(event);
	},

	onClickLike: function(event) {
		this.like();

		// block event from parent
		//
		this.block(event);
	},

	onClickEdit: function(event) {
		if (this.model.isOwnedBy(application.session.user)) {
			this.edit();
		}

		// block event from parent
		//
		this.block(event);
	},
	
	onClickReply: function(event) {
		this.reply();

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

	onClickGalleryImage: function(event) {
		let attachment = this.get('attachments').getItems('image')[0];
		this.openImage(attachment);

		// block event from parent
		//
		this.block(event);
	},

	onClickLink: function(event) {
		if (event.target.href) {
			application.showUrl(event.target.href);
		}

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
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('reply')) {
			this.getChildView('reply').onKeyDown(event);
		}
		if (this.hasChildView('replies')) {
			this.getChildView('replies').onKeyDown(event);
		}
	}
}));
