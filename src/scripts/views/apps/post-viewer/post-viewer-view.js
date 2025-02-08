/******************************************************************************\
|                                                                              |
|                              post-viewer-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing a news post.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Post from '../../../models/topics/post.js';
import Topic from '../../../models/topics/topic.js';
import Topics from '../../../collections/topics/topics.js';
import Directory from '../../../models/storage/directories/directory.js';
import File from '../../../models/storage/files/file.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import HeaderBarView from '../../../views/apps/post-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/post-viewer/sidebar/sidebar-view.js';
import PostView from '../../../views/apps/post-viewer/mainbar/posts/post-view.js';
import FooterBarView from '../../../views/apps/post-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/post-viewer/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, ItemOpenable, LinkShareable, {

	//
	// attributes
	//

	name: 'post_viewer',

	events: {

		// mouse events
		//
		'mousedown .post': 'onMouseDownPost',

		// touch events
		//
		'tap .post': 'onTapPost'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (this.options.commentable == undefined) {
			this.options.commentable = true;
		}
		if (this.options.editable == undefined) {
			this.options.editable = false;
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

		// set default topic
		//
		if (!this.constructor.default_topic) {
			this.constructor.default_topic = new Topic({
				id: 0,
				name: this.constructor.getDefaultTopicName()
			});
		}

		// set attributes
		//
		this.topic = new Topic({
			id: this.model? this.model.get('topic_id') : undefined
		});
		this.user = application.session.user;
		this.collection = new Topics();
	},

	//
	// counting methods
	//

	numTopics: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildViw('sidebar').collection.length;
		}
	},

	//
	// getting methods
	//

	getDefaultTopic: function() {
		let name = this.preferences.get('default_topic');

		if (this.constructor.isDefaultTopicName(name)) {
			return this.constructor.default_topic;
		} else {
			return this.getTopicByName(name);
		}
	},

	getTopicByName: function(name) {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').collection.getByName(name);
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {

		// update view
		//
		switch (key) {

			// mainbar options
			//
			case 'show_options':
				this.getChildView('content').setCondensed(!value);
				break;

			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	setTopic: function(topic, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm move
			//
			application.confirm({
				icon: '<i class="fa fa-arrow-right"></i>',
				title: 'Move Post',
				message: "Are you sure that you would like to move this post from #" +
					this.topic.get('name') + " to #" + topic.get('name') + "?",

				// callbacks
				//
				accept: () => {
					this.setTopic(topic, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// move post to new topic
			//
			this.model.save({
				topic_id: topic.get('id')
			}, {

				// callbacks
				//
				success: () => {

					// update sidebar
					//
					this.getChildView('sidebar').setTopic(topic);

					// perform callback
					//
					this.onChange();
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not move post to topic.",
						response: response
					});
				}
			});
		}
	},

	//
	// selecting methods
	//

	selectAll: function() {
		this.getChildView('content').select();
	},

	deselectAll: function() {
		this.getChildView('content').deselect();
	},

	//
	// posting methods
	//

	editPost: function() {
		this.getChildView('content').children.findByIndex(0).edit();
	},

	deletePost: function() {
		this.getChildView('content').delete({

			// callbacks
			//
			success: () => {
				this.close();
			}
		});
	},

	//
	// sharing methods
	//

	shareByLink: function() {
		import(
			'../../../views/apps/file-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// show copy link dialog
			//
			application.show(new CopyLinkDialogView.default({
				url: this.model.getUrl()
			}));
		});
	},

	shareByTopic: function(options) {
		this.shareLinkByTopic(this.model.getUrl(), _.extend({}, options, {
			message: 'Check out this post: ' + '\n'
		}));
	},

	shareByMessage: function(options) {
		this.shareLinkByMessage(this.model.getUrl(), _.extend({}, options, {
			message: 'Check out this post: ' + '\n'
		}));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// update
		//
		this.onLoad();
	},

	showContents: function() {
		AppSplitView.prototype.showContents.call(this);

		// add wrapping div for a bit of extra space
		//
		this.$el.find('.post.panel').wrap('<div></div>');
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			post: this.model,
			defaultTopic: this.constructor.default_topic,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			editable: false,

			// callbacks
			//
			onclick: (item) => {

				// move post to another topic
				//
				if (this.model.isOwnedBy(application.session.user)) {
					this.setTopic(item.model);
				}
			},
			onopen: (item) => {
				this.showTopicInfo(item.model);
			},
			ondrop: (item) => {
				this.setTopic(item.model);
				item.unhighlight();
			}
		});
	},

	getContentView: function() {
		return new PostView({
			model: this.model,

			// options
			//
			preferences: this.preferences,

			// state
			//
			collapsed: false,
			selected: this.options.selected,

			// capabilities
			//
			selectable: false,
			editable: this.options.editable,
			likeable: this.options.likeable,
			unlikeable: this.options.unlikeable,
			dislikeable: this.options.dislikeable,
			commentable: this.options.commentable,

			// callbacks
			//
			onselect: (items) => this.onSelect(items),
			ondeselect: (items) => this.onDeselect(items),
			onopen: (item) => this.onOpen(item)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showInfoDialog: function() {
		import(
			'../../../views/apps/topic-browser/dialogs/info/topic-info-dialog-view.js'
		).then((TopicInfoDialogView) => {

			// show topic info dialog
			//
			this.show(new TopicInfoDialogView.default({
				model: this.topic
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/post-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {
		if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model);
		}
	},

	//
	// mouse event handling methods
	//

	onClickPost: function(event) {
		if (event.target.type != 'button' && event.target.type != 'submit') {
			this.deselectAll();
		}
	},

	onMouseDownPost: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.onClickPost(event);
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// update menu
		//
		this.getChildView('header menu').onSelect(item);
	},

	onDeselect: function(item) {
		this.selected = null;

		// update menu
		//
		this.getChildView('header menu').onDeselect(item);
	},

	//
	// touch event handling methods
	//

	onTapPost: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		this.onClickPost(event);
	}
}), {

	//
	// static querying methods
	//

	isDefaultTopicName: function(name) {
		return name && name != '' && this.getDefaultTopicName() == name;
	},

	hasDefaultTopicName: function() {
		return this.getTopicName() != undefined;
	},

	//
	// static getting methods
	//

	getPreferences: function() {
		return config.preferences.post_viewer || {};
	},

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getDefaultTopicName: function() {
		return this.getPreferences().default_topic;
	},

	//
	// static rendering methods
	//

	showPost: function(id, options) {
		import(
			'../../../views/apps/post-viewer/mainbar/post-info-view.js'
		).then((PostInfoView) => {
			this.fetchPost(id, {

				// callbacks
				//
				success: (post) => {

					// show post info page
					//
					application.showPage(new PostInfoView.default({
						model: post
					}));
				},

				error: (response) => {
					if (options && options.error) {
						options.error(response);
					}
				}
			});
		});
	},

	showGallery: function() {
		import(
			'../../../views/apps/post-viewer/mainbar/post-gallery-view.js'
		).then((PostGalleryView) => {

			// show post gallery page
			//
			application.showPage(new PostGalleryView.default(), {
				nav: 'gallery'
			});
		});
	},

	//
	// static ajax methods
	//

	fetchPost: function(id, options) {
		new Post({
			'id': id
		}).fetch({

			// callbacks
			//
			success: (model) => {
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (model, response) => {
				if (options && options.error) {
					options.error(response);
				}
			}
		});
	}
});