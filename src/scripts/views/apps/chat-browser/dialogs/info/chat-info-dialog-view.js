/******************************************************************************\
|                                                                              |
|                           chat-info-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a chat            |
|        session.                                                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import ChatInfoFormView from '../../../../../views/apps/chat-browser/forms/info/chat-info-form-view.js';

export default InfoDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-comments"></i>
					</div>
					<div class="title">
						Chat Info
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.model.getName() + " Chat Info"
		};
	},

	form: function() {
		return new ChatInfoFormView({
			model: this.model
		});
	}
});
