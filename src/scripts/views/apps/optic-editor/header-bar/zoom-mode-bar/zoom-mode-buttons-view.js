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
import FitAllButtonView from '../../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/buttons/fit-all-button-view.js';
import FitOpticsButtonView from '../../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/buttons/fit-optics-button-view.js';
import FitObjectsButtonView from '../../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/buttons/fit-objects-button-view.js';
import FitImagesButtonView from '../../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/buttons/fit-images-button-view.js';
import ActualSizeButtonView from '../../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/buttons/actual-size-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: template(`
		<div class="fit-all" data-toggle="tooltip" title="Fit All" data-placement="bottom"></div>
		<div class="fit-optics" data-toggle="tooltip" title="Fit Optics" data-placement="bottom"></div>
		<div class="fit-objects" data-toggle="tooltip" title="Fit Objects" data-placement="bottom"></div>
		<div class="fit-images" data-toggle="tooltip" title="Fit Images" data-placement="bottom"></div>
		<div class="actual-size" data-toggle="tooltip" title="Actual Size" data-placement="bottom"></div>
	`),

	regions: {
		fit_all: '.fit-all',
		fit_optics: '.fit-optics',
		fit_objects: '.fit-objects',
		fit_images: '.fit-images',
		actual_size: '.actual-size'
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
		let offset, scale;

		switch (mode) {
			case 'fit_all':
				offset = viewport.getItemsOffset('all');
				scale = viewport.getItemsScale('all');
				break;
			case 'fit_optics':
				offset = viewport.getItemsOffset('optics');
				scale = viewport.getItemsScale('optics');
				break;
			case 'fit_objects':
				offset = viewport.getItemsOffset('objects, optics');
				scale = viewport.getItemsScale('objects, optics');
				break;
			case 'fit_images':
				offset = viewport.getItemsOffset('optics, images');
				scale = viewport.getItemsScale('optics, images');
				break;
			case 'actual_size':
				offset = viewport.getItemsOffset('optics');
				scale = 1;
				break;
		}

		if (offset || scale) {
			if (!offset) {
				viewport.scaleTo(scale, {
					duration: 1000
				});
			} else {
				viewport.transformTo(offset, scale, {
					duration: 1000
				});
			}
		}
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
		this.showChildView('fit_all', new FitAllButtonView({
			selected: this.options.selected == 'fit_all'
		}));
		this.showChildView('fit_optics', new FitOpticsButtonView({
			selected: this.options.selected == 'fit_optics'
		}));
		this.showChildView('fit_objects', new FitObjectsButtonView({
			selected: this.options.selected == 'fit_objects'
		}));
		this.showChildView('fit_images', new FitImagesButtonView({
			selected: this.options.selected == 'fit_images'
		}));
		this.showChildView('actual_size', new ActualSizeButtonView({
			selected: this.options.selected == 'actual_size'
		}));
	}
});