/******************************************************************************\
|                                                                              |
|                          new-volume-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for creating new volumes.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Volume from '../../../../../models/storage/directories/volume.js';
import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import VolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/volume-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-database"></i>
					</div>
					<div class="title">
						New Volume
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="save btn btn-primary">
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

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .save': 'onClickSave'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.tiny,
	// resizable: false,
	// modal: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormDialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new Volume();
	},

	//
	// rendering methods
	//

	form: function(options) {
		return new VolumeFormView(_.extend({}, options, {
			model: this.model
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSave: function() {
		this.getChildView('form').apply();

		// perform callback
		//
		if (this.options.onsave) {
			this.options.onsave(this.getChildView('form').getValues());
		}

		// close dialog
		//
		this.hide();
	}
});
