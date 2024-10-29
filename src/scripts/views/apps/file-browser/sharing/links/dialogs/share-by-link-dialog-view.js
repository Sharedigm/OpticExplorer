/******************************************************************************\
|                                                                              |
|                         share-by-link-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for choosing between creating a new             |
|        link or sharing an existing link.                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../../views/dialogs/modal-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-link"></i>
					</div>
					<div class="title">
						Share by Link
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>This item already has one or more links.  Would you like to create a new link or share an existing link?</p>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="new-link btn btn-primary" data-dismiss="modal">
							<i class="fa fa-magic"></i>New Link
						</button>
						<button class="share-existing-link btn" data-dismiss="modal">
							<i class="fa fa-link"></i>Share Existing Link
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, ModalView.prototype.events, {
		'click .new-link': 'onClickNewLink',
		'click .share-existing-link': 'onClickShareExistingLink'
	}),

	//
	// mouse event handling methods
	//

	onClickNewLink: function() {
		import(
			'../../../../../../views/apps/file-browser/sharing/links/dialogs/new-link-dialog-view.js'
		).then((NewLinkDialogView) => {

			// show new link dialog
			//
			application.show(new NewLinkDialogView.default({
				target: this.model
			}));
		});
	},

	onClickShareExistingLink: function() {
		this.opener.showItemInfoDialog(this.model, {
			tab: 'links'
		});
	}
});