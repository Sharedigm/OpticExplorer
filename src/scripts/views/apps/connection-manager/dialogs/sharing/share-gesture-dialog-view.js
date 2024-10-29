/******************************************************************************\
|                                                                              |
|                             share-gesture-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for sharing a gesture.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import GestureFormView from '../../../../../views/apps/connection-manager/forms/gestures/gesture-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-hand-pointer"></i>
					</div>
					<div class="title">
						Share Gesture
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
		
				<div class="modal-footer">	
					<div class="buttons">
						<button class="send btn btn-primary" data-dismiss="modal">
							<i class="fa fa-envelope"></i>Send
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormModalView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// rendering methods
	//

	form: function() {
		return new GestureFormView();
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {
		if (this.options.onsubmit) {
			this.options.onsubmit(this.getChildView('form').getValue('gesture_kind'));
		}
	}
});
