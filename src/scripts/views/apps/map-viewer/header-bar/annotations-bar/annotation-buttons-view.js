/******************************************************************************\
|                                                                              |
|                         annotation-buttons-view.js                           |
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

import BaseView from '../../../../../views/base-view.js';
// import ButtonGroupView from '../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import RectAnnotationButtonView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/buttons/rect-annotation-button-view.js';
import OvalAnnotationButtonView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/buttons/oval-annotation-button-view.js';
import LineAnnotationButtonView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/buttons/line-annotation-button-view.js';
import ArrowAnnotationButtonView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/buttons/arrow-annotation-button-view.js';
import PolygonAnnotationButtonView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/buttons/polygon-annotation-button-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	className: 'tools',

	template: template(`
		<div class="rect-annotation" data-toggle="tooltip" title="Rectangle" data-placement="right"></div>
		<div class="oval-annotation" data-toggle="tooltip" title="Oval" data-placement="right"></div>
		<div class="line-annotation" data-toggle="tooltip" title="Line" data-placement="right"></div>
		<div class="arrow-annotation" data-toggle="tooltip" title="Arrow" data-placement="right"></div>
		<div class="polygon-annotation" data-toggle="tooltip" title="Polygon" data-placement="right"></div>
	`),

	regions: {
		rect: '.rect-annotation',
		oval: '.oval-annotation',
		line: '.line-annotation',
		arrow: '.arrow-annotation',
		polygon: '.polygon-annotation'
	},

	//
	// querying methods
	//

	first: function() {
		return this.getChildView(Object.keys(this._regions)[0]);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('rect', new RectAnnotationButtonView({
			model: this.model
		}));
		this.showChildView('oval', new OvalAnnotationButtonView({
			model: this.model
		}));
		this.showChildView('line', new LineAnnotationButtonView({
			model: this.model
		}));
		this.showChildView('arrow', new ArrowAnnotationButtonView({
			model: this.model
		}));
		this.showChildView('polygon', new PolygonAnnotationButtonView({
			model: this.model
		}));

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// selecting methods
	//

	select: function(button) {
		if (this.selectedButton) {
			this.selectedButton.deselect();
		}
		button.setSelected(true);
		this.selectedButton = button;
	},

	deselect: function(button) {
		button.setSelected(false);
		this.selectedButton = null;
	},

	//
	// event handling methods
	//

	onActivate: function() {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.activate) {
				childView.activate();
			}
		}
	}
});
