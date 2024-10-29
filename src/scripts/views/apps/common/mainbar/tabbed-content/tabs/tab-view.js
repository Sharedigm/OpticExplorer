/******************************************************************************\
|                                                                              |
|                                 tab-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a single tab.                    |
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

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'li',

	template: template(`
		<a href="#tab-pane<%= count %>-<%= index %>" aria-controls="tab-pane<%= count %>-<%= index %>" role="tab" data-toggle="tab">
			<span class="icon"><%= icon %></span>
			<label class="name"><%= name %></label>
			<% if (closeable) { %>
			<i class="fas fa-xmark"></i>
			<% } %>
		</a>
	`),

	attributes: {
		role: 'presentation'
	},

	events: {
		'click': 'onClick',
		'click i.fa-xmark': 'onClickClose'
	},

	thumbnailSize: 20,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.attributes.index = this.options.index;
	},

	//
	// querying methods
	//

	isActive: function() {
		return this.$el.hasClass('active');
	},

	hasPane: function() {
		return this.parent.parent.hasPaneView(this.getIndex());
	},

	//
	// getting methods
	//

	getIcon: function() {
		return null;
	},

	getName: function() {
		return this.model.getName();
	},

	getIndex: function() {
		return this.parent.collection.indexOf(this.model);
	},

	getPaneView: function() {
		return this.parent.parent.getPaneView(this.getIndex());
	},

	//
	// setting methods
	//

	setActive: function(active) {
		if (active) {
			this.$el.addClass('active');
		} else {
			this.$el.removeClass('active');
		}
	},

	setName: function(name) {
		this.$el.find('.name').html(name);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			index: this.options.index,
			count: this.options.count,
			closeable: this.options.closeable
		};
	},

	onRender: function() {

		// set initial state
		//
		if (this.options.active) {
			this.setActive(true);
		}
	},

	update: function() {
		this.setName(this.getName());
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {
		let tab = $(event.target).closest('li');
		let index = this.parent.$el.find('li').index(tab);

		// set active pane if active tab has changed
		//
		if (index != -1 && index != this.parent.getActiveIndex()) {

			// if part of tabbed content, then set active pane
			//
			if (this.parent.parent && this.parent.parent.setActiveIndex) {
				this.parent.parent.setActiveIndex(index);
			}
		}

		// perfom callback
		//
		if (this.options.onclick) {
			this.options.onclick(this.options.index);
		}
	},

	onClickClose: function(event) {
		let tab = $(event.target).closest('li');
		let index = this.parent.$el.find('li').index(tab);
		
		// perfom callback
		//
		if (this.options.onclose) {
			this.options.onclose(index);
		}
	}
});