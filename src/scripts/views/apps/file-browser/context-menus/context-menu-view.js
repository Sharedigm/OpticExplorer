/******************************************************************************\
|                                                                              |
|                             context-menu-view.js                             |
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

import File from '../../../../models/storage/files/file.js';
import ImageFile from '../../../../models/storage/media/image-file.js';
import Directory from '../../../../models/storage/directories/directory.js';
import ContextMenuView from '../../../../views/apps/common/context-menus/context-menu-view.js';
import FileDisposable from '../../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';

export default ContextMenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="new-folder"><i class="fa fa-folder"></i>New Folder<span class="command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-with"><i class="fa fa-folder-open"></i>Open With</a>
		</li>
		
		<li role="presentation">
			<a class="open-selected"><i class="fa fa-folder-open"></i>Open Selected<span class="shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-in-new-window"><i class="fa fa-folder-open"></i>Open in New Window</a>
		</li>
		
		<li role="presentation">
			<a class="upload-item"><i class="fa fa-upload"></i>Upload<span class="command shortcut">U</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-on-map"><i class="fa fa-map"></i>Show on Map<span class="command shortcut">M</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="share dropdown-toggle"><i class="fa fa-share"></i>Share<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="share-by-invitation"><i class="fa fa-user-friends"></i>By Invitation</a>
				</li>
		
				<li role="separator" class="divider"></li>
		
				<li role="presentation">
					<a class="share-by-topic"><i class="fa fa-newspaper"></i>By Discussion Topic</a>
				</li>
		
				<li role="presentation">
					<a class="share-by-message"><i class="fa fa-comments"></i>By Chat Messsage</a>
				</li>
		
				<li role="separator" class="divider"></li>
		
				<li role="presentation">
					<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
				</li>
		
				<li role="presentation">
					<a class="share-by-email"><i class="fa fa-envelope"></i>By Email</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="rename-item"><i class="fa fa-font"></i>Rename<span class="shift command shortcut">R</span></a>
		</li>
		
		<li role="presentation">
			<a class="compress-item"><i class="fa fa-compress"></i>Compress<span class="shift command shortcut">Z</span></a>
		</li>
		
		<li role="presentation">
			<a class="download-item"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="set-profile"><i class="fa fa-user"></i>Set Profile Picture</a>
		</li>
		
		<li role="presentation">
			<a class="set-background"><i class="fa fa-desktop"></i>Set Background Picture</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="delete-item"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation">
			<a class="empty-trash"><i class="fa fa-trash-alt"></i>Empty Trash<span class="command shortcut">E</span></a>
		</li>
		
		<% if (is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="change-background"><i class="fa fa-image"></i>Change Background</a>
		</li>
		<% } %>
	`),

	events: _.extend({}, ContextMenuView.prototype.events, {
		'click .new-folder': 'onClickNewFolder',
		'click .open-item': 'onClickOpenItem',
		'click .open-with': 'onClickOpenWith',
		'click .open-selected': 'onClickOpenSelected',
		'click .open-in-new-window': 'onClickOpenInNewWindow',
		'click .upload-item': 'onClickUpload',
		'click .show-info': 'onClickShowInfo',
		'click .show-on-map': 'onClickShowOnMap',

		// share with connections
		//
		'click .share-by-invitation': 'onClickShareByInvitation',
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// other options
		//
		'click .rename-item': 'onClickRename',
		'click .compress-item': 'onClickCompress',
		'click .download-item': 'onClickDownloadItem',

		// picture options
		//
		'click .set-profile': 'onClickSetProfile',
		'click .set-background': 'onClickSetBackground',

		// desktop options
		//
		'click .delete-item': 'onClickDelete',
		'click .empty-trash': 'onClickEmptyTrash',
		'click .change-background': 'onClickChangeBackground'
	}),

	//
	// querying methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();
		let numSelected = this.parent.numSelected();
		let hasSelected = numSelected != 0;
		let oneSelected = numSelected == 1;
		let hasSelectedFolder = oneSelected && this.parent.getSelectedModels()[0] instanceof Directory;
		let hasSelectedPicture = oneSelected && this.parent.getSelectedModels()[0] instanceof ImageFile;
		let isDesktop = this.parent.isDesktop();

		return {
			'new-folder': !hasSelected,
			'open-item': hasSelected,
			'open-with': hasSelected,
			'open-selected': false,
			'open-in-new-window': hasSelectedFolder && !isDesktop,
			'open-favorites': isSignedIn,
			'upload-item': !hasSelected,
			'share': hasSelected,
			'show-info': hasSelected,
			'show-on-map': hasSelected,
			'rename-item': hasSelected,
			'compress-item': hasSelected,
			'download-item': hasSelected,
			'set-profile': hasSelectedPicture,
			'set-background': hasSelectedPicture,
			'delete-item': hasSelected,
			'empty-trash': !hasSelected,
			'change-background': !hasSelected
		};
	},

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let numSelected = this.parent.numSelected();
		let oneSelected = numSelected == 1;
		let hasSelected = numSelected != 0;
		let isWritable = this.parent.model.isWritableBy(application.session.user);
		let isTrashEmpty = FileDisposable.isTrashEmpty();
		let hasSelectedFile = oneSelected && this.parent.getSelectedModels()[0] instanceof File;
		let hasSelectedPicture = oneSelected && this.parent.getSelectedModels()[0] instanceof ImageFile;
		let hasSelectedGeolocated = this.parent.hasSelectedGeolocated();

		return {
			'new-folder': isWritable,
			'open-item': isSignedIn,
			'open-with': isSignedIn && hasSelectedFile,
			'open-selected': oneSelected,
			'open-in-new-window': oneSelected,
			'upload-item': isWritable,
			'show-info': hasSelected,
			'show-on-map': hasSelectedGeolocated,

			// share with connections
			//
			'share-by-invitation': hasSelected,
			'share-by-topic': hasSelected,
			'share-by-message': hasSelected,

			// share with anyone
			//
			'share-by-link': oneSelected,
			'share-by-email': oneSelected,

			// picture options
			//
			'set-profile': hasSelectedPicture,
			'set-background': hasSelectedPicture,

			// other options
			//
			'rename-item': oneSelected && isWritable,
			'compress-item': hasSelected && isWritable,
			'download-item': hasSelected,
			'delete-item': isWritable,
			'empty-trash': !isTrashEmpty,
			'change-background': !hasSelected
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			is_desktop: this.parent.isDesktop()
		};
	},

	//
	// mouse event handling methods
	//

	onClickNewFolder: function() {
		this.parent.newFolder();
	},

	onClickOpenItem: function() {
		this.parent.openItems(this.parent.getSelectedModels());
	},

	onClickOpenWith: function() {
		this.parent.showOpenWithDialog(this.parent.getSelectedModels());
	},

	onClickOpenSelected: function() {
		let selected = this.parent.getSelectedModels();
			if (selected.length == 1) {
				this.parent.openItems([selected[0]]);
		}
	},

	onClickOpenInNewWindow: function() {
		let selected = this.parent.getSelectedModels();
		if (selected.length == 1) {
			this.parent.openItems([selected[0]], {
				'open_folders_in_new_window': true
			});
		}
	},

	onClickUpload: function() {
		this.parent.upload();
	},

	onClickShowInfo: function() {
		this.parent.showInfoDialog();
	},

	onClickShowOnMap: function() {
		application.launch('map_viewer', {
			photos: this.parent.getSelectedGeolocatedModels()
		});
	},

	onClickShareByInvitation: function() {
		this.parent.shareSelectedWithConnections();
	},

	onClickShareByTopic: function() {
		this.parent.shareSelectedByTopic();
	},

	onClickShareByMessage: function() {
		this.parent.shareSelectedByMessage();
	},

	onClickShareByLink: function() {
		this.parent.shareSelectedByLink();
	},

	onClickShareByEmail: function() {
		this.parent.shareSelectedByEmail();
	},

	onClickRename: function() {
		this.parent.rename(this.parent.getChildren((item) => item.isSelected()));
	},

	onClickCompress: function() {
		this.parent.compress();
	},

	onClickDownloadItem: function() {
		this.parent.download();
	},

	onClickSetProfile: function() {
		application.setProfilePhoto(this.parent.getSelectedModels()[0]);
	},

	onClickSetBackground: function() {
		application.desktop.setBackgroundPicture(this.parent.getSelectedModels()[0]);
	},

	onClickDelete: function(event) {
		this.parent.deleteItems(this.parent.getSelectedModels(), {
			confirm: !(event.metaKey || event.ctrlKey)
		});
	},

	onClickEmptyTrash: function() {
		this.parent.emptyTrash();
	},
	
	onClickChangeBackground: function() {
		application.launch('theme_manager', {
			tab: 'desktop',
			tab2: 'background'
		});
	}
});