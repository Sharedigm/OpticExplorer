/******************************************************************************\
|                                                                              |
|                          spectrum-info-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a spectrum.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Spectrum from '../../../../../models/optics/lights/spectrum.js';
import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import SpectrumInfoFormView from '../../../../../views/apps/spectrum-editor/forms/info/spectrum-info-form-view.js';

export default InfoDialogView.extend({

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		InfoDialogView.prototype.initialize.call(this);

		// set attributes
		//
		if (!this.model) {
			this.model = new Spectrum();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.options.file.getName() + ' Info'
		};
	},

	form: function() {
		return new SpectrumInfoFormView({
			model: this.model,

			// options
			//
			file: this.options.file,
			tab: this.options.tab,

			// callbacks
			//
			onchange: () => this.update()
		});
	}
});