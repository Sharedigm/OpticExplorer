/******************************************************************************\
|                                                                              |
|                             topic-viewer-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying a news feed.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../models/topics/topic.js';
import Post from '../../../models/topics/post.js';
import Item from '../../../models/storage/item.js';
import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import BaseCollection from '../../../collections/base-collection.js';
import Topics from '../../../collections/topics/topics.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import MultiDoc from '../../../views/apps/common/behaviors/tabbing/multidoc.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import TopicInfoShowable from '../../../views/apps/topic-browser/dialogs/info/behaviors/topic-info-showable.js';
import HeaderBarView from '../../../views/apps/topic-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/topic-viewer/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/topic-viewer/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/topic-viewer/footer-bar/footer-bar-view.js';
import OpenTopicsDialogView from '../../../views/apps/topic-viewer/dialogs/topics/open-topics-dialog-view.js';
import UserTopicView from '../../../views/apps/topic-viewer/mainbar/topics/user-topic-view.js';
import PreferencesFormView from '../../../views/apps/topic-viewer/forms/preferences/preferences-form-view.js';

export default AppSplitView.extend(_.extend({}, MultiDoc, ContainableSelectable, MultiSelectable, ItemOpenable, LinkShareable, ItemInfoShowable, TopicInfoShowable, {

	//
	// attributes
	//

	name: 'topic_viewer',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

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
		if (!this.model) {
			this.model = this.getDefaultTopic();
		}
		if (!this.collection) {
			this.collection = new BaseCollection([this.model]);
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let activeView = this.getActiveView();
			if (activeView && activeView.each) {
				activeView.each(callback, filter, options);
			}
		}
	},

	//
	// querying methods
	//

	hasDefaultTopic: function() {
		return this.preferences.has('default_topic');
	},

	hasSelectedTopic: function() {
		return this.hasChildView('sidebar topics') && this.getChildView('sidebar topics').hasSelected();
	},

	hasSelectedOpenTopic: function() {
		return this.model instanceof Topic;
	},

	hasOpenItem: function() {
		return !this.collection.isEmpty();
	},

	hasOpenItems: function() {
		return this.collection.length > 1;
	},

	hasSelectedOpenPost: function() {
		return this.model instanceof Post;
	},

	hasSelectedPost: function() {
		return this.hasActiveView() && this.getActiveView().hasSelected && this.getActiveView().hasSelected();
	},

	//
	// counting methods
	//

	numTopics: function() {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').numChildren();
		}
	},

	numOpenItems: function() {
		return this.collection.length;
	},

	numPosts: function() {
		if (this.hasActiveView() && this.getActiveView().numChildren) {
			return this.getActivePaneView().numChildren();
		}
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	getTopicByName: function(name) {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').collection.getByName(name);
		}
	},

	getDefaultTopic: function() {
		let name = this.preferences.get('default_topic');

		if (this.constructor.isDefaultTopicName(name)) {
			return this.constructor.default_topic;
		} else {
			return this.getTopicByName(name);
		}
	},

	getPostTopic: function(post) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getPostTopic(post);
		}
	},

	//
	// sidebar getting methods
	//

	getTopics: function() {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').getChildModels();
		}
	},

	getSelectedTopics: function() {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').getSelectedModels();
		}
	},

	//
	// mainbar getting methods
	//

	getOpenTopics: function() {
		return this.collection.toArray();
	},

	getSelectedOpenItem: function() {
		return this.model;
	},

	getSelectedOpenTopic: function() {
		return this.model instanceof Topic? this.model : null;
	},

	getSelectedOpenPost: function() {
		return this.model instanceof Post? this.model : null;
	},

	//
	// mainbar content getting methods
	//

	getPosts: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getChildModels();
		}
	},

	getSelectedPosts: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedModels();
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
			case 'show_comments':
				this.getActiveView().setCollapsed(!value);
				break;
			case 'show_options':
				this.getActiveView().setCondensed(!value);
				break;
			case 'post_per_page':
				this.getActiveView().setItemsPerPage(value);
				break;
			case 'posts_direction':
				this.getActiveView().setDirection(value);
				break;
			case 'default_privacy':
				this.getActiveView().setPrivacy(value);
				break;

			// language options
			//
			case 'translation':
			case 'language':
				this.preferences.set(key, value);
				this.showContent();
				break;

			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	loadModel: function(model, options) {
		this.addModel(model, options);

		// set options
		//
		if (options && (options.message || options.items)) {
			let activeView = this.getActiveView();
			if (activeView) {
				let formView = activeView.getChildView('form');
				if (formView) {
					if (options.message) {
						formView.setValue('message', options.message);
					}
					if (options.items) {
						formView.addAttachments(options.items);
					}
				}
			}
		}
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.getActiveView().select(which);
	},

	editSelected: function() {

		// delete selected post, comment, reply
		//
		if (this.selected && !(this.selected.model instanceof Topic)) {
			let model = this.selected.model;

			// check permissions
			//
			if (!model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to edit this item."
				});

				return;
			}

			// edit selected
			//
			this.selected.edit();

		// delete selected topic
		//
		} else if (this.hasSelectedTopic()) {
			this.editTopic(this.getSelectedTopics()[0]);

		// delete open topic
		//
		} else if (this.model) {
			this.editTopic(this.model);
		}
	},

	deleteSelected: function() {

		// delete selected post, comment, reply
		//
		if (this.selected && !(this.selected.model instanceof Topic)) {
			let model = this.selected.model;

			// check permissions
			//
			if (!model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to delete this item."
				});

				return;
			}

			// delete selected
			//
			this.selected.delete();

		// delete selected topic
		//
		} else if (this.hasSelectedTopic()) {
			this.deleteTopic(this.getSelectedTopics()[0]);

		// delete open topic
		//
		} else if (this.model) {
			this.deleteTopic(this.model);
		}
	},

	//
	// topic setting methods
	//

	setPostsTopic: function(posts, topic, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-arrow-right"></i>',
				title: 'Move ' + (posts.length == 1? 'Post' : 'Posts'),
				message: "Are you sure that you would like to move " + (posts.length == 1? '"' + posts[0].getMessage({max_words: 3}) + '..."': "these " + posts.length + " posts") + " from #" +
					this.model.get('name') + " to #" + topic.get('name') + "?",

				// callbacks
				//
				accept: () => {
					this.setPostsTopic(posts, topic, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// move items from current topic to selected topic
			//
			for (let i = 0; i < posts.length; i++) {
				posts[i].setTopic(topic);
			}

			// play drop sound
			//
			application.play('drop');
		}
	},

	setSearch: function(search) {
		let kind = search? Object.keys(search)[0] : '';
		let value = search? search[kind] : '';
		let searchKind = kind? kind.replace(/-/g, '_') : undefined;

		// set menu
		//
		this.getChildView('header menu').getChildView('search').setSearchKind(searchKind);

		// set search bar
		//
		this.getChildView('header').showSearchBar(searchKind, value);
	},

	//
	// topic methods
	//

	openTopic: function(topic, options) {
		this.openModel(topic, options);
	},

	openTopics: function(topics, options) {
		for (let i = 0; i < topics.length; i++) {
			this.openTopic(topics[i], options);
		}
	},

	openSelectedTopics: function() {
		if (this.hasSelected()) {
			this.openSelected();
		} else {
			this.showOpenTopicsDialog();
		}
	},

	addTopics: function(topics) {

		// add topics to collection
		//
		for (let i = 0; i < topics.length; i++) {
			this.getChildView('sidebar topics').collection.add(topics[i]);
		}

		// open last new topic
		//
		this.openTopic(topics[topics.length - 1]);
	},

	removeMemberFromTopics: function(user, topics) {
		let count = 0;
		let self = this;

		function removeTopic(topic) {

			// remove user from topics
			//
			topic.removeMember(user, {

				// callbacks
				//
				success: () => {
					count++;

					// remove topic from list
					//
					self.getChildView('sidebar topics').collection.remove(topic);

					// play remove sound
					//
					if (count == topics.length) {
						application.play('remove');
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not remove member from topic.",
						response: response
					});
				}
			});
		}

		for (let i = 0; i < topics.length; i++) {
			let topic = topics[i];

			// reset open item
			//
			if (topic == this.getActiveModel()) {
				this.closeTab();
			}

			removeTopic(topic);
		}
	},

	removeTopics: function(topics, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Remove Topics",
				message: "Are you sure you want to remove " +
					(topics.length > 1? "these " + topics.length + " topics" : "#" + topics[0].get('name')) + " from your list of topics?",

				// callbacks
				//
				accept: () => {
					this.removeTopics(topics, {
						confirm: false
					});
				}
			});
		} else {
			this.removeMemberFromTopics(application.session.user, topics);
		}
	},

	removeSelectedTopics: function(options) {
		if (this.hasSelectedTopic()) {
			this.removeTopics(this.getSelectedTopics(), options);
		} else {
			application.alert({
				title: "No Topics Selected",
				message: "No topics have been selected.  Click on a topic in the Topics panel to select it for removal."
			});
		}
	},

	editTopic: function(topic) {
		import(
			'../../../views/apps/topic-viewer/dialogs/topics/edit-topic-dialog-view.js'
		).then((EditTopicDialogView) => {

			// show edit topic dialog
			//
			this.show(new EditTopicDialogView.default({
				model: topic,

				// callbacks
				//
				onsave: () => {
					this.getChildView('sidebar topics').render();
				}
			}));
		});
	},

	deleteTopic: function(topic, options) {

		// check if topic can be deleted
		//
		if (topic.isRequired() || !topic.isOwnedBy(application.session.user)) {
			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Topic",
				message: "Are you sure you want to delete #" + topic.get('name') +
					" and all of its posts?",

				// callbacks
				//
				accept: () => {
					this.deleteTopic(topic, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// reset open item
			//
			if (this.getActiveModel() ==  topic) {
				this.closeTab();
			}

			// delete topic
			//
			topic.destroy({

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete topic.",
						response: response
					});
				}
			});
		}
	},

	fetchUnsubscribedTopics: function(options) {

		// fetch unsubscribed topics
		//
		this.request = new Topics().fetchUnsubscribed({

			// callbacks
			//
			success: (protectedTopics) => {
				this.request2 = new Topics().fetchUnsubscribedPublic({

					// callbacks
					//
					success: (publicTopics) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(protectedTopics, publicTopics);
						}
					},

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not fetch unsubscribed public topics.",
							response: response
						});
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not fetch unsubscribed topics.",
					response: response
				});
			}
		});
	},

	//
	// searching methods
	//

	searchFor: function(search) {
		this.options.search = search;
		this.showContent();
	},

	clearSearch: function() {
		this.options.search = undefined;
		this.showContent();
	},

	//
	// sharing methods
	//

	shareItems: function(directory) {
		this.getActiveView().shareItems({
			model: directory
		});
	},

	shareLocation: function() {
		this.getActiveView().shareLocation({
			name: 'My Location'
		});
	},

	shareSelectedByLink: function() {
		import(
			'../../../views/apps/file-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// show copy link dialog
			//
			application.show(new CopyLinkDialogView.default({
				url: this.getSelected()[0].model.getUrl()
			}));
		});
	},

	shareSelectedByTopic: function(options) {
		this.shareLinkByTopic(this.getSelected()[0].model.getUrl(), _.extend({}, options, {
			message: 'Check out this post: ' + '\n'
		}));
	},

	shareSelectedByMessage: function(options) {
		this.shareLinkByMessage(this.getSelected()[0].model.getUrl(), _.extend({}, options, {
			message: 'Check out this message: ' + '\n'
		}));
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
			model: this.model,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			info_kind: this.preferences.get('sidebar_info_kind'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onload: () => this.onLoad(),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondrop: (item) => this.onDropPost(item)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			message: this.options.message,
			items: this.options.items,
			search: this.options.search,
			preferences: this.preferences,

			// capabilities
			//
			editable: this.options.editable,

			// callbacks
			//
			onload: (item) => this.onLoad(item),
			onopen: (item) => this.onOpen(item),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onchangetab: (index) => this.onChangeTab(index),
			ondropout: (items) => this.onDropOut(items),
			ondelete: (items) => this.onDelete(items),
			onclose: (index) => this.closeTab(index)
		});
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No topics.", {
			icon: '<i class="fa fa-hashtag"></i>'
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

	showNewTopicDialog: function() {
		import(
			'../../../views/apps/topic-viewer/dialogs/topics/new-topic-dialog-view.js'
		).then((NewTopicDialogView) => {

			// show new topic dialog
			//
			this.show(new NewTopicDialogView.default({
				model: this.model,

				// callbacks
				//
				onsave: (topic) => {

					// add new topic to sidebar
					//
					this.getChildView('sidebar topics').collection.add(topic);

					// add new topic to open topics
					//
					this.collection.add(topic);

					// play new sound
					//
					application.play('new');
				}
			}));
		});
	},

	showOpenTopicsDialog: function() {
		import(
			'../../../views/apps/topic-viewer/dialogs/topics/open-topics-dialog-view.js'
		).then((OpenTopicsDialogView) => {

			// show open dialog
			//
			this.show(new OpenTopicsDialogView.default({

				// options
				//
				title: "Open Topics",

				// callbacks
				//
				onopen: (items) => {
					this.openTopics(items);
				}
			}));
		});
	},

	showAddTopicsDialog: function() {
		import(
			'../../../views/apps/topic-viewer/dialogs/topics/add-topics-dialog-view.js'
		).then((AddTopicsDialogView) => {

			// show add topics dialog
			//
			this.show(new AddTopicsDialogView.default({

				// callbacks
				//
				onadd: (topics) => {

					// add items to topics collection
					//
					this.addTopics(topics);

					// play new sound
					//
					application.play('add');
				},

				onsave: (topic) => {

					// add model to list
					//
					this.collection.add(topic);

					// play new sound
					//
					application.play('new');
				}
			}));
		});
	},

	showInfoDialog: function() {
		if (this.selected && this.selected.model instanceof Item) {

			// show attachment info
			//
			this.showItemInfoDialog(this.selected.model);
		} else if (this.hasSelectedTopic()) {

			// show sidebar topic info
			//
			this.showTopicsInfoDialog(this.getSelectedTopics());
		} else if (this.hasSelectedOpenTopic()) {

			// show mainbar topic info
			//
			this.showTopicInfoDialog(this.getSelectedOpenTopic());
		} else if (this.hasSelectedOpenPost()) {

			// show mainbar post topic info
			//
			this.showTopicInfoDialog(this.getPostTopic(this.getSelectedOpenPost()));
		}
	},

	showTopicInvitationsDialog: function(topic) {
		import(
			'../../../views/apps/topic-viewer/dialogs/invitations/topic-invitations-dialog-view.js'
		).then((TopicInvitationsDialogView) => {

			// show topic invitations dialog
			//
			this.show(new TopicInvitationsDialogView.default({
				model: topic,
				message: config.apps.topic_viewer.topic_invitation_message
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/topic-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// item opening methods
	//

	openPost: function(post, options) {
		this.selected = options.selected;

		// check if model is already open
		//
		if (this.isAlreadyOpen(post)) {

			// activate existing tab
			//
			this.setActiveModel(post);

		// open file
		//
		} else {

			// load model
			//
			this.loadModel(post, options);
		}
	},

	//
	// attachment downloading methods
	//

	download: function() {
		if (this.selected && this.selected.model.download) {
			this.selected.model.download();
		}
	},

	//
	// event handling methods
	//

	onOpen: function(item) {
		if (item.model instanceof Topic || item.model instanceof Post) {

			// open topic
			//
			this.openModel(item.model);
		} else if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model, {
				collection: item.model.collection
			});
		}
	},

	onLoad: function() {

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// set initial search
		//
		if (this.options.search && !this.loaded) {
			this.setSearch(this.options.search);
		}

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// set attributes
		//
		this.loaded = true;
	},

	onChangeTab: function(index) {

		// set attributes
		//
		this.model = this.collection.at(index);

		// update sidebar info panel
		//
		this.getChildView('sidebar').setTopic(this.model);

		// call superclass method
		//
		AppSplitView.prototype.onChangeTab.call(this, index);
	},

	onDelete: function() {
		application.play('delete');
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// call superclass method
		//
		AppSplitView.prototype.onSelect.call(this, item);
	},

	onDeselect: function(item) {
		this.selected = null;

		// call superclass method
		//
		AppSplitView.prototype.onDeselect.call(this, item);
	},

	//
	// drag and drop event handling methods
	//

	onDropPost: function(item) {

		// change post topic
		//
		if (this.hasSelectedPost()) {
			this.setPostsTopic(this.getSelectedPosts(), item.model);
		}
		item.unhighlight();
	},

	onDropOut: function(items) {
		this.download(items);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort requests
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
		if (this.request2 && this.request2.state() == 'pending') {
			this.request2.abort();
		}
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
		return config.preferences.topic_viewer || {};
	},

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getDefaultTopicName: function() {
		return this.getPreferences().default_topic;
	},

	getUserTopicView: function(options) {
		return new UserTopicView(options);
	},

	//
	// static dialog rendering methods
	//

	showOpenTopicsDialog: function(options) {
		application.show(new OpenTopicsDialogView(options));
	}
});