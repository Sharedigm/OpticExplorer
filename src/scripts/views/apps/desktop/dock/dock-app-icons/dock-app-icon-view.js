/******************************************************************************\
|                                                                              |
|                              dock-app-icon-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an icon used in the app launcher dock.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DockIconView from '../../../../../views/apps/desktop/dock/dock-icon-view.js';

export default DockIconView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="icon<% if (typeof color != 'undefined') { %> colored <%= color %><% } %>" data-toggle="tooltip" title="<%= title %>">
			<image src="<%= image %>" />
			<i class="<%= icon %>"></i>
			<div class="spinner"></div>
		</div>
		
		<div class="<% if (hidden) { %>hidden <% } %>indicator"></div>
	`),

	//
	// constructor
	//

	initialize: function() {
		this.app = application.getApp(this.get('id'));
		this.listenTo(this.app, 'change', this.onChange);
	},

	//
	// querying methods
	//

	className: function() {
		return this.get('id').replace('_', '-') + ' item';
	},

	isHidden: function() {
		return !this.has('count') || this.app.get('count') == 0;
	},

	//
	// getting methods
	//

	getImage: function() {
		if (this.model.has('image')) {
			return 'images/icons/apps/' + this.model.get('image');
		} else {
			return 'images/icons/apps/' + this.model.get('app') + '.svg';	
		}
	},

	getIcon: function() {
		return this.model.get('icon');
	},

	getName: function() {
		return this.model.get('name');
	},

	getColor: function() {
		return this.model.get('color');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			title: this.getName(),
			color: this.getColor(),
			hidden: this.isHidden()
		};
	},

	//
	// app event handling methods
	//

	onChange: function() {
		if (this.isHidden()) {
			this.$el.find('.indicator').addClass('hidden');
		} else {
			this.$el.find('.indicator').removeClass('hidden');
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// call superclass method
		//
		DockIconView.prototype.onClick.call(this, event);

		// open item
		//
		if (!this.isLoading()) {
			this.open(this);
		}
	}
});