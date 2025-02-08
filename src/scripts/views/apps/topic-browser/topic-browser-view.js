/******************************************************************************\
|                                                                              |
|                              topic-browser-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing and finding topics.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topics from '../../../collections/topics/topics.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import TopicInfoShowable from '../../../views/apps/topic-browser/dialogs/info/behaviors/topic-info-showable.js';
import HeaderBarView from '../../../views/apps/topic-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/topic-browser/sidebar/sidebar-view.js';
import TopicsView from '../../../views/apps/topic-browser/mainbar/topics/topics-view.js';
import FooterBarView from '../../../views/apps/topic-browser/footer-bar/footer-bar-view.js';
import TopicViewerView from '../../../views/apps/topic-viewer/topic-viewer-view.js';
import PreferencesFormView from '../../../views/apps/topic-browser/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, TopicInfoShowable, {

	//
	// attributes
	//

	name: 'topic_browser',

	events: {
		'click > .body': 'onClick',
		'contextmenu > .body': 'onContextMenu'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.collection = new Topics();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// ajax methods
	//

	fetchTopics: function(collection, subscribed, options) {
		if (subscribed === true) {
			collection.fetchSubscribed(options);
		} else if (subscribed === false) {
			collection.fetchUnsubscribed(options);
		} else {
			collection.fetchAll(options);
		}
	},

	//
	// setting methods
	//

	setTopics: function(topics) {

		// set attributes
		//
		this.collection.reset(topics);
		this.search = null;

		// update main bar
		//
		if (this.collection.length == 0) {
			this.showMessage("No topics found.", {
				icon: '<i class="fa fa-hashtag"></i>'
			});
		} else {
			this.hideMessage();
		}

		// update footer bar
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},

	clear: function() {
		this.collection.reset();
	},

	reset: function() {
		/*
		this.showMessage("Search for a topic of interest!", {
			icon: '<i class="fa fa-hashtag"></i>'
		});
		this.clear();
		*/

		this.setTopics(this.topics.models);

		// update footer
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').onChange();
		}
	},

	//
	// selecting methods
	//

	select: function(which, options) {
		switch (which) {
			case 'subscribed':
				this.deselectAll();
				this.selectAll((item) => item.model.get('subscribed'));
				break;
			case 'unsubscribed':
				this.deselectAll();
				this.selectAll((item) => !item.model.get('subscribed'));
				break;
			default:
				this.getChildView('content').select(which);
				break;
		}
		if (!options || !options.silent) {
			this.onSelect();
		}
	},

	openSelected: function() {
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// open selected topics after delay
		//
		window.setTimeout(() => {
			this.showSelectedTopicPosts();
		}, delay);
	},

	//
	// searching methods
	//

	searchFor: function(search) {

		// update message
		//
		if (search) {
			this.hideMessage();
		} else {
			this.reset();
			return;
		}

		// update nav bar
		//
		this.getChildView('header nav').goto(search, {
			silent: true
		});

		// perform search
		//
		this.fetchTopics(new Topics(), this.options.subscribed, {

			// options
			//
			data: {
				search: search
			},
			subscribed: this.options.subscribed,

			// callbacks
			//
			success: (collection) => {

				// update attributes
				//
				this.search = search;

				// update views
				//
				this.setTopics(collection.models);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find topics.",
					response: response
				});
			}
		});
	},

	clearSearch: function() {

		// clear search bar
		//
		if (this.hasChildView('header search')) {
			this.getChildView('header search').remove();
		}

		// clear navigation
		//
		this.getChildView('header nav').reset();

		// clear view
		//
		this.hideMessage();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);

		// show child views
		//
		this.showHeaderBar();

		// show content
		//
		this.showTopics();

		// this.showContents();

		// show / hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}

		// show initial help message
		//
		this.showMessage("Loading topics...", {
			icon: '<i class="fa fa-spin fa-spinner"></i>',
		});
	},

	showTopics: function() {
		this.fetchTopics(this.collection, this.options.subscribed, {

			// callbacks
			//
			success: (collection) => {

				// add default topic
				//
				if (this.options.subscribed) {
					collection.add(TopicViewerView.default_topic);
				}

				// set topics
				//
				if (!this.topics) {
					this.topics = collection.clone();
				}

				this.showContents();
				this.onLoad();
			}, 

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find topics.",
					response: response
				});
			}
		});
	},

	onShow: function() {

		// set focus
		//
		this.$el.find('.search-bar input').focus();
	},

	showTopicPosts: function(topics) {
		application.launch('topic_viewer', {
			collection: new Topics(topics)
		});
	},

	showSelectedTopicPosts: function() {
		this.showTopicPosts(this.getSelectedModels());
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			hidden: this.options.hidden,
			onsave: this.options.onsave,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
	},

	getContentView: function() {
		return new TopicsView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			draggable: true,
			droppable: false,
			editable: false,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropon: (items, item) => this.onDropOn(items, item)
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

			// show add post topic dialog
			//
			application.show(new NewTopicDialogView.default({

				// callbacks
				//
				onsave: this.options.onsave
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/topic-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showInfoDialog: function(options) {
		let items = this.getSelectedModels();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items 
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show info after delay
		//
		window.setTimeout(() => {
			if (items.length == 1) {
				this.showTopicInfoDialog(items[0], options);
			} else if (items.length > 1) {
				this.showTopicsInfoDialog(items, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No items selected."
				});
			}
		}, delay);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// enable / disable send requests
		//
		this.getChildView('sidebar').setNumSelected(this.numSelected());

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onOpen: function(item) {

		// open selected topics
		//
		if (!this.options.onopen) {
			this.openSelected();
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	//
	// selection event handling methods
	//

	onChangeSelection: function() {
		
		// call superclass method
		//
		AppSplitView.prototype.onChangeSelection.call(this);

		// enable / disable send requests
		//
		this.getChildView('sidebar').setNumSelected(this.numSelected());
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});