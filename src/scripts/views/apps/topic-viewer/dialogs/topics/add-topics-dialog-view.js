/******************************************************************************\
|                                                                              |
|                          add-topics-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to add a new topic.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../../../models/topics/topic.js';
import DialogView from '../../../../../views/dialogs/dialog-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-hashtag"></i>
					</div>
					<div class="title">
						Add Topics
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">	
					<div class="buttons">
						<button class="add-topics btn btn-primary" data-dismiss="modal" disabled>
							<i class="fa fa-plus"></i>Add Topics
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		topic_browser: {
			el: '.modal-body',
			replaceElement: true
		},
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .add-topics': 'onClickAddTopics'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.small,
	icon: '<i class="fa fa-plus"></i>',
	title: "Add Topics",

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.title) {
			this.title = this.options.title;
		}

		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this);

		// set default attributes
		//
		if (!this.model) {
			this.model = application.getDirectory();
		}
	},

	//
	// adding methods
	//

	addTopic: function(topic) {
		topic.addMember(application.session.user, {

			// callbacks
			//
			success: (data) => {
				this.close();

				let topic = new Topic(data, {
					parse: true
				});

				// perform callback
				//
				if (this.options.onadd) {
					this.options.onadd([topic]);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not add topic.",
					response: response
				});
			}
		});
	},

	addTopics: function(topics) {
		if (topics && topics.length > 0) {
			for (let i = 0; i < topics.length; i++) {
				this.addTopic(topics[i]);
			}
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.modal-footer .add-topics').prop('disabled', disabled);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			title: this.title
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showTopicBrowser();
	},

	showTopicBrowser: function() {
		this.showChildApp('topic_browser', {
			model: this.model,

			// options
			//
			search: '',
			subscribed: false,

			// state
			//
			selected: this.options.selected,

			// callbacks
			//
			onopen: (items) => this.onOpen(items),
			onchange: () => this.onChange(),
			onselect: () => this.update(),
			ondeselect: () => this.update(),
			onsave: (item) => this.onSave(item)
		});
	},

	onShown: function() {

		// call superclass method
		//
		DialogView.prototype.onShown.call(this);

		// set focus to search input
		//
		this.$el.find('input[type="search"]').focus();
	},

	update: function() {

		// update buttons
		//
		this.setDisabled(!this.getChildView('topic_browser').hasSelected());
	},

	//
	// event handling methods
	//

	onOpen: function(items) {

		// add topics on open
		//
		if (!this.options.onopen) {
			this.onClickAddTopics();
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(items);
		}
	},

	onSave: function(item) {

		// perform callback
		//
		if (this.options.onsave) {
			this.options.onsave(item);
		}
	},

	//
	// mouse event handling methods
	//

	onClickAddTopics: function() {

		// add selected topics
		//
		this.addTopics(this.getChildView('topic_browser').getSelectedModels());
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('topic_browser').onKeyDown(event);
	}
});