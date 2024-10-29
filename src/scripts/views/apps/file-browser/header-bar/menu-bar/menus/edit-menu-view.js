/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="cut"><i class="fa fa-cut"></i>Cut<span class="command shortcut">X</span></a>
		</li>
		
		<li role="presentation">
			<a class="copy"><i class="fa fa-copy"></i>Copy<span class="command shortcut">C</span></a>
		</li>

		<li role="presentation">
			<a class="duplicate"><i class="fa fa-copy"></i>Duplicate<span class="shift command shortcut">D</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="paste"><i class="fa fa-paste"></i>Paste<span class="command shortcut">V</span></a>
		</li>
		
		<li role="presentation">
			<a class="put"><i class="fa fa-paste"></i>Put<span class="shift command shortcut">V</span></a>
		</li>

		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="delete"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>

		<li role="presentation">
			<a class="destroy"><i class="fa fa-xmark"></i>Destroy<span class="shift command shortcut">delete</span></a>
		</li>

		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-clipboard"><i class="fa fa-clipboard"></i>Show Clipboard</span></a>
		</li>
		
		<li role="presentation">
			<a class="clear-clipboard"><i class="fa fa-xmark"></i>Clear Clipboard</a>
		</li>
	`),

	events: {
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .duplicate': 'onClickDuplicate',
		'click .paste': 'onClickPaste',
		'click .put': 'onClickPut',
		'click .delete': 'onClickDelete',
		'click .destroy': 'onClickDestroy',
		'click .show-clipboard': 'onClickShowClipboard',
		'click .clear-clipboard': 'onClickClearClipboard'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();
		let hasClipboardContents = !this.parent.app.isClipboardEmpty();

		return {
			'cut': hasSelected,
			'copy': hasSelected,
			'duplicate': hasSelected,
			'paste': hasClipboardContents,
			'put': hasClipboardContents,
			'delete': hasSelected,
			'destroy': hasSelected,
			'show-clipboard': true,
			'clear-clipboard': hasClipboardContents
		};
	},

	//
	// deleting methods
	//

	deleteSelected: function(options) {
		
		// delete and update
		//
		this.parent.app.deleteSelected(_.extend({}, options, {

			// callbacks
			//
			success: () => {

				// update menu item
				//
				this.parent.getChildView('file').setItemEnabled('empty-trash');
			}
		}));
	},

	destroySelected: function(options) {

		// destroy and update
		//
		this.parent.app.destroySelected(_.extend({}, options, {

			// callbacks
			//
			success: () => {

				// update menu item
				//
				this.parent.getChildView('file').setItemEnabled('empty-trash');
			}
		}));
	},
	
	//
	// event handling methods
	//

	onLoad: function() {

		// check permissions
		//
		if (!this.parent.app.model.isWritableBy(application.session.user)) {
			this.setDisabled(true);
		}

		// disable paste
		//
		if (!application.session.user || 
			this.parent.app.isClipboardEmpty()) {
			this.setItemDisabled('clear-clipboard');
		}

		// call superclass method
		//
		MenuView.prototype.onLoad.call(this);
	},

	onClickCut: function() {
		this.parent.app.cutSelected({
			confirm: this.parent.app.preferences.get('show_clipboard_confirm'),

			// callbacks
			//
			success: () => this.update()
		});
	},

	onClickCopy: function() {
		this.parent.app.copySelected({
			confirm: this.parent.app.preferences.get('show_clipboard_confirm'),

			// callbacks
			//
			success: () => this.update()
		});
	},

	onClickDuplicate: function() {
		this.parent.app.duplicate(this.parent.app.getSelectedModels());
	},

	onClickPaste: function() {
		this.parent.app.paste();
	},

	onClickPut: function() {
		this.parent.app.paste({

			// callbacks
			//
			success: () => {
				this.parent.app.getActiveView().clearClipboard({

					// callbacks
					//
					success: () => this.update()
				});
			}
		});
	},

	onClickDelete: function(event) {

		// delete selected with or without confirmation
		//
		this.deleteSelected({
			confirm: !(event.metaKey || event.ctrlKey)
		});
	},

	onClickDestroy: function(event) {

		// destroy selected with or without confirmation
		//
		this.destroySelected({
			confirm: !(event.metaKey || event.ctrlKey)
		});
	},

	onClickShowClipboard: function() {
		this.parent.app.getActiveView().fetchClipboardDirectory({

			// callbacks
			//
			success: (model) => {
				application.launch('file_browser', {
					model: model
				});
			}
		});
	},

	onClickClearClipboard: function() {
		this.parent.app.getActiveView().clearClipboard({

			// callbacks
			//
			success: () => {
				this.update();

				// play delete sound
				//
				application.play('recycle');
			}
		});
	}
});