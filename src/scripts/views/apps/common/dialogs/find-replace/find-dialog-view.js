/******************************************************************************\
|                                                                              |
|                              find-dialog-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for specifying a text search.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../views/dialogs/modal-view.js';
import FindFormView from '../../../../../views/forms/find-replace/find-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-search"></i>
					</div>
					<div class="title">
						Find
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="find-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button> 
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		form: '.find-form'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('form', new FindFormView(_.extend({}, this.options, {

			// callbacks
			//
			found: (needle, options) => {
				this.hide();

				// perform callback
				//
				if (this.options.found) {
					this.options.found(needle, options);
				}
			}
		})));
	}
});
