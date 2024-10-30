/******************************************************************************\
|                                                                              |
|                          mouse-mode-buttons-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import SelectRectButtonView from '../../../../../views/apps/material-map-viewer/header-bar/mouse-mode-bar/buttons/select-rect-button-view.js';
import MeasureButtonView from '../../../../../views/apps/material-map-viewer/header-bar/mouse-mode-bar/buttons/measure-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//
	
	tools: template(`
		<div class="select-rect" data-toggle="tooltip" title="Select Rect" data-placement="bottom"></div>
		<div class="measure" data-toggle="tooltip" title="Measure" data-placement="bottom"></div>
	`),

	regions: {
		select_rect: '.select-rect',
		measure: '.measure'
	},

	//
	// getting methods
	//

	getValue: function() {
		for (let key in this.regions) {
			if (this.selectedButton == this.getChildView(key)) {
				return key;
			}
		}
	},

	//
	// setting methods
	//

	setValue: function(selected) {
		if (selected) {
			this.getChildView(selected).select();
		} else if (this.selectedButton) {
			this.selectedButton.deselect();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ButtonGroupView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('select_rect', new SelectRectButtonView({
			model: this.model,
			selected: this.options.selected == 'select_rect'
		}));
		this.showChildView('measure', new MeasureButtonView({
			model: this.model,
			selected: this.options.selected == 'measure',
			preferences: this.options.preferences
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.getChildView('select_rect').activate();
		this.getChildView('measure').activate();
	}
});
