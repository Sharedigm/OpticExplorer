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
			<a class="open-file"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="open-clip dropdown-toggle"><i class="fa fa-file-video"></i>Open Clip<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="open-first"><i class="fa fa-fast-backward"></i>First<span class="shortcut">up arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-prev"><i class="fa fa-backward"></i>Prev<span class="shortcut">left arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-next"><i class="fa fa-forward"></i>Next<span class="shortcut">right arrow</a>
				</li>
		
				<li role="presentation">
					<a class="open-last"><i class="fa fa-fast-forward"></i>Last<span class="shortcut">down arrow</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="download-file"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
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
		'click .open-file': 'onClickOpenFile',
		'click .open-first': 'onClickOpenFirst',
		'click .open-prev': 'onClickOpenPrev',
		'click .open-next': 'onClickOpenNext',
		'click .open-last': 'onClickOpenLast',
		'click .show-info': 'onClickShowInfo',
		'click .download-file': 'onClickDownloadFile',
		'click .close-window': 'onClickCloseWindow',
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