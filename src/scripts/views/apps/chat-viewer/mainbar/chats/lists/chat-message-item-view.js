/******************************************************************************\
|                                                                              |
|                          chat-message-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single chat message.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../../models/preferences/user-preferences.js';
import Connection from '../../../../../../models/connections/connection.js';
import Items from '../../../../../../collections/storage/items.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import ModelView from '../../../../../../views/items/model-view.js';
import FilesView from '../../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import ImageGalleryView from '../../../../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-view.js';
import HtmlUtils from '../../../../../../utilities/web/html-utils.js';

export default ModelView.extend(_.extend({}, Selectable, {

	//
	// attributes
	//

	className: 'message item',

	template: template(`
		<% if (!is_current) { %>
		<% if (show_elapsed_time || check_in) { %>
		<div class="specifics">
			<div class="fineprint info">
		
				<% if (show_elapsed_time) { %>
				<a class="when">
					<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>" data-placement="top"></i>
					<span class="elapsed-time"><%= when %></span>
				</a>
				<% } %>
		
				<% if (check_in) { %>
				<a class="where">
					<i class="fa fa-map-marker-alt"></i>
					<%= check_in.get('name') %>
				</a>
				<% } %>
			</div>
		</div>
		<% } %>
		<% } %>
		
		<div class="small tile">
			<% if (is_current) { %>
			<% if (thumbnail_url) { %>
			<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)" data-toggle="tooltip" title="you">
				<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
				<i class="placeholder far fa-user"></i>
			</div>
			<% } else { %>
			<div class="thumbnail">
				<i class="fa fa-user"></i>
			</div>
			<% } %>
			<% } else { %>
			<a class="user" data-toggle="tooltip" title="<%= name %>">
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
		
		<div class="comment-bubble <%= orientation %>">
			<div class="comment-inner">
				<span class="text"><%= message %></span>
		
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
		
		<% if (is_current) { %>
		<% if (show_elapsed_time || check_in) { %>
		<div class="specifics">
			<div class="fineprint info">
		
				<% if (check_in) { %>
				<a class="where">
					<i class="fa fa-map-marker-alt"></i>
					<%= check_in.get('name') %>
				</a>
				<% } %>
		
				<% if (show_elapsed_time) { %>
				<a class="when">
					<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>" data-placement="top"></i>
					<span class="elapsed-time"><%= when %></span>
				</a>
				<% } %>
			</div>
		</div>
		<% } %>
		<% } %>
	`),

	regions: {
		attachments: '.file-attachments',
		gallery: '.gallery'
	},

	events: {

		// mouse events
		//
		'mousedown .comment-bubble': 'onMouseDown',
		'click > .tile a.user': 'onClickUser',
		'dblclick .comment-bubble': 'onDoubleClickComment',
		'click .comment-bubble a': 'onClickLink',
		'click .gallery > img': 'onClickGalleryImage',
		'click .when': 'onClickWhen',
		'click .where': 'onClickWhere',
		
		// touch events
		//
		'tap .comment-bubble': 'onTap'
	},

	// image attributes
	//
	thumbnailSize: 25,
	maxImageSize: 300,
	maxImages: 6,

	//
	// constructor
	//

	initialize: function() {

		// listen for model changes
		//
		this.listenTo(this.model, 'change', this.render, this);
	},

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return this.get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
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
			collection: new Items([imageFile])		
		});
	},

	edit: function() {

		// check if we can edit this comment
		//
		if (this.model.isOwnedBy(application.session.user)) {
			this.showEditDialog();
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
				message: message? "Are you sure you want to delete the message " + '"' +
					message + '"?' : "Are you sure you want to delete this message?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// destroy message
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
		let when = this.model.when();
		let repeatWhen = (when == this.parent.prevWhen);
		let showElapsedTime = this.options.show_elapsed_time && !repeatWhen;

		if (showElapsedTime) {
			this.parent.prevWhen = when;
		}

		return {

			// add user info
			//
			href: application.getUrl() + '#users/' + this.get('user').get('id'),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			is_current: this.get('user').isCurrent(),
			name: this.get('user').get('short_name'),

			// add message info
			//
			message: HtmlUtils.returnify(HtmlUtils.linkify(this.get('message'))),
			orientation: this.model.isOwnedBy(application.session.user)? 'lower right' : 'lower left',
			has_files: this.get('attachments').hasItems('non_visual'),
			has_images: this.get('attachments').hasItems('visual'),
			num_images: this.get('attachments').numItems('visual'),

			// add timing info
			//
			when: when,	
			show_elapsed_time: showElapsedTime
		};
	},

	onRender: function() {
		if (this.get('user').isCurrent()) {
			this.$el.addClass('user');
		} else {
			this.$el.addClass('connection');
		}

		if (this.get('user').isCurrent()) {
			this.$el.addClass('up');
		} else {
			this.$el.addClass('down');
		}

		// show child views
		//
		if (this.get('attachments').hasItems('non_visual')) {
			this.showAttachments();
		}
		if (this.get('attachments').hasItems('visual')) {
			this.showGallery();
		}

		// add tooltip triggers
		//
		this.addTooltips();
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
		let image = $('<img src="' + url + '"' + ' data-toggle="tooltip" data-placement="bottom" data-container="body" title="' + attachment.get('path') + '"' + '>');
		this.$el.find('.gallery').append(image);
	},

	showInlineVideo: function(attachment) {
		let url = attachment.getUrl({max_size: this.maxImageSize});
		let image = $('<video src="' + url + '"' + ' data-toggle="tooltip" data-placement="bottom" data-container="body" title="' + attachment.get('path') + '"' + 'controls>');
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

			// use full width
			//
			this.$el.find('.comment-bubble').css('width', '100%');
			
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

	update: function() {

		// update elapsed time
		//
		this.$el.find('.elapsed-time').text(this.model.when());
	},

	//
	// dialog rendering methods
	//

	showEditDialog: function() {
		import(
			'../../../../../../views/apps/chat-viewer/dialogs/messages/edit-chat-message-dialog-view.js'
		).then((EditChatMessageDialogView) => {
			application.show(new EditChatMessageDialogView.default({
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

	//
	// mouse event handling methods
	//

	onClickUser: function(event) {
		new Connection({
			id: this.get('user').get('id')
		}).fetch({

			//
			//
			success: (model) => {

				// show user's profile info
				//
				application.showUser(model);	
			}
		});

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

	onClickLink: function(event) {
		if (event.target.href) {
			application.showUrl(event.target.href);
		}

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

	//
	// cleanup methods
	//

	onDestroy: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
}));