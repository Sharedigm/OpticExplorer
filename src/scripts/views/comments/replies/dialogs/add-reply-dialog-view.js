/******************************************************************************\
|                                                                              |
|                            add-reply-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for adding new replies.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Reply from '../../../../models/comments/reply.js';
import EditReplyDialogView from '../../../../views/comments/replies/dialogs/edit-reply-dialog-view.js';

export default EditReplyDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-reply"></i>
					</div>	
					<div class="title">
						Add Reply
					</div>
				</div>
			</div>
			
			<div class="modal-content">
				<div class="modal-body">
					<div class="new-reply panel"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="submit btn btn-primary" data-dismiss="modal" disabled>
							<i class="active fa fa-save"></i>Save
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.comment) {
			this.model = new Reply({
				comment_id: this.options.comment.get('id')
			});
		} else if (this.options.reply) {
			this.model = new Reply({
				reply_id: this.options.reply.get('id')
			});
		}
	}
});