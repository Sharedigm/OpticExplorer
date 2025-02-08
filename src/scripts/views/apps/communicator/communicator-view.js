/******************************************************************************\
|                                                                              |
|                            communicator-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and editing messages.         |
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
import Comment from '../../../models/comments/comment.js';
import Reply from '../../../models/comments/reply.js';
import Chat from '../../../models/chats/chat.js';
import ChatMessage from '../../../models/chats/chat-message.js';
import Item from '../../../models/storage/item.js';
import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import BaseCollection from '../../../collections/base-collection.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import MultiDoc from '../../../views/apps/common/behaviors/tabbing/multidoc.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import TopicInfoShowable from '../../../views/apps/topic-browser/dialogs/info/behaviors/topic-info-showable.js';
import ChatInfoShowable from '../../../views/apps/chat-browser/dialogs/info/behaviors/chat-info-showable.js';
import HeaderBarView from '../../../views/apps/communicator/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/communicator/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/communicator/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/communicator/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/communicator/forms/preferences/preferences-form-view.js'
import Browser from '../../../utilities/web/browser.js';
import HtmlUtils from '../../../utilities/web/html-utils.js';

export default AppSplitView.extend(_.extend({}, MultiDoc, ContainableSelectable, MultiSelectable, ItemOpenable, LinkShareable, ItemInfoShowable, TopicInfoShowable, ChatInfoShowable, {

	//
	// attributes
	//

	name: 'communicator',
	
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
			this.getActiveView().each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	hasDefaultTopic: function() {
		return this.preferences.has('default_topic');
	},

	hasSelectedTopic: function() {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').hasSelected();
		}
	},

	hasSelectedPost: function() {
		if (this.hasActiveView() && this.hasSelectedOpenTopic()) {
			return this.getActiveView().hasSelected();
		}
	},

	hasSelectedChat: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').hasSelected();
		}
	},

	hasSelectedMessage: function() {
		if (this.hasActiveView() && this.hasSelectedOpenChat()) {
			return this.getActiveView().hasSelected();
		}
	},

	hasSelectedOpenTopic: function() {
		return this.model instanceof Topic;
	},

	hasSelectedOpenPost: function() {
		return this.model instanceof Post;
	},

	hasSelectedOpenChat: function() {
		return this.model instanceof Chat;
	},

	hasOpenItem: function() {
		return !this.collection.isEmpty();
	},

	hasOpenItems: function() {
		return this.collection.length > 1;
	},

	hasSelectedItem: function() {
		return this.hasActiveView() && this.getActiveView().hasSelected();
	},

	hasSelectedPostItem: function() {
		return this.selected && this.selected.model instanceof Post;
	},

	hasSelectedComment: function() {
		return this.selected && this.selected.model instanceof Comment;
	},

	hasSelectedReply: function() {
		return this.selected && this.selected.model instanceof Reply;
	},

	hasSelectedMessageItem: function() {
		return this.selected && this.selected.model instanceof ChatMessage;
	},

	hasSelectedFileItem: function() {
		return this.selected && this.selected.model instanceof Item;
	},

	//
	// counting methods
	//

	numTopics: function() {
		if (this.hasChildView('sidebar topics')) {
			return this.getChildView('sidebar topics').numChildren();
		}
	},

	numChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').numChildren();
		}
	},

	numItems: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().numChildren();
		}
	},

	numOpenItems: function() {
		return this.collection.length;
	},

	numPosts: function() {
		return this.model instanceof Topic? this.numItems() : undefined;
	},

	numMessages: function() {
		return this.model instanceof Chat? this.numItems() : undefined;
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

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

	getPostTopic: function(post) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getPostTopic(post);
		}
	},

	getActiveFormOptions: function() {
		let activeView = this.getActiveView();
		if (activeView) {
			let formView = activeView.getChildView('form');
			if (formView) {
				return {
					message: formView.getValue('message'),
					items: formView.getValue('attachments').models
				};
			}
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

	getChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').getChildModels();
		}
	},

	getSelectedChats: function() {
		if (this.hasChildView('sidebar chats')) {
			return this.getChildView('sidebar chats').getSelectedModels();
		}
	},

	//
	// mainbar getting methods
	//

	getOpenItems: function() {
		return this.collection.toArray();
	},

	getSelectedOpenItem: function() {
		return this.model;
	},

	//
	// mainbar content getting methods
	//

	getItems: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getChildModels();
		}
	},

	getSelectedItem: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedModels()[0];
		}
	},

	getSelectedItems: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedModels();
		}
	},

	getSelectedPosts: function() {
		if (this.model instanceof Topic) {
			return this.getSelectedItems();
		}
	},

	getSelectedMessages: function() {
		if (this.model instanceof Chat) {
			return this.getSelectedItems();
		}
	},

	getSelectedFileItem: function() {
		return this.selected.model instanceof Item? this.selected.model : undefined;
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
			case 'posts_per_page':
				this.getActiveView().setPostsPerPage(value);
				break;
			case 'posts_direction':
				this.getActiveView().setDirection(value);
				break;
			case 'messages_per_page':
				this.getActiveView().setMessagesPerPage(value);
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
		this.getChildView('header menu search').setSearchKind(searchKind);

		// set search bar
		//
		this.getChildView('header').showSearchBar(searchKind, value);
	},

	//
	// topic methods
	//

	openTopic: function(topic, options) {
		this.openModel(topic);

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

		// hide help message
		//
		this.hideMessage();
	},

	openTopics: function(topics, options) {
		for (let i = 0; i < topics.length; i++) {
			this.openTopic(topics[i], options);
		}
	},

	openSelectedTopics: function() {
		if (this.hasSelectedTopic()) {
			this.openTopics(this.getSelectedTopics());
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

			// remove current user from topics
			//
			topic.removeMember(user, {

				// callbacks
				//
				success: () => {
					count++;

					// remove topic from sidebar list
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
						message: "Could not remove this topic.",
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
			this.removeTopics([this.model]);
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
					this.getChildView('sidebar').render();
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

	/*
	shareTopic: function(topic) {
		import(
			'../../../views/apps/communicator/dialogs/invitations/share-topic-by-invitation-dialog-view.js'
		).then((ShareTopicByInvitationDialogView) => {
			this.show(new ShareTopicByInvitationDialogView.default({
				model: topic
			}));
		});
	},
	*/

	//
	// chat methods
	//

	openChat: function(chat, options) {
		if (chat) {
			this.openModel(chat);

			// add chat to sidebar, if necessary
			//
			let chats = this.getChildView('sidebar chats').collection;
			if (!chats.contains(chat)) {
				chats.add(chat);
			}
		}

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

		// hide help message
		//
		this.hideMessage();
	},

	openChats: function(chats, options) {
		for (let i = 0; i < chats.length; i++) {
			this.openChat(chats[i], options);
		}
	},

	openSelectedChats: function() {
		if (this.hasSelectedChat()) {
			this.openChats(this.getSelectedChats());
		} else {
			this.showOpenChatsDialog();
		}
	},

	endChat: function(chat, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm end chat
			//
			application.confirm({
				message: "Are you sure that you want to leave your chat with " + chat.getName() + '?',

				// callbacks
				//
				accept: () => {
					this.endChat(chat, {
						confirm: false
					});
				}
			});
		} else {

			// close open item
			//
			if (chat && chat.is(this.getActiveModel())) {
				this.closeTab();
			}

			// remove current user from chat
			//
			chat.removeMember(application.session.user, {

				// callbacks
				//
				success: () => {

					// remove chat from open list
					//
					this.collection.remove(chat);

					// remove chat from sidebar list
					//
					this.getChildView('sidebar chats').collection.remove(chat);

					// play remove sound
					//
					application.play('remove');
				}
			});
		}
	},

	endSelectedChat: function(options) {
		this.endChat(this.getSelectedChats()[0], options);
	},

	//
	// chat message methods
	//

	editMessage: function(message, options) {
		this.showEditChatMessageDialog(message, options);
	},

	deleteMessage: function(message, options) {

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
					this.deleteMessage(message, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// destroy message
			//
			message.destroy(options);

			// play remove sound
			//
			application.play('remove');
		}
	},

	//
	// item editing methods
	//

	editItem: function(item) {
		if (item.edit) {

			// check permissions
			//
			if (!item.model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to edit this item."
				});

				return;
			}

			// edit item
			//
			item.edit();

		// edit topic
		//
		} else if (item.model instanceof Topic) {
			this.editTopic(item.model);
		}
	},

	editSelected: function() {
		if (this.selected) {
			this.editItem(this.selected);
		} else if (this.hasSelectedOpenTopic()) {
			this.editTopic(this.getSelectedOpenItem());
		}
	},

	deleteItem: function(item) {
		if (item.delete) {

			// check permissions
			//
			if (!item.model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to delete this item."
				});

				return;
			}

			// delete item
			//
			item.delete();

		// delete topic
		//
		} else if (item.model instanceof Topic) {
			this.deleteTopic(item.model);
		}
	},

	deleteSelected: function() {
		if (this.selected) {
			this.deleteItem(this.selected);
		}
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
				url: this.getSelectedModel().getUrl()
			}));
		});
	},

	shareSelectedByTopic: function(options) {
		this.shareLinkByTopic(this.getSelectedModel().getUrl(), _.extend({}, options, {
			message: 'Check out this post: ' + '\n'
		}));
	},

	shareSelectedByMessage: function(options) {
		this.shareLinkByMessage(this.getSelectedModel().getUrl(), _.extend({}, options, {
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

			// collections
			//
			topics: this.topics,
			chats: this.chats,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			info_kind: this.preferences.get('sidebar_info_kind'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onload: (collection) => this.onLoad(collection),
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
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No discussions.", {
			icon: '<i class="fa fa-message"></i>'
		});
	},

	//
	// dialog rendering methods
	//

	showNewTopicDialog: function() {
		import(
			'../../../views/apps/topic-viewer/dialogs/topics/new-topic-dialog-view.js'
		).then((NewTopicDialogView) => {

			// show new post topic dialog
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

	showOpenChatsDialog: function() {
		import(
			'../../../views/apps/chat-viewer/dialogs/chats/open-chats-dialog-view.js'
		).then((OpenChatsDialogView) => {

			// show open dialog
			//
			this.show(new OpenChatsDialogView.default({

				// options
				//
				title: "Open Chats",

				// callbacks
				//
				onopen: (items) => {
					this.openChats(items);
				}
			}));
		});
	},

	showEditChatMessageDialog: function(message) {
		import(
			'../../../views/apps/chat-viewer/dialogs/messages/edit-chat-message-dialog-view.js'
		).then((EditChatMessageDialogView) => {

			// show edit chat message dialog
			//
			this.show(new EditChatMessageDialogView.default({
				model: message,

				// options
				//
				preferences: this.preferences,

				// callbacks
				//
				onsubmit: () => {

					// update view
					//
					this.selected.render();
				}
			}));
		});
	},

	showInfoDialog: function() {
		if (this.hasSelectedFileItem()) {

			// show attachments info
			//
			this.showItemInfoDialog(this.getSelectedFileItem());
		} else if (this.hasSelectedTopic()) {

			// show topics info
			//
			this.showTopicsInfoDialog(this.getSelectedTopics());
		} else if (this.hasSelectedChat()) {

			// show chats info
			//
			this.showChatsInfoDialog(this.getSelectedChats());
		} else if (this.hasSelectedOpenTopic()) {

			// show topic info
			//
			this.showTopicInfoDialog(this.getSelectedOpenItem());
		} else if (this.hasSelectedOpenPost()) {

			// show post topic info
			//
			this.showTopicInfoDialog(this.getPostTopic(this.getSelectedOpenItem()));
		} else if (this.hasSelectedOpenChat()) {

			// show chat info
			//
			this.showChatInfoDialog(this.getSelectedOpenItem());
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

	showChatInvitationsDialog: function(chat) {
		import(
			'../../../views/apps/chat-browser/dialogs/invitations/chat-invitations-dialog-view.js'
		).then((ChatInvitationsDialogView) => {

			// show add chat dialog
			//
			this.show(new ChatInvitationsDialogView.default({
				model: chat,
				message: chat? config.apps.chat_viewer.join_chat_invitation_message :
					config.apps.chat_viewer.new_chat_invitation_message
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/communicator/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences,
				collection: this.topics
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
		if (item.model instanceof Topic) {
			this.openTopic(item.model, this.getActiveFormOptions());
		} else if (item.model instanceof Chat) {
			this.openChat(item.model, this.getActiveFormOptions());
		} else if (item.model instanceof Post) {
			this.openModel(item.model);
		} else if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model);
		}
	},

	onLoad: function() {

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// set initial chat
		//
		if (this.options.mode == 'chats') {
			if (this.hasChildView('sidebar chats')) {
				let chats = this.getChildView('sidebar chats').collection;
				if (chats.length > 0) {
					this.openChat('first');
				}
			}
		}

		// set post topic
		//
		if (this.model instanceof Post) {
			this.getChildView('sidebar').model = this.getChildView('sidebar').getPostTopic(this.model);
			this.getChildView('sidebar').showTopicInfoPanel();
		}

		// set initial search
		//
		if (this.options.search) {
			this.setSearch(this.options.search);
		}

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onDelete: function() {
		application.play('remove');
	},

	//
	// event handling methods
	//

	onChange: function() {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// call superclass method
		//
		AppSplitView.prototype.onChange.call(this);
	},

	onChangeTab: function(index) {

		// set attributes
		//
		this.model = this.collection.at(index);

		// update sidebar info panel
		//
		this.getChildView('sidebar').setModel(this.model);

		// call superclass method
		//
		AppSplitView.prototype.onChangeTab.call(this, index);
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
	// static methods
	//

	isDefaultTopicName: function(name) {
		return name && name != '' && this.getDefaultTopicName() == name;
	},

	hasDefaultTopicName: function() {
		return this.getTopicName() != undefined;
	},

	getPreferences: function() {
		return config.preferences.communicator || {};
	},

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getDefaultTopicName: function() {
		return this.getPreferences().default_topic;
	}
});