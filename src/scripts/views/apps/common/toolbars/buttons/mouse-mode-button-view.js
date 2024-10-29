/******************************************************************************\
|                                                                              |
|                            mouse-mode-button-view.js                         |
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

	className: 'mouse-mode button',

	//
	// activation methods
	//

	on: function() {

		// turn on behaviors
		//
		if (this.behaviors) {
			for (let i = 0; i < this.behaviors.length; i++) {
				this.behaviors[i].on();
			}
		}
	},

	off: function() {

		// turn off behaviors
		//
		if (this.behaviors) {
			for (let i = 0; i < this.behaviors.length; i++) {
				this.behaviors[i].off();
			}
		}
	},

	//
	// selecting methods
	//

	select: function() {

		// call superclass method
		//
		SelectButtonView.prototype.select.call(this);
		
		// update button
		//
		this.setSelected(true);

		// update selected button
		//
		let app = this.getParentView('app');
		if (app) {
			if (app.selectedButton) {
				app.prevSelectedButton = app.selectedButton;
				app.selectedButton.deselect();
			}
			app.selectedButton = this;
		}

		// set mouse mode cursor
		//
		if (this.cursor) {
			app.getActiveViewport().setCursor(this.cursor);
		}

		// activate behaviors
		//
		this.on();

		// set tool group indicator
		//
		if (this.parent.hasChildView('current')) {
			let current = this.parent.getChildView('current');
			current.setIcon(this.getIcon());
			current.setSelected(true);
		}
	},

	deselect: function() {

		// call superclass method
		//
		SelectButtonView.prototype.deselect.call(this);

		// update button
		//
		this.setSelected(false);

		// update selected button
		//
		let app = this.getParentView('app');
		if (app) {
			if (app.selectedButton == this) {
				app.prevSelectedButton = app.selectedButton;
				app.selectedButton = null;
			}
		}

		// reset mouse mode cursor
		//
		if (this.cursor) {
			app.getActiveViewport().resetCursor();
		}

		// deactivate behaviors
		//
		this.off();

		// reset tool group indicator
		//
		if (this.parent.hasChildView('current')) {
			let current = this.parent.getChildView('current');
			let first = this.parent.first();
			current.setIcon(first.getIcon());
			current.setSelected(false);
		}
	},

	revert: function() {
		let app = this.getParentView('app');
		let prev = app.prevSelectedButton;
		this.deselect();
		if (prev) {
			prev.select();
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// set tool group indicator
		//
		if (this.parent.hasChildView('current')) {
			if (this.options.selected) {
				let button = this.parent.getChildView('current');
				button.setIcon(this.getIcon());
				button.setSelected(true);
			}
		}

		// allow one mouse mode per app
		//
		this.app = this.getParentView('app');
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// deactivate behaviors
		//
		this.off();
	}
});