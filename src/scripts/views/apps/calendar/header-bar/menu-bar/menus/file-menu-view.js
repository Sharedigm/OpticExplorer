/******************************************************************************\
|                                                                              |
|                               file-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/file-menu-view.js';

export default FileMenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="command shortcut">enter</span></a>
		</li>

		<li role="presentation">
			<a class="new-event"><i class="fa fa-file"></i>New Event<span class="command shortcut">E</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="open-date dropdown-toggle"><i class="fa fa-folder-open"></i>Open<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="open-prev"><i class="fa fa-arrow-left"></i>Prev<span class="shortcut">left arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-next"><i class="fa fa-arrow-right"></i>Next<span class="shortcut">right arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-up"><i class="fa fa-arrow-up"></i>Up<span class="shortcut">up arrow</span></a>
				</li>
		
				<li role="presentation" style="display:none">
					<a class="open-current"><i class="fa fa-redo"></i>Current<span class="shortcut">down arrow</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="delete-event"><i class="fa fa-trash-alt"></i>Delete Event<span class="shortcut">delete</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-event': 'onClickNewEvent',
		'click .open-prev': 'onClickPrev',
		'click .open-next': 'onClickNext',
		'click .open-up': 'onClickUp',
		'click .open-current': 'onClickCurrent',
		'click .delete-event': 'onClickDeleteEvent',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	visible: function() {
		return {
			'new-event': true,
			'close-window': true
		};
	},

	enabled: function() {
		let preferences = this.parent.app.preferences;
		let isSignedIn = application.isSignedIn();
		let hasSelected = this.parent.app.hasSelected();

		return {
			'new-window': true,
			'new-event': isSignedIn,
			'open-prev': true,
			'open-next': true,
			'open-up': preferences.get('view_kind') == 'day',
			'open-current': true,
			'delete-event': isSignedIn && hasSelected,
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickNewEvent: function() {
		this.parent.app.newEvent();
	},

	onClickPrev: function() {
		this.parent.app.goto('prev');
	},

	onClickNext: function() {
		this.parent.app.goto('next');
	},

	onClickUp: function() {
		this.parent.app.goto('up');
	},

	onClickCurrent: function() {
		this.parent.app.goto('current');
	},

	onClickDeleteEvent: function() {
		this.parent.app.deleteEvents(this.parent.app.getSelectedModels());
	}
});