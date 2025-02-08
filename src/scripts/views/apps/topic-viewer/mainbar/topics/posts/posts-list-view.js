/******************************************************************************\
|                                                                              |
|                              posts-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of posts.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import CollectionView from '../../../../../../views/collections/collection-view.js';
import SelectableContainable from '../../../../../../views/behaviors/containers/selectable-containable.js';
import PostView from '../../../../../../views/apps/post-viewer/mainbar/posts/post-view.js';

export default CollectionView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	className: 'posts panels',

	template: template(`
		<% if (collapsable) { %>
		<div class="buttons">
			<span class="expander">
				<button type="button" class="expand btn-sm" data-toggle="tooltip" title="Expand">
					<i class="fa fa-caret-down"></i>	
				</button>
				<button type="button" class="collapse btn-sm" data-toggle="tooltip" title="Collapse">
					<i class="fa fa-caret-up"></i>
				</button>
			</span>
		</div>
		<% } %>
	`),

	events: {

		// mouse events
		//
		'mousedown': 'onMouseDown',
		'click .top.buttons #expand:first': 'onClickExpand',
		'click .top.buttons #collapse:first': 'onClickCollapse',

		// touch events
		//
		'tap': 'onTap'
	},

	//
	// views
	//

	childView: PostView,
	emptyView: BaseView.extend({
		className: 'empty post panel',
		template: template('No posts.')
	}),

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.collapsable == undefined) {
			this.options.collapsable = false;
		}
		if (this.options.collapsed == undefined) {
			this.options.collapsed = true;
		}
	},

	//
	// setting methods
	//

	setCollapsed: function(collapsed) {
		if (collapsed) {
			this.$el.find('.collapsable').addClass('collapsed');
		} else {
			this.$el.find('.collapsed').removeClass('collapsed');
		}
	},

	//
	// collapsing methods
	//

	collapse: function() {
		this.$el.find('li').addClass('collapsed');

		// update collapse icon
		//
		this.$el.find('.collapse:first').hide();
		this.$el.find('.expand:first').show();

		// play 'collapse' sound
		//
		application.play('collapse');
	},

	expand: function() {
		this.$el.find('li').removeClass('collapsed');

		// update collapse icon
		//
		this.$el.find('.collapse:first').show();
		this.$el.find('.expand:first').hide();

		// play 'expand' sound
		//
		application.play('expand');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collapsable: this.options.collapsable && this.collection.length > 0
		};
	},

	onRender: function() {

		// add multicolumn styling
		//
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}

		if (this.options.condensed) {
			this.$el.addClass('options-hidden');
		}
	},
	
	childViewOptions: function() {
		return {

			// options
			//
			show_elapsed_time: this.options.show_elapsed_time,
			preferences: this.options.preferences,

			// state
			//
			collapsed: this.options.collapsed,
			selected: this.options.selected,

			// capabilities
			//
			editable: this.options.editable,
			collapsable: this.options.collapsable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}; 
	},

	update: function() {

		// update all children
		//
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			child.update();
		}
	},

	//
	// event handling methods
	//

	onDelete: function() {

		// perform callback
		//
		if (this.options.ondelete) {
			this.options.ondelete();
		}
	},
	
	//
	// mouse event handling methods
	//

	onClick: function(event) {
		/*
		if (this.$el.is(event.target)) {
			this.deselectAll();
		}
		*/

		if (event.target.type != 'button' && event.target.type != 'submit') {
			this.deselectAll();
		}
	},

	onClickCollapse: function(event) {
		this.collapse();

		// block event from parent
		//
		this.block(event);
	},

	onClickExpand: function(event) {
		this.expand();

		// block event from parent
		//
		this.block(event);
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.children.each((child) => {
			if (child.onKeyDown) {
				child.onKeyDown(event);
			}
		});
	}
}));