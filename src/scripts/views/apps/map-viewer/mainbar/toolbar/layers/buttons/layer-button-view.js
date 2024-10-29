/******************************************************************************\
|                                                                              |
|                              layer-button-view.js                            |
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

import ToggleButtonView from '../../../../../../../views/apps/common/toolbars/buttons/toggle-button-view.js';

export default ToggleButtonView.extend({

	//
	// constructor
	//

	initialize: function() {
		this.template = this.options.icon;
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.app = this.getParentView('app');
	},

	//
	// toggle methods
	//

	select: function(options) {

		// call superclass method
		//
		ToggleButtonView.prototype.select.call(this);

		// perform action
		//
		if (!options || !options.silent) {
			let className = this.options.name.replace(/_/g, '-');
			this.app.setLayerVisibility(this.options.name, this.isSelected());
			this.app.getChildView('header menu view').setItemSelected(className, true);
		}
	},

	deselect: function(options) {

		// call superclass method
		//
		ToggleButtonView.prototype.deselect.call(this);

		// perform action
		//
		if (!options || !options.silent) {
			let className = this.options.name.replace(/_/g, '-');
			this.app.setLayerVisibility(this.options.name, this.isSelected());
			this.app.getChildView('header menu view').setItemSelected(className, false);
		}
	}
});
