/******************************************************************************\
|                                                                              |
|                          grouped-select-button-view.js                       |
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
	// attributes
	//

	className: 'grouped select button',

	//
	// selecting methods
	//

	select: function() {

		// call superclass method
		//
		SelectButtonView.prototype.select.call(this);

		// set tool group indicator
		//
		let current = this.parent.getChildView('current');
		if (current) {
			current.setIcon(this.getIcon());
			current.setSelected(true);
		}
	},

	deselect: function() {

		// call superclass method
		//
		SelectButtonView.prototype.deselect.call(this);

		// reset tool group indicator
		//
		let current = this.parent.getChildView('current');
		if (current) {
			let first = this.parent.first();
			current.setIcon(first.getIcon());
			current.setSelected(false);
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// set tool group indicator
		//
		if (this.parent.hasChildView('current')) {

			// set initial state
			//
			if (this.options && this.options.selected) {
				let button = this.parent.getChildView('current');
				button.setIcon(this.getIcon());
				button.setSelected(true);
			}
		}
	}	
});
