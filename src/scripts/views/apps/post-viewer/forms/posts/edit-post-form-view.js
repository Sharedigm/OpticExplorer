/******************************************************************************\
|                                                                              |
|                            edit-post-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for creating or editing a post.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModelSelectorView from '../../../../../views/forms/selectors/model-selector-view.js';
import PostFormView from '../../../../../views/apps/post-viewer/forms/posts/post-form-view.js';

export default PostFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="topic form-group">
			<label class="control-label"><i class="fa fa-hashtag"></i>Topic</label>
			<div class="controls">
			</div>
		</div>
		
		<div class="post form-group wide">
			<label class="control-label"><i class="fa fa-newspaper"></i>Post</label>
			<div class="controls panel">
			</div>
		</div>
	`),

	regions: {
		topic: '.topic .controls',
		post: '.post .controls'
	},

	//
	// form methods
	//

	getValue: function(key) {
		if (key == 'topic_id') {
			return this.getChildView('topic').getSelected().get('id');
		} else {
			return this.getChildView('post').getValue(key);
		}
	},

	getValues: function() {
		return _.extend({
			topic_id: this.getValue('topic_id')
		}, this.getChildView('post').getValues());
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showTopicSelector();
		this.showPostForm();
	},

	onShow: function() {
		this.getChildView('post').onShow();
	},

	showTopicSelector: function() {
		this.showChildView('topic', new ModelSelectorView({
			collection: this.options.topics,

			// options
			//
			initial: this.options.topic,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showPostForm: function() {
		this.showChildView('post', new PostFormView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,

			// capabilities
			//
			submitable: this.options.submitable,
			cancelable: true,

			// callbacks
			//
			onvalidate: this.options.onvalidate,
			onsubmit: this.options.onsubmit
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onvalidate) {
			this.options.onvalidate(this.getChildView('post').isValid());
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('post').onKeyDown(event);
	}
});