/******************************************************************************\
|                                                                              |
|                            dialog-buttons-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of the header bar buttons for a dialog box.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'buttons',

	template: template(`
		<% if (minimizable) { %>
		<button type="button" class="minimize btn btn-sm">
			<i class="fa fa-minus"></i>
		</button>
		<% } %>
		
		<% if (maximizable) { %>
		<button type="button" class="maximize btn btn-sm">
			<i class="far fa-window-maximize"></i>
		</button>
		<button type="button" class="unmaximize btn btn-sm">
			<i class="far fa-window-restore"></i>
		</button>
		<% } %>
		
		<% if (closeable) { %>
		<button type="button" class="close-btn btn btn-sm">
			<i class="fa fa-xmark"></i>
		</button>
		<% } %>
	`),
	
	events: {

		// mouse events
		//
		'click .minimize': 'onClickMinimize',
		'click .maximize': 'onClickMaximize',
		'click .unmaximize': 'onClickUnmaximize',
		'click .close-btn': 'onClickClose'
	},

	//
	// querying methods
	//

	hasDesktop: function() {
		return $('#desktop').length > 0;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			minimizable: this.hasDesktop() && this.parent.minimizable,
			maximizable: this.hasDesktop() && this.parent.maximizable,
			closeable: this.parent.closeable
		};
	},

	//
	// mouse event handling methods
	//

	onClickMinimize: function() {
		this.parent.minimize();
	},

	onClickMaximize: function() {
		this.parent.maximize();
	},

	onClickUnmaximize: function() {
		this.parent.unmaximize();
	},

	onClickClose: function() {
		this.parent.hide();
	}
});
