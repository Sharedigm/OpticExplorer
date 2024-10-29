/******************************************************************************\
|                                                                              |
|                     topic-invitaton-message-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing a topic invitation message.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Topics from '../../../../../collections/topics/topics.js';
import FormView from '../../../../../views/forms/form-view.js';
import TopicsView from '../../../../../views/apps/topic-browser/mainbar/topics/topics-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="shared-topic form-group hidden-xs">
			<label class="control-label"><i class="fa fa-hashtag"></i>Topic</label>
			<div class="controls">
				<div class="topic"></div>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="1"><%= message %></textarea>
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the message to send with your topic invitation."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		topic: {
			el: '.topic',
			replaceElement: true
		}
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			message: this.options.message
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showTopic();
	},

	showTopic: function() {
		this.showChildView('topic', new TopicsView({
			collection: new Topics([this.model]),

			// options
			//
			preferences: UserPreferences.create('topic_viewer', {
				view_kind: 'names',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	}
});
