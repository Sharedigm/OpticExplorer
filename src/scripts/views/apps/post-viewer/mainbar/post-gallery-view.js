/******************************************************************************\
|                                                                              |
|                            post-gallery-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a gallery of posts.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ImageFile from '../../../../models/storage/media/image-file.js';
import PostAttachments from '../../../../collections/topics/post-attachments.js';
import BaseView from '../../../../views/base-view.js';
import PostAttachmentsView from '../../../../views/apps/post-viewer/mainbar/post-attachments/post-attachments-view.js';
import Loadable from '../../../../views/behaviors/effects/loadable.js';

export default BaseView.extend(_.extend({}, Loadable, {


	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-image"></i>Image Gallery</h1>

		<div class="right aligned">
			<select class="sorting">
				<option value="date">Sort by Date</option>
				<option value="comments">Sort by # of Comments</option>
				<option value="likes">Sort by # of Likes</option>
			</select>
		</div>

		<div class="center aligned items"></div>
	`),

	regions: {
		items: '.items'
	},

	events: {
		'change .sorting': 'onChangeSorting'
	},

	//
	// ajax methods
	//

	fetchPostAttachments: function(done) {
		new PostAttachments().fetchPublic({
			data: {
				sorting: this.getValue('sorting')
			},

			// callbacks
			//
			success: (collection) => {
				done(collection);
			},

			error: (model, response) => {

				// show 404 page
				//
				this.showNotFound({
					message: "Post attachments not found. ",
					response: response
				});
			}
		});
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'sorting':
				return this.$el.find('.sorting').val();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.update();
	},

	update: function() {
		this.showSpinner();
		this.fetchPostAttachments((collection) => {
			this.hideSpinner();
			this.showPostAttachments(new PostAttachments(collection.filter((item) => {

				// show only image attachments
				//
				let path = item.get('path').toLowerCase();
				return ImageFile.isValidPath(path);
			})));
		});
	},

	showPostAttachments: function(collection) {
		this.showChildView('items', new PostAttachmentsView({
			collection: collection,

			// options
			//
			view_kind: 'tiles',

			// callbacks
			//
			onselect: (item) => this.onSelect(item)
		}));
	},

	showPostInViewer: function(post) {
		application.launch('post_viewer', {
			model: post
		});
	},

	showPost: function(post) {
		if (this.desktop && application.hasApp('post_viewer')) {

			// show post in viewer app
			//
			this.showPostInViewer(post);
		} else {

			// show post in web page
			//
			application.showUrl(post.getUrl(), '_blank');
		}
	},

	//
	// event handling methods
	//

	onSelect: function(item) {
		this.showPost(item.model.get('post'));
	},

	onChangeSorting: function() {
		this.update();
	}
}));