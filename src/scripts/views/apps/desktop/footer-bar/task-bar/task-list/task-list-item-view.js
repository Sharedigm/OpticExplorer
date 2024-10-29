/******************************************************************************\
|                                                                              |
|                               task-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a single item from a task list.                          |
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
		<div class="icon" data-toggle="tooltip" title="<%= title %>">
			<i class="<%= icon %>" ></i>
		</div>
		<div class="title">
			<%= title %>
		</div>
	`),
	
	events: {
		'click': 'onClick'
	},

	//
	// setting methods
	//

	setColor: function(color) {
		if (color && color != 'none') {
			this.$el.addClass('colored ' + color);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.model.get('title'),
			icon: this.model.get('icon')
		};
	},

	onRender: function() {
		let app = this.model.get('view').app;

		// set color
		//
		if (app) {
			this.setColor(app.getColor());
		}

		this.addTooltips();
	},

	//
	// mouse event hanlding methods
	//

	onClick: function(event) {
		let view = this.model.get('view');
		view.unminimize();

		// bring dialog to top and focus
		//
		if (view.toTop) {
			view.toTop();
		}
		view.focus();

		// destroy item
		//
		this.model.destroy();

		// block event from parent
		//
		this.block(event);
	}
});