/******************************************************************************\
|                                                                              |
|                             comment-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for creating or editing a comment.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Comment from '../../../models/comments/comment.js';
import PostFormView from '../../../views/apps/post-viewer/forms/posts/post-form-view.js';
import HtmlUtils from '../../../utilities/web/html-utils.js';

export default PostFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="message flex-row">
			<div class="small tile">
				<% if (thumbnail_url) { %>
				<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>); width:<%= thumbnail_size %>">
					<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
				<% } %>
			</div>
			<div class="info">
				<div class="comment-bubble lower right">
					<div class="comment-inner form-control" contenteditable="true"><%= message %></div>
					<div class="comment-arrow"></div>
				</div>
			</div>
		</div>
		
		<div class="options">
			<div class="spacer hidden-xs"></div>

			<% if (sharing) { %>
			<div class="buttons">

				<% if (sharing.emoji) { %>
				<button class="add-emoji btn btn-sm" data-toggle="tooltip" title="Add Emoji">
					<i class="fa fa-grin"></i>
				</button>
				<% } %>

				<% if (sharing.files && sharing.files.Pictures) { %>
				<button class="add-pictures btn btn-sm" data-toggle="tooltip" title="Add Pictures">
					<i class="fa fa-image"></i>
				</button>
				<% } %>

				<% if (sharing.files) { %>
				<button class="add-files btn btn-sm" data-toggle="tooltip" title="Add Files">
					<i class="fa fa-file"></i>
				</button>
				<% } %>
		
				<% if (sharing.uploads) { %>
				<button class="upload-file btn btn-sm" data-toggle="tooltip" title="Upload File">
					<i class="fa fa-upload"></i><input type="file" multiple style="display:none"/>
				</button>
				<% } %>
				
				<% if (sharing.files || sharing.uploads) { %>
				<button class="remove warning btn btn-sm" data-toggle="tooltip" title="Remove Items" style="display:none">
					<i class="active fa fa-file-circle-xmark"></i>
				</button>
				<% } %>
			</div>
			<% } %>
		
			<div class="buttons">
				<button class="submit btn btn-primary" disabled>
					<i class="active fa fa-comment"></i>Comment
				</button>
		
				<% if (cancelable) { %>
				<button class="cancel btn">
					<i class="active fa fa-xmark"></i>Cancel
				</button>
				<% } %>
			</div>
		</div>
		
		<div class="attachments" class="focused"></div>
	`),

	events: _.extend({}, PostFormView.prototype.events, {
		'click .cancel': 'onClickCancel'
	}),

	// image attributes
	//
	thumbnailSize: 25,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.cancelable == undefined) {
			this.options.cancelable = false;
		}

		// call superclass constructor
		//
		PostFormView.prototype.initialize.call(this);
	},

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return application.session.user.getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// setting methods
	//

	clear: function() {

		// clear message
		//
		this.model = new Comment({
			post_id: this.model.get('post_id')
		});
		this.$el.find('.comment-inner').val('');

		// clear attachments
		//
		this.collection.reset();

		// hide remove button
		//
		this.setButtonHidden('remove', true);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			message: HtmlUtils.textToHtml(this.model.get('message')),
			privacy: this.model.get('public')? 'public' : 'connections',
			sharing: config.defaults.sharing,

			// capabilities
			//
			cancelable: this.options.cancelable,
		};
	},

	onRender: function() {

		// call superclass method
		//
		PostFormView.prototype.onRender.call(this);

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// form querying method
	//

	getValues: function() {
		return {
			message: this.getValue('message'),
			attachments: this.getValue('attachments')
		};
	}
});