/******************************************************************************\
|                                                                              |
|                       clipboard-confirm-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification modal dialog box that is used to          |
|        prompt the user for confirmation to proceed with some action.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import ModalView from '../../../../../views/dialogs/modal-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-clipboard"></i>
					</div>
					<div class="title">
						Clipboard Not Empty
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p><i class="alert-icon fa fa-3x fa-question-circle" style="float:left; margin-left:10px; margin-right:20px"></i>The clipboard already contains <%= clipboard.numItems() %> items.  You can replace or merge the existing clipboard items with the selected items. </p>
		
					<div class="items" style="height:120px"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="replace btn btn-primary" data-dismiss="modal">
							<i class="fa fa-exchange"></i>Replace
						</button>
						<button class="merge btn" data-dismiss="modal">
							<i class="fa fa-plus"></i>Merge
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button> 
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		'items': '.items'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .replace': 'onClickReplace',
		'click .merge': 'onClickMerge',
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog attributes
	//

	resizable: true,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			clipboard: this.model
		};
	},

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showClipboardFiles();
	},

	showClipboardFiles: function() {
		this.showChildView('items', new FilesView({
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: 'icons',
				detail_kind: null,
				show_hidden_files: false,
				sort_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// mouse event handling methods
	//

	onClickReplace: function() {
		if (this.options.replace) {
			return this.options.replace();
		}
	},

	onClickMerge: function() {
		if (this.options.merge) {
			return this.options.merge();
		}
	},

	onClickCancel: function() {
		if (this.options.cancel) {
			return this.options.cancel();
		}
	}
});
