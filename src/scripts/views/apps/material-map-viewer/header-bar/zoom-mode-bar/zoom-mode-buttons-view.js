/******************************************************************************\
|                                                                              |
|                               zoom-mode-view.js                              |
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
import FitMapButtonView from '../../../../../views/apps/material-map-viewer/header-bar/zoom-mode-bar/buttons/fit-map-button-view.js';
import FitMaterialsButtonView from '../../../../../views/apps/material-map-viewer/header-bar/zoom-mode-bar/buttons/fit-materials-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//
	
	tools: template(`
		<div class="fit-map" data-toggle="tooltip" title="Fit Map" data-placement="bottom"></div>
		<div class="fit-materials" data-toggle="tooltip" title="Fit Materials" data-placement="bottom"></div>
	`),

	regions: {
		fit_map: '.fit-map',
		fit_materials: '.fit-materials'
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

	setZoomMode: function(mode) {
		let viewport = this.getParentView('app').getActiveViewport();
		let offset = viewport.getMapOffset();
		let scale;

		switch (mode) {
			case 'fit_map':
				scale = viewport.getMapScale();
				break;
			case 'fit_materials':
				scale = viewport.getMarkersScale();
				break;
		}

		viewport.transformTo(offset, scale, {
			duration: 1000
		});
	},

	//
	// zooming methods
	//

	zoomTo: function(zoom) {
		this.parent.zoomTo(zoom);
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
		this.showChildView('fit_map', new FitMapButtonView({
			model: this.model,
		}));
		this.showChildView('fit_materials', new FitMaterialsButtonView({
			model: this.model,
		}));
	}
});
