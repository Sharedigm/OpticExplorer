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