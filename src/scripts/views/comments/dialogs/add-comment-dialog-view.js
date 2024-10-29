/******************************************************************************\
|                                                                              |
|                          add-comment-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for adding new comments.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Comment from '../../../models/comments/comment.js';
import EditCommentDialogView from '../../../views/comments/dialogs/edit-comment-dialog-view.js';

export default EditCommentDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-comment"></i>
					</div>
					<div class="title">
						Add Comment
					</div>
				</div>
			</div>
			
			<div class="modal-content">
				<div class="modal-body">
					<div class="new-comment panel"></div>
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
		this.model = new Comment({
			post_id: this.options.post.get('id')
		});
	}
});