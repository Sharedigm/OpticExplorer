/******************************************************************************\
|                                                                              |
|                             topics-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
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
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ContainableSelectable from '../../../../../views/behaviors/containers/containable-selectable.js';
import TopicsView from '../../../../../views/apps/topic-browser/mainbar/topics/topics-view.js';

export default SideBarPanelView.extend(_.extend({}, ContainableSelectable, {

	//
	// attributes
	//

	className: 'topics panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-hashtag"></i>Topics</label>
		
			<div class="buttons">
				<button type="button" class="add-topics success btn btn-sm" data-toggle="tooltip" title="Add Topics">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	events: {
		'click .add-topics': 'onClickAddTopics'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Topics();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('items').getSelected();
	},

	//
	// setting methods
	//

	setSelectedModel: function(model, options) {
		this.getChildView('items').setSelectedModels([model], options);
	},

	//
	// fetching methods
	//

	fetchTopics: function(done) {
		this.collection.fetch({

			// callbacks
			//
			success: () => {

				// perform callback
				//
				if (done) {
					done(this.collection);
				}

				// perform callback
				//
				if (this.options.onload) {
					this.options.onload(this.collection);
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// show child views
		//
		this.showTopics();
			
		// fetch topics
		//
		this.request = this.fetchTopics((collection) => {

			// add topics to list
			//
			this.collection.add(collection.toArray());

			// add default (General) topic
			//
			this.collection.add(this.parent.app.getDefaultTopic());
		});	
	},

	showTopics: function() {
		this.showChildView('items', new TopicsView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('topic_viewer', {
				view_kind: this.options.view_kind
			}),

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			selectable: true,
			deselectable: true,
			editable: false,
			draggable: true,
			droppable: true,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddTopics: function() {
		this.app.showAddTopicsDialog();
	}
}));