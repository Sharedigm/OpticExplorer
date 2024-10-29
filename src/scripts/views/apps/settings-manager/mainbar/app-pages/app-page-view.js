/******************************************************************************\
|                                                                              |
|                                app-page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an app page and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PageView from '../../../../../views/items/pages/page-view.js';

export default PageView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="row">
			<div class="icon">
				<%= image %>
				<%= icon %>
			</div>
		</div>
		
		<div class="row">
			<div class="name" spellcheck="false"><%= name %></div>
		
			<% if (typeof details != 'undefined') { %>
			<div class="specifics"><span class="details"><%= details %></span></div>
			<% } %>	
		</div>
	`),

	//
	// getting methods
	//

	getImage: function() {
		return this.model.getImage();
	},

	getIcon: function() {
		return this.model.getIcon();
	},

	getName: function() {
		return this.model.getName();
	},

	//
	// setting methods
	//

	setColor: function(color) {
		if (color && color != 'none') {
			this.$el.find('.icon').addClass('colored ' + color);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			name: this.getName()
		};
	},

	onRender: function() {

		// call superclass method
		//
		PageView.prototype.onRender.call(this);

		// make icon into desktop preview
		//
		this.$el.find('.icon').addClass('desktop preview');	

		// make name into a title
		//
		this.$el.find('.name').addClass('title');	

		// set color
		//
		if (this.model.has('color')) {
			this.setColor(this.model.get('color'));
		}
	}
});