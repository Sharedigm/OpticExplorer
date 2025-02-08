/******************************************************************************\
|                                                                              |
|                                 post-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single posts list item.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../../../models/connections/connection.js';
import Topic from '../../../../../models/topics/topic.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Items from '../../../../../collections/storage/items.js';
import ModelView from '../../../../../views/items/model-view.js';
import Collapsable from '../../../../../views/behaviors/expanders/collapsable.js';
import Selectable from '../../../../../views/behaviors/selection/selectable.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import FileDownloadable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import ImageGalleryView from '../../../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-view.js';
import CommentsView from '../../../../../views/comments/comments-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/jpictura/js/jpictura.js';

export default ModelView.extend(_.extend({}, Collapsable, Selectable, FileDownloadable, {

	//
	// attributes
	//

	className: 'post panel item',

	template: template(`
		<div class="tile">
			<% if (is_current) { %>
			<span class="user">
				<% if (thumbnail_url) { %>
				<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)">
					<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
			</span>
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
			<div class="heading">
		
				<% if (likeable || unlikeable || dislikeable || editable || commentable) { %>
				<div class="optional options buttons">
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
					<button type="button" class="like success btn btn-sm" data-toggle="tooltip" title="Like">
						<i class="fa fa-thumbs-up"></i>	
					</button>
					<% } %>
		
					<% if (unlikeable) { %>
					<button type="button" class="unlike success btn btn-sm" data-toggle="tooltip" title="Unlike">
						<i class="fa fa-thumbs-o-up"></i>	
					</button>
					<% } %>
		
					<% if (dislikeable) { %>
					<button type="button" class="dislike warning btn btn-sm" data-toggle="tooltip" title="Like">
						<i class="fa fa-thumbs-down"></i>	
					</button>
					<% } %>
		
					<% if (editable) { %>
					<button type="button" class="edit success btn btn-sm" data-toggle="tooltip" title="Edit">
						<i class="fa fa-pencil-alt"></i>	
					</button>
					<% } %>
		
					<% if (commentable) { %>
					<button type="button" class="comment caution btn btn-sm" data-toggle="tooltip" title="Comment"<% if (comments && comments.length > 0) { %> style="display:none"<% } %>>
						<i class="fa fa-comment"></i>	
					</button>
					<% } %>
		
					<% if (editable) { %>
					<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" title="Delete">
						<i class="fa fa-xmark"></i>	
					</button>
					<% } %>
				</div>
				<% } %>
				
				<div class="title">
					<div class="name">
						<% if (is_current) { %>
						you
						<% } else { %>
						<a class="user"><%= name %></a>
						<% } %>
					</div>
				</div>
		
				<div class="details fineprint">
					<div class="badges">
						<div class="likes success badge" data-toggle="tooltip" title="Liked by <%= likes %>" data-placement="top"<% if (num_likes == 0) { %> style="display:none"<% } %>>
							<i class="fa fa-thumbs-up"></i>
							<span class="count"><%= num_likes %></span>
						</div>
		
						<div class="num-comments caution badge" data-toggle="tooltip" title="<%= comments.length + ' ' + (comments.length == 1? 'comment' : 'comments') %>" data-placement="top"<% if (comments.length == 0) { %> style="display:none"<% } %>>
							<i class="fa fa-comment"></i>
							<span class="count"><%= comments.length %></span>
						</div>
					</div>
		
					<% if (public) { %>
					<div class="who">
						<i class="fa fa-globe" data-toggle="tooltip" title="Public" data-placement="top"></i>
					</div>
					<% } %>
		
					<% if (typeof topic_name != 'undefined' && topic_name) { %>
					<a class="what">
						<i class="fa fa-hashtag"></i>
						<%= topic_name %>
					</a>
					<% } %>
		
					<% if (typeof created_at != 'undefined') { %>
					<a class="when">
						<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>" data-placement="top"></i>
						<% if (show_elapsed_time) { %>
						<span class="elapsed-time"><%= when %></span>
						<% } %>
					</a>
					<% } %>
		
					<% if (typeof check_in != 'undefined' && check_in) { %>
					<a class="where">
						<i class="fa fa-map-marker-alt"></i>
						<%= check_in.get('name') %>
					</a>
					<% } %>
				</div>
			</div>
		
			<% if (message) { %>
			<div class="comment-bubble lower right">
				<span class="comment-inner"><%= message %></span>
				<div class="comment-arrow"></div>
			</div>
			<% } %>
		</div>
		
		<div class="file-attachments"></div>
		
		<div class="image-attachments">
			<div class="gallery">
				<div class="images"></div>
			</div>
		</div>
				
		<div class="comments panel"<% if (comments.length == 0) { %> style="display:none"<% } %>></div>
	`),
	
	regions: {
		attachments: {
			el: '.file-attachments',
			replaceElement: true
		},
		gallery: {
			el: '.gallery',
			replaceElement: true
		},
		comments: '.comments',
		form: '.new-comment'
	},

	events: {

		// mouse events
		//
		'mousedown > .info > .comment-bubble': 'onMouseDown',
		'mousedown > .tile .user': 'onMouseDown',
		'mousedown': 'onMouseDownBackground',

		'click > .tile a.user': 'onClickUser',
		'click > .info .user': 'onClickUser',
		'click > .info .what': 'onClickWhat',
		'click > .info .when': 'onClickWhen',
		'click > .info .where': 'onClickWhere',
		'click > .info .expander': 'onClickExpander',
		'click > .info .num-comments': 'onClickNumComments',
		'click > .info .buttons .like': 'onClickLike',
		'click > .info .buttons .edit': 'onClickEdit',
		'click > .info .buttons .comment': 'onClickComment',
		'click > .info .buttons .delete': 'onClickDelete',
		'click > .info .comment-bubble a': 'onClickLink',
		'click > .image-attachments > .gallery > .images > img': 'onClickGalleryImage',

		'dblclick > .info': 'onDoubleClick',
		'dblclick > .info .comment-bubble': 'onDoubleClickComment',
		
		// touch events
		//
		'tap > .info > .comment-bubble': 'onTap'
	},

	// image attributes
	//
	thumbnailSize: 50,
	maxImageSize: 512,
	maxImages: 6,

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
			this.options.collapsed = true;
		}
		if (this.options.commentable == undefined) {
			this.options.commentable = true;
		}
		if (this.options.editable == undefined) {
			this.options.editable = true;
		}
		if (this.options.likeable == undefined && this.model) {
			this.options.likeable = this.model.isLikeableByCurrentUser();
		}
		if (this.options.unlikeable == undefined && this.model) {
			this.options.unlikeable = this.model.isUnlikeableByCurrentUser();
		}
		if (this.options.dislikeable == undefined) {
			this.options.dislikeable = false;
		}
		if (this.options.autoscroll == undefined) {
			this.options.autoscroll = true;
		}

		// listen for model changes
		//
		this.listenTo(this.model, 'change', this.render, this);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		// callback(this, options);
		if (this.hasChildView('comments')) {
			this.getChildView('comments').each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	isOwned: function() {
		return this.model.isOwnedBy(application.session.user);
	},

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return this.model? this.model.get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		}) : undefined;
	},

	//
	// setting methods
	//

	setCollapsed: function(collapsed) {
		if (collapsed) {
			this.$el.find('.collapsable').addClass('collapsed');
		} else {
			this.$el.find('.collapsed').removeClass('collapsed');
		}
	},

	//
	// selecting methods
	//

	select: function(options) {

		// call mixin method
		//
		Selectable.select.call(this, options);

		// set dom attributes
		//
		if (this.model.isOwnedBy(application.session.user)) {
			this.$el.attr('draggable', true);
		}
	},

	deselect: function(options) {

		// call mixin method
		//
		Selectable.deselect.call(this, options);

		// deselect child views
		//
		this.$el.find('.selected').removeClass('selected');

		// set dom attributes
		//
		this.$el.removeAttr('draggable');
	},

	deselectAll: function() {

		// deselect post
		//
		this.$el.removeClass('selected');

		// deselect post comments
		//
		this.$el.find('.selected').removeClass('selected');
	},

	//
	// opening methods
	//

	open: function() {
		this.edit();
	},

	openImage: function(imageFile) {
		application.launch('image_viewer', {
			model: imageFile,
			collection: new Items([imageFile]),
			/*
			defaults: {
				show_sidebar: false
			}
			*/
		});
	},

	openDirectory: function(directory) {
		application.launch('file_browser', {
			model: directory
		});
	},

	//
	// editing methods
	//

	like: function() {
		this.model.like({

			// callbacks
			//
			success: () => {

				// update
				//
				this.updateLikesBadge();
				this.$el.find('> .info .buttons .like').hide();
			}
		});
	},

	edit: function() {

		// check if we can edit this post
		//
		if (this.model.isOwnedBy(application.session.user)) {
			this.showEditDialog();
		}
	},

	reply: function() {
		if (Browser.device == 'phone') {
			this.showAddCommentDialog();
		} else {
			this.showAddCommentForm();
		}
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
				title: "Delete Post",
				message: message? "Are you sure you want to delete the post " + '"' +
					message + '"?' : "Are you sure you want to delete this post?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete post
			//
			this.model.destroy(_.extend({}, options, {

				// callbacks
				//
				success: () => {

					// perform callback
					//
					if (this.parent && this.parent.onDelete) {
						this.parent.onDelete();
					}
				}
			}));
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// attributes
			//
			href: this.model? application.getUrl() + '#users/' + this.model.get('user').get('id') : undefined,
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			is_current: this.model? this.model.get('user').isCurrent() : undefined,
			name: this.model? this.model.get('user').get('short_name') : undefined,
			message: this.model? HtmlUtils.returnify(HtmlUtils.linkify(this.model.get('message'))) : undefined,

			// details
			//
			likes: this.model && this.model.has('likes')? this.model.get('likes').join(', ') : undefined,
			comments: this.model && this.model.has('comments')? this.model.get('comments') : [],
			num_likes: this.model && this.model.has('likes')? this.model.get('likes').length : undefined,
			when: this.model? this.model.when() : undefined,
			public: this.model? this.model.get('public') : undefined,

			// options
			//
			show_elapsed_time: this.options.preferences? this.options.preferences.get('show_elapsed_time') : true,

			// state
			//
			collapsed: this.options.collapsed,

			// capabilities
			//
			collapsable: false,
			editable: this.options.editable && this.isOwned(),
			likeable: this.options.likeable && this.options.editable,
			unlikeable: this.options.unlikeable && this.options.editable,
			dislikeable: this.options.dislikeable & this.options.editable,
			commentable: this.options.commentable && this.options.editable
		};
	},

	onRender: function() {
		this.app = this.getParentView('app') || application;

		// show attachments
		//
		if (this.has('attachments')) {
			if (this.get('attachments').hasItems('non_visual')) {
				this.showAttachments();
			}
			if (this.get('attachments').hasItems('visual')) {
				this.showGallery();
			}
		}

		// show child views
		//
		this.showComments();

		// hide comment button
		//
		/*
		if (this.get('comments').length != 0) {
			this.$el.find('button.comment').hide();
		}
		*/

		// add tooltip triggers
		//
		this.addTooltips();
	},

	show: function(view) {
		application.show(view);
	},

	showWhat: function() {
		new Topic({
			id: this.model.get('topic_id')
		}).fetch({

			// callbacks
			//
			success: (model) => this.showTopicInfo(model)
		});
	},

	showWhen: function() {
		application.launch('calendar', {
			date: this.get('created_at')
		});
	},

	showWhere: function() {
		application.launch('map_viewer', {
			place: this.get('check_in').toPlace()
		});
	},

	//
	// attachment rendering methods
	//

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
			draggable: false,
			editable: false,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropout: this.options.ondropout
		}));
	},

	//
	// image gallery rendering methods
	//

	addGalleryImage: function(attributes) {
		let image = $('<img>').attr(attributes);
		this.$el.find('.gallery .images').append(image);
	},

	addGalleryVideoControls: function(attributes) {
		let video = $('<video controls>').attr(attributes);
		this.$el.find('.gallery .images').append(video);
	},

	showInlineImage: function(attachment) {
		let url = attachment.getUrl({
			max_size: this.maxImageSize
		});
		let resolution = attachment.get('resolution');
		if (resolution) {
			this.addGalleryImage({
				src: url,
				class: resolution[0] >= resolution[1]? 'horizontal' : 'vertical',
				title: attachment.get('path'),
				width: resolution[0],
				height: resolution[1],
				'data-toggle': 'tooltip',
				'data-placement': 'bottom'
			});
		} else {
			this.addGalleryImage({
				src: url,
				title: attachment.get('path'),
				'data-toggle': 'tooltip',
				'data-placement': 'bottom'
			});
		}
	},

	showInlineVideo: function(attachment) {
		let url = attachment.getUrl({
			max_size: this.maxImageSize
		});
		let resolution = attachment.get('resolution');
		if (resolution) {
			this.addGalleryVideoControls({
				src: url,
				class: resolution[0] > resolution[1]? 'horizontal' : 'vertical',
				title: attachment.get('path'),
				'data-toggle': 'tooltip',
				'data-placement': 'bottom'
			});
		} else {
			this.addGalleryVideoControls({
				src: url,
				title: attachment.get('path'),
				'data-toggle': 'tooltip',
				'data-placement': 'bottom'
			});
		}
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
			let photos = this.get('attachments').getItems('image');
			if (photos.length > 0) {
				this.showChildView('gallery', new ImageGalleryView({
					collection: new Items(photos),

					// options
					//
					max_size: this.maxImageSize,
					max_images: this.maxImages,

					// callbacks
					//
					onselect: this.options.onselect,
					onopen: this.options.onopen
				}));
			}

			// show video attachments
			//
			let videos = this.get('attachments').getItems('video');
			for (let i = 0; i < videos.length; i++) {
				let attachment = videos[i];
				let url = attachment.getUrl({
					max_size: this.maxImageSize
				});
				this.$el.find('.gallery').append($('<video controls>').attr({
					src: url,
					title: attachment.get('path'),
					'data-toggle': 'tooltip',
					'data-placement': 'bottom'
				}));
			}
		}
	},

	showComments: function(options) {
		this.showChildView('comments', new CommentsView(_.extend({
			model: this.model,
			collection: this.get('comments'),

			// options
			//
			preferences: this.options.preferences,

			// state
			//
			collapsed: this.options.collapsed,
			selected: this.options.selected,

			// capabilities
			//
			editable: this.options.editable,
			commentable: false,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			
			// callback functions
			//
			onchange: () => {
				this.deselect();
				this.updateCommentsBadge();
			},
			onclose: () => this.showCommentButton()
		}, options)));
	},

	expandComments: function() {

		// check if this post has comments
		//
		if (!this.hasRegion('comments')) {
			return;
		}

		// expand comment section
		//
		this.deselect();
		this.getRegion('comments').$el.show();
		this.getChildView('comments').expand();

		// scroll into view
		//
		if (this.options.autoscroll && !this.getChildView('comments').inView(true)) {
			this.getChildView('comments').el.scrollIntoView(false);
		}
	},

	expandAll: function() {
		this.$el.find('.collapsed').removeClass('collapsed');
	},

	showCommentButton: function() {
		this.$el.find('button.comment').show();
	},

	showAddCommentDialog: function() {
		import(
			'../../../../../views/comments/dialogs/add-comment-dialog-view.js'
		).then((AddCommentDialogView) => {
			application.show(new AddCommentDialogView.default({

				// options
				//
				post: this.model,
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: (model) => {
					this.model.get('comments').add(model);
					this.showComments();
					this.expandComments();
				}
			}));
		});
	},

	showAddCommentForm: function() {

		// hide comment button
		//
		if (this.get('comments').length == 0) {
			this.$el.find('button.comment').hide();
		}

		// show comments section
		//
		this.expandComments();

		// show add comment form
		//
		this.getChildView('comments').showAddCommentForm();
		this.getChildView('comments').focus();
	},
	
	/*
	showNewCommentForm: function() {
		this.showChildView('form', new CommentFormView({

			// options
			//
			comment: new Comment({
				post_id: this.get('id'),
			}),
			focused: false,
			preferences: this.options.preferences,

			// callbacks
			//
			onsubmit: (model) => {

				// clear new comment form
				//
				this.getChildView('form').clear();

				// add new comment to list
				//
				this.model.get('comments').add(model);
			}
		}));
	},
	*/

	update: function() {

		// update elapsed time
		//
		this.$el.find('.elapsed-time').text(this.model.when());
	},

	updateLikesBadge: function() {
		let numLikes = this.get('num_likes');
		let likes = this.get('likes');
		let badge = this.$el.find('> .info .likes.badge');

		// update badge
		//
		badge.attr('data-original-title', 'Liked by ' + likes.join(', '));
		badge.find('.count').text(numLikes);

		// show / hide badge
		//
		if (numLikes > 0) {
			badge.show();
		} else {
			badge.hide();
		}
	},

	updateCommentsBadge: function() {
		let numComments = this.get('comments').length;
		let badge = this.$el.find('> .info .num-comments.badge');

		// update badge
		//
		badge.attr('data-original-title', numComments + (numComments == 1? ' comment' : 'comments'));
		badge.find('.count').text(numComments);

		// show / hide badge
		//
		if (numComments > 0) {
			badge.show();
		} else {
			badge.hide();
		}
	},

	//
	// dialog rendering methods
	//

	showTopicInfo: function(model) {
		import(
			'../../../../../views/apps/topic-browser/dialogs/info/topic-info-dialog-view.js'
		).then((TopicInfoDialogView) => {

			// show topic info dialog
			//
			this.show(new TopicInfoDialogView.default({
				model: model
			}));
		});
	},

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

	showEditDialog: function() {
		import(
			'../../../../../views/apps/post-viewer/dialogs/posts/edit-post-dialog-view.js'
		).then((EditPostDialogView) => {
			let topicId = this.model.get('topic_id');

			this.app.show(new EditPostDialogView.default({
				model: this.model,

				// options
				//
				topic: this.options.topic,
				preferences: this.options.preferences,

				// callbacks
				//
				onsubmit: () => this.onChange(topicId)
			}));
		});
	},

	//
	// form event handling methods
	//

	onChange: function(topicId) {

		// if post's topic changed, remove from collection
		//
		if (this.model.get('topic_id') != topicId) {
			this.model.collection.remove(this.model);
		}

		// update view
		//
		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDownBackground: function() {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.deselect();
	},

	onClickUser: function(event) {
		this.showUser();

		// block event from parent
		//
		this.block(event);
	},

	onClickWhat: function(event) {
		this.showWhat();

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

	onClickWhere: function(event) {
		this.showWhere();

		// block event from parent
		//
		this.block(event);
	},

	onClickInfoComment: function(event) {
		this.select();

		// block event from parent
		//
		this.block(event);
	},

	onClickExpander: function(event) {
		this.toggleCollapse();

		// block event from parent
		//
		this.block(event);
	},

	onClickNumComments: function(event) {
		this.expandComments();

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

	onClickComment: function(event) {
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
		let image = this.get('attachments').getItems('image')[0];
		this.openImage(image);

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

	/*
	onDoubleClick: function(event) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(this);
		}

		// block event from parent
		//
		this.block(event);
	},
	*/

	onDoubleClickComment: function(event) {
		/*
		if (this.model.isOwnedBy(application.session.user)) {
			this.edit();
		}
		*/

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(this);
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {	
		if (this.hasChildView('form')) {
			this.getChildView('form').onKeyDown(event);
		}
		if (this.hasChildView('comments')) {
			this.getChildView('comments').onKeyDown(event);
		}
	}
}));