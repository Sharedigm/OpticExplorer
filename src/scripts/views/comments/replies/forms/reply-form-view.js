/******************************************************************************\
|                                                                              |
|                              reply-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for creating or editing a reply.             |
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
import CommentFormView from '../../../../views/comments/forms/comment-form-view.js';

export default CommentFormView.extend({

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
			<div class="buttons">

				<% if (features && features.emoji) { %>
				<button class="add-emoji btn btn-sm" data-toggle="tooltip" title="Add Emoji">
					<i class="fa fa-grin"></i>
				</button>
				<% } %>
		
				<% if (features && features.pictures) { %>
				<button class="add-pictures btn btn-sm" data-toggle="tooltip" title="Add Pictures">
					<i class="fa fa-image"></i>
				</button>
				<% } %>

				<% if (features && features.files) { %>
				<button class="add-files btn btn-sm" data-toggle="tooltip" title="Add Files">
					<i class="fa fa-file"></i>
				</button>
				<% } %>
		
				<% if (features && features.uploads) { %>
				<button class="upload-file btn btn-sm" data-toggle="tooltip" title="Upload File">
					<i class="fa fa-upload"></i><input type="file" multiple style="display:none"/>
				</button>
				<% } %>
				
				<% if (features && (features.pictures || features.files || features.uploads)) { %>
				<button class="remove warning btn btn-sm" data-toggle="tooltip" title="Remove Items" style="display:none">
					<i class="active fa fa-file-circle-xmark"></i>
				</button>
				<% } %>
		
				<button class="submit btn btn-primary" disabled>
					<i class="active fa fa-reply"></i>Reply
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

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.cancelable == undefined) {
			this.options.cancelable = true;
		}

		// call superclass constructor
		//
		CommentFormView.prototype.initialize.call(this);
	},

	//
	// setting methods
	//

	clear: function() {

		// clear message
		//
		this.model = new Reply({
			item_id: this.model.get('item_id'),
			item_type: this.model.get('item_type')
		});
		this.$el.find('.comment-inner').val('');

		// clear attachments
		//
		this.collection.reset();

		// hide remove button
		//
		this.setButtonHidden('remove', true);
	}
});