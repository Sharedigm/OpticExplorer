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
		'click .new-file': 'onClickNewFile',
		'click .new-window': 'onClickNewWindow',
		'click .open-file': 'onClickOpenFile',
		'click .show-info': 'onClickShowInfo',
		'click .save-file': 'onClickSaveFile',
		'click .save-as': 'onClickSaveAs',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let file = this.parent.app.model;
		let directory = file? file.parent : undefined;
		let isSignedIn = application.isSignedIn();
		let isDirectoryReadable = directory? directory.isReadableBy(application.session.user) : isSignedIn;
		let isDirty = this.parent.app.isDirty();
		let isWritable = file? file.isWritableBy(application.session.user) : false;

		return {
			'new-file': true,
			'new-window': true,
			'open-file': isDirectoryReadable,
			'show-info': file != undefined && !file.isNew(),
			'save-file': isSignedIn && isDirty && isWritable,
			'save-as': isSignedIn,
			'close-window': true
		};
	},
	
	//
	// event handling methods
	//

	onChange: function() {
		let file = this.parent.app.model;
		if (!file.isNew() && file.isWritableBy(application.session.user)) {
			this.setItemEnabled('save-file');
		}
	},

	onSave: function() {
		this.setItemDisabled('save-file');
	},

	//
	// mouse event handling methods
	//

	onClickNewFile: function() {
		this.parent.app.newFile();
	},

	onClickOpenFile: function() {
		this.parent.app.openFile();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},
	
	onClickSaveFile: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickCloseWindow: function() {
		this.parent.app.close();
	}
});