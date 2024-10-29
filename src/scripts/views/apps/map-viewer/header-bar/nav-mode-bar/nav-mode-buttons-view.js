/******************************************************************************\
|                                                                              |
|                           nav-mode-buttons-view.js                           |
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
import PanButtonView from '../../../../../views/apps/map-viewer/header-bar/nav-mode-bar/buttons/pan-button-view.js';
import ZoomButtonView from '../../../../../views/apps/map-viewer/header-bar/nav-mode-bar/buttons/zoom-button-view.js';
import ZoomRectButtonView from '../../../../../views/apps/map-viewer/header-bar/nav-mode-bar/buttons/zoom-rect-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//
	
	tools: template(`
		<div class="pan" data-toggle="tooltip" title="Pan" data-placement="bottom"></div>
		<div class="zoom" data-toggle="tooltip" title="Zoom" data-placement="bottom"></div>
		<div class="zoom-rect" data-toggle="tooltip" title="Zoom Rect" data-placement="bottom"></div>
	`),

	regions: {
		pan: '.pan',
		zoom: '.zoom',
		zoom_rect: '.zoom-rect'
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
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.getChildView('pan').activate();
		this.getChildView('zoom').activate();
		this.getChildView('zoom_rect').activate();
	}
});
