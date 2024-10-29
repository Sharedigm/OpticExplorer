/******************************************************************************\
|                                                                              |
|                           preferences-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topics from '../../../../../collections/topics/topics.js';
import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';
import ModelSelectorView from '../../../../../views/forms/selectors/model-selector-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="default-topic form-group">
			<label class="control-label"><i class="fa fa-hashtag"></i>Default Topic</label>
			<div class="controls">
				<div class="selector"></div>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Topic" data-content="This is the topic that is initially shown."></i>
			</div>
		</div>
		
		<div class="posts-per-page form-group">
			<label class="control-label"><i class="fa fa-long-arrow-alt-down"></i>Posts / Page</label>
			<div class="controls">
				<div class="range-input"></div>
		
				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Posts / Page" data-content="This is the number of posts to display per page."></i>
				</div>
			</div>
		</div>
		
		<div class="posts-direction form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Posts Direction</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="posts-direction" value="top_down"<% if (posts_direction == 'top_down') { %> checked<% } %>>Top Down</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="posts-direction" value="bottom_up"<% if (posts_direction == 'bottom_up') { %> checked<% } %>>Bottom Up</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Posts Direction" data-content="This is layout direction to use for the posts view."></i>
			</div>
		</div>
		
		<div class="default-privacy form-group">
			<label class="control-label"><i class="fa fa-lock"></i>Default Privacy</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="default-privacy" value="connections"<% if (default_privacy != 'public') { %> checked<% } %>>Connections</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="default-privacy" value="public"<% if (default_privacy == 'public') { %> checked<% } %>>Public</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Default Privacy" data-content="This is default privacy setting to use when creating new posts."></i>
			</div>
		</div>
		
		<div class="show-items form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Show</label>
			<div class="controls">
		
				<div class="show-comments checkbox-inline">
					<label><input type="checkbox"<% if (show_comments) { %> checked<% } %>>Comments</label>
					
					<i class="active fa fa-question-circle" data-toggle="popover" title="Comments" data-content="This determines if post comments are initially shown or hidden."></i>
				</div>
		
				<div class="show-elapsed-time checkbox-inline">
					<label><input type="checkbox"<% if (show_elapsed_time) { %> checked<% } %>>Elapsed Time</label>
					
					<i class="active fa fa-question-circle" data-toggle="popover" title="Comments" data-content="This determines if post comments are initially shown or hidden."></i>
				</div>
				
				<div class="show-options checkbox-inline">
					<label><input type="checkbox"<% if (show_options) { %> checked<% } %>>Options Buttons</label>
		
					<i class="active fa fa-question-circle" data-toggle="popover" title="Options Buttons" data-content="This determines if the option buttons (like, comment, reply) are shown. These functions are also available via the menu so these buttons are provided as a convenience."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		topics: {
			el: '.selector',
			replaceElement: true
		},
		posts_per_page: '.posts-per-page .range-input'
	},

	events: {
		'change .default-topic select': 'onChangeOption',
		'change .posts-per-page input': 'onChangeOption',
		'change .posts-direction input': 'onChangeOption',
		'change .default-privacy input': 'onChangeDefaultPrivacy',
		'change .show-comments input': 'onChangeCheckbox',
		'change .show-options input': 'onChangeCheckbox',
		'change .show-elapsed-time input': 'onChangeCheckbox'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'default_topic':
				return this.$el.find('.default-topic select').val();
			case 'posts_per_page':
				return Math.round(this.getChildView('posts_per_page').getValue());
			case 'posts_direction':
				return this.$el.find('.posts-direction input:checked').val();
			case 'default_privacy':
				return this.$el.find('.default-privacy input:checked').val();
			case 'show_comments':
				return this.$el.find('.show-comments input').is(':checked');
			case 'show_options':
				return this.$el.find('.show-options input').is(':checked');
			case 'show_elapsed_time':
				return this.$el.find('.show-elapsed-time input').is(':checked');
		}
	},

	getValues: function() {
		return {
			default_topic: this.getValue('default_topic'),
			posts_per_page: this.getValue('posts_per_page'),
			posts_direction: this.getValue('posts_direction'),
			default_privacy: this.getValue('default_privacy'),
			show_comments: this.getValue('show_comments'),
			show_options: this.getValue('show_options'),
			show_elapsed_time: this.getValue('show_elapsed_time')
		};
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showRegion('posts_per_page');

		// fetch topics and load
		//
		if (!this.collection) {
			this.collection = new Topics();
			this.request = this.collection.fetch({

				// callbacks
				//
				success: () => this.onLoad()
			});
		} else {
			this.onLoad();
		}
	},

	showRegion: function(name) {
		switch (name) {
			case 'topics':
				this.showTopics();
				break;
			case 'posts_per_page':
				this.showPostsPerPage();
				break;
		}
	},

	showTopics: function() {
		this.showChildView('topics', new ModelSelectorView({
			collection: this.collection,

			// options
			//
			initialValue: this.model.get('topic'),

			// callbacks
			//
			// onchange: (value) => this.onChangeValue('topic', value)
		}));
	},

	showPostsPerPage: function() {
		this.showChildView('posts_per_page', new RangeInputView({

			// options
			//
			value: this.model.get('posts_per_page'),
			min: 1,
			max: 100,
			step: 1,
			scale: 'logarithmic'
		}));
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.showRegion('topics');
	},

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangeOption: function(event) {
		let className = $(event.target).closest('.form-group').attr('class');
		let option = className.replace('form-group', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);	
	},

	onChangeDefaultPrivacy: function() {
		this.onChangeValue('default_privacy', this.getValue('default_privacy'));
	},

	onChangeCheckbox: function(event) {
		let className = $(event.target).closest('.checkbox-inline').attr('class');
		let option = className.replace('checkbox-inline', '').trim().replace(/-/g, '_');
		let value = this.getValue(option);
		this.onChangeValue(option, value);	
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});
