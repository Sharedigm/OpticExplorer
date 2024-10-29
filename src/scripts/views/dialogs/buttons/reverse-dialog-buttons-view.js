/******************************************************************************\
|                                                                              |
|                       reverse-dialog-buttons-view.js                         |
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

import DialogButtonsView from '../../../views/dialogs/buttons/dialog-buttons-view.js';

export default DialogButtonsView.extend({

	//
	// attributes
	//

	className: 'buttons',

	template: template(`
		<% if (closeable) { %>
		<button type="button" class="close-btn btn btn-sm">
			<i class="fa fa-xmark"></i>
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
		
		<% if (minimizable) { %>
		<button type="button" class="minimize btn btn-sm">
			<i class="fa fa-minus"></i>
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
	}
});