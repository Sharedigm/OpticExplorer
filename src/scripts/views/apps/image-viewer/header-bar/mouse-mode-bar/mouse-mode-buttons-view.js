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
import PanButtonView from '../../../../../views/apps/image-viewer/header-bar/mouse-mode-bar/buttons/pan-button-view.js';
import ZoomButtonView from '../../../../../views/apps/image-viewer/header-bar/mouse-mode-bar/buttons/zoom-button-view.js';
import ZoomRectButtonView from '../../../../../views/apps/image-viewer/header-bar/mouse-mode-bar/buttons/zoom-rect-button-view.js';
import MeasureButtonView from '../../../../../views/apps/image-viewer/header-bar/mouse-mode-bar/buttons/measure-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//
	
	tools: template(`
		<div class="pan" data-toggle="tooltip" title="Pan" data-placement="bottom"></div>
		<div class="zoom" data-toggle="tooltip" title="Zoom" data-placement="bottom"></div>
		<div class="zoom-rect" data-toggle="tooltip" title="Zoom Rect" data-placement="bottom"></div>
		<div class="measure" data-toggle="tooltip" title="Measure" data-placement="bottom"></div>
	`),

	regions: {
		pan: '.pan',
		zoom: '.zoom',
		zoom_rect: '.zoom-rect',
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
		this.showChildView('pan', new PanButtonView({
			model: this.model,
			selected: this.options.selected == 'pan'
		}));
		this.showChildView('zoom', new ZoomButtonView({
			model: this.model,
			selected: this.options.selected == 'fit_width'
		}));
		this.showChildView('zoom_rect', new ZoomRectButtonView({
			model: this.model,
			selected: this.options.selected == 'zoom_rect'
		}));
		this.showChildView('measure', new MeasureButtonView({
			model: this.model,
			selected: this.options.selected == 'measure'
		}));
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.getChildView('pan').onLoad();
		this.getChildView('zoom').onLoad();
		this.getChildView('zoom_rect').onLoad();
		this.getChildView('measure').onLoad();
	}
});