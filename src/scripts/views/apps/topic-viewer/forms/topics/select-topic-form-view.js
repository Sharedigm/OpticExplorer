/******************************************************************************\
|                                                                              |
|                          select-topic-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for selecting post topics.                        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import ModelSelectorView from '../../../../../views/forms/selectors/model-selector-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="privacy form-group">
			<label class="control-label"><i class="fa fa-lock"></i>Privacy</label>
			<div class="controls" style="padding-top: 5px">
		
				<div class="radio">
					<label>
						<input type="radio" name="privacy" value="connections" checked><i class="fa fa-user-friends"></i><strong>Connections</strong>
					</label>
					- topics created by connections.
				</div>
		
				<div class="radio">
					<label>
						<input type="radio" name="privacy" value="public"><i class="fa fa-globe"></i><strong>Public</strong>
					</label>
					- topics created by anyone.
				</div>
			</div>
		</div>
		
		<div class="topic-name form-group">
			<label class="control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of the topic."></i>
			</div>
		</div>
		
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="form-control-static" style="min-height:50px"></div>
			</div>
		</div>
	`),

	regions: {
		topics: {
			el: '.selector',
			replaceElement: true
		}
	},

	events: {
		'change .privacy input': 'onChangePrivacy'
	},

	//
	// querying methods
	//

	isValid: function() {
		return this.collection.length > 0;
	},

	hasSelected: function() {
		if (this.hasChildView('topics')) {
			return this.getChildView('topics').hasSelected();
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'privacy':
				return this.$el.find('.privacy input:checked').val();
			case 'topic':
				return this.$el.find('.topic-name select').val();
		}
	},
	
	getValues: function() {
		return {
			name: this.getValue('topic')
		};
	},

	getSelected: function() {
		return this.getChildView('topics').getSelected();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showTopicSelector();

		// show description
		//
		if (this.collection.at(0)) {
			this.showDescription(this.collection.at(0).get('description'));
		}

		// validate form
		//
		this.onChange();
	},

	showTopicSelector: function() {

		// show either protected or private topics
		//
		if (this.getValue('privacy') != 'public') {
			this.collection = this.options.protectedTopics;
		} else {
			this.collection = this.options.publicTopics;
		}

		this.showChildView('topics', new ModelSelectorView({

			// options
			//
			collection: this.collection,
			initialValue: this.collection.at(0),

			// callbacks
			//
			onchange: () => this.onChangeTopic()
		}));
	},

	showDescription: function(text) {
		this.$el.find('.description .form-control-static').html(text);
	},

	//
	// event handling methods
	//

	onChangePrivacy: function() {

		// update topic selector
		//
		this.showTopicSelector();

		// notify of change
		//
		this.onChangeTopic();
	},

	onChangeTopic: function() {
		let index = this.getChildView('topics').getSelectedIndex();

		// update topic description
		//
		if (this.collection.at(index)) {
			this.showDescription(this.collection.at(index).get('description'));
		} else {
			this.showDescription('');
		}

		// validate form
		//
		this.onChange();
	}
});
