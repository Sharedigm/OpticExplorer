/******************************************************************************\
|                                                                              |
|                                dock-icon-view.js                             |
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

import IconView from '../../../../views/items/icons/icon-view.js';

export default IconView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="icon<% if (typeof color != 'undefined') { %> colored <%= color %><% } %>" data-toggle="tooltip" title="<%= title %>">
			<i class="<%= icon %>"></i>
			<div class="spinner"></div>
		</div>
	`),
	editable: false,

	events: _.extend({}, IconView.prototype.events, {
		'click': 'onClick'
	}),

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		IconView.prototype.select.call(this, _.extend({
			animated: false
		}, options));
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			title: this.getName(),
			color: this.getColor()
		};
	},

	onRender: function() {
		if (this.has('disabled') && this.get('disabled')) {
			this.$el.addClass('disabled');
		}

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// call superclass method
		//
		IconView.prototype.onMouseDown.call(this, event);

		// remove icon tooltips
		//
		this.removeTooltips();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// clear tooltips
		//
		this.removeTooltips();
	}
});