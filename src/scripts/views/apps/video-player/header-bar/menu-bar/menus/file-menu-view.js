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
		'click .open-file': 'onClickOpenFile',
		'click .open-first': 'onClickOpenFirst',
		'click .open-prev': 'onClickOpenPrev',
		'click .open-next': 'onClickOpenNext',
		'click .open-last': 'onClickOpenLast',
		'click .show-info': 'onClickShowInfo',
		'click .download-file': 'onClickDownloadFile',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isOpen = this.parent.app.model != undefined;
		let isMultiple = this.parent.app.collection.length > 1;

		return {
			'new-window': true,
			'open-file': true,
			'open-clip': isMultiple,
			'open-first': isMultiple,
			'open-prev': isMultiple,
			'open-next': isMultiple,
			'open-last': isMultiple,
			'show-info': isOpen,
			'download-file': isOpen,
			'close-window': true
		};
	},
	
	//
	// mouse event handling methods
	//

	onClickOpenFile: function() {
		this.parent.app.showOpenDialog();
	},

	onClickOpenFirst: function() {
		this.parent.app.setClipNumber(this.parent.app.getClipNumber('first'));
	},

	onClickOpenPrev: function() {
		this.parent.app.setClipNumber(this.parent.app.getClipNumber('prev', {
			wraparound: true
		}));
	},

	onClickOpenNext: function() {
		this.parent.app.setClipNumber(this.parent.app.getClipNumber('next', {
			wraparound: true
		}));
	},

	onClickOpenLast: function() {
		this.parent.app.setClipNumber(this.parent.app.getClipNumber('last'));
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},
	
	onClickDownloadFile: function() {
		this.parent.app.downloadFile();
	}
});