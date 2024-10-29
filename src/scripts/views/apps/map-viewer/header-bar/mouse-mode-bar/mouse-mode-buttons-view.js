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
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import SelectRectButtonView from '../../../../../views/apps/map-viewer/header-bar/mouse-mode-bar/buttons/select-rect-button-view.js';
import SelectCircleButtonView from '../../../../../views/apps/map-viewer/header-bar/mouse-mode-bar/buttons/select-circle-button-view.js';
import MeasureButtonView from '../../../../../views/apps/map-viewer/header-bar/mouse-mode-bar/buttons/measure-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//
	
	tools: template(`
		<div class="select-rect" data-toggle="tooltip" title="Select Rect" data-placement="bottom"></div>
		<div class="select-circle" data-toggle="tooltip" title="Select Circle" data-placement="bottom"></div>
		<div class="measure" data-toggle="tooltip" title="Measure" data-placement="bottom"></div>
	`),

	regions: {
		select_rect: '.select-rect',
		select_circle: '.select-circle',
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
		this.showChildView('select_circle', new SelectCircleButtonView({
			model: this.model,
			selected: this.options.selected == 'select_circle'
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
		this.getChildView('select_circle').activate();
		this.getChildView('measure').activate();
	}
});
