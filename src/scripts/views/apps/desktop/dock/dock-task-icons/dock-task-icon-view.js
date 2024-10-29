/******************************************************************************\
|                                                                              |
|                             dock-task-icon-view.js                           |
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
		<div class="icon" data-toggle="tooltip" title="<%= title %>">
			<svg><use href="#window-icon"></use></svg>
			<div class="window-content<% if (typeof color != 'undefined') { %> colored <%= color %><% } %>">
				<i class="<%= icon %>"></i>
			</div>
			<div class="spinner"></div>
		</div>
	`),

	//
	// querying methods
	//

	className: function() {
		return 'item';
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.model.get('icon');
	},

	getName: function() {
		return this.model.get('title');
	},

	getColor: function() {
		if (this.model && this.model.has('view')) {
			let view = this.model.get('view');
			if (view.app) {
				return view.app.getColor();
			}
		}
		return 'grey';
	},

	//
	// minimizing methods
	//

	unminimize: function() {
		let view = this.model.get('view');
		view.unminimize();

		// bring dialog to top and focus
		//
		if (view.toTop) {
			view.toTop();
		}
		view.focus();

		// remove item from task list
		//
		this.model.destroy();
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// unminimize associated window
		//
		this.unminimize();

		// block event from parent
		//
		this.block(event);
	}
});