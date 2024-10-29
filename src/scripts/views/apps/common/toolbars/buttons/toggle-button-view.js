/******************************************************************************\
|                                                                              |
|                              toggle-button-view.js                           |
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

import ButtonView from '../../../../../views/apps/common/toolbars/buttons/button-view.js';

export default ButtonView.extend({
	
	//
	// querying methods
	//

	isSelected: function() {
		return this.$el.hasClass('selected');
	},

	//
	// setting methods
	//

	setSelected: function(selected) {
		if (selected) {
			this.$el.addClass('selected');
		} else {
			this.$el.removeClass('selected');
		}
	},

	//
	// selecting methods
	//

	select: function() {
		if (this.isSelected()) {
			return;
		}

		// update
		//
		this.setSelected(true);
	},

	deselect: function() {
		if (!this.isSelected()) {
			return;
		}

		// update
		//
		this.setSelected(false);
	},

	toggle: function() {

		// toggle selection
		//
		if (!this.isSelected()) {
			this.select();
		} else {
			this.deselect();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set initial state
		//
		if (this.options.selected) {
			this.setSelected(true);
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		this.toggle();

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(this);
		}
	}	
});