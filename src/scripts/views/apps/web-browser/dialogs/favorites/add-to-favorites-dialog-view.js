/******************************************************************************\
|                                                                              |
|                        add-to-favorites-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for adding items to user favorites.             |
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
import FavoritesFormView from '../../../../../views/apps/web-browser/forms/favorites-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-star"></i>
					</div>
					<div class="title">
						Add to Favorites
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
		
					<div class="buttons">
						<button class="save btn btn-primary" data-dismiss="modal" disabled>
							<i class="fa fa-save"></i>Save
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
		'click .save': 'onClickSave',
		'click .cancel': 'onClickCancel'
	}),

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.save').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new FavoritesFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//

	onClickSave: function() {
		if (this.getChildView('form').apply()) {

			// perform callback
			//
			if (this.options.onsave) {
				this.options.onsave(this.model);
			}
		}
	}
});
