/******************************************************************************\
|                                                                              |
|                             option-button-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectButtonView from '../../../../../views/apps/common/toolbars/buttons/select-button-view.js';

export default SelectButtonView.extend({

	//
	// constructor
	//

	initialize: function() {
		this.template = this.options.icon;
	},

	//
	// toggle methods
	//

	select: function(options) {

		// call superclass method
		//
		SelectButtonView.prototype.select.call(this);

		// perform action
		//
		if (!options || !options.silent) {
			this.parent.app.setOption(this.options.name, this.isSelected());
		}
	},

	deselect: function(options) {

		// call superclass method
		//
		SelectButtonView.prototype.deselect.call(this);

		// perform action
		//
		if (!options || !options.silent) {
			this.parent.app.setOption(this.options.name, this.isSelected());
		}
	}
});