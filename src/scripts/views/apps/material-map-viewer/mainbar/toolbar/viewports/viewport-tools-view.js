/******************************************************************************\
|                                                                              |
|                            viewport-tools-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonGroupView from '../../../../../../views/apps/common/toolbars/button-groups/button-group-view.js';
import ShowGridButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/viewports/buttons/show-grid-button-view.js';
import ShowAbbeAxisButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/viewports/buttons/show-abbe-axis-button-view.js';
import ShowIndexAxisButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/viewports/buttons/show-index-axis-button-view.js';
import ShowColoredViewportButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/viewports/buttons/show-colored-viewport-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="show-grid" data-toggle="tooltip" title="Show Grid"></div>
		<div id="show-abbe-axis" data-toggle="tooltip" title="Show Abbe Axis"></div>
		<div id="show-index-axis" data-toggle="tooltip" title="Show Index Axis"></div>
		<div id="show-colored-viewport" data-toggle="tooltip" title="Show Colored Viewport"></div>
	`),

	regions: {
		show_grid: '#show-grid',
		show_abbe_axis: '#show-abbe-axis',
		show_index_axis: '#show-index-axis',
		show_colored_viewport: '#show-colored-viewport'
	},

	tooltips: {
		placement: 'top'
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
		this.showChildView('show_grid', new ShowGridButtonView({
			parent: this
		}));
		this.showChildView('show_abbe_axis', new ShowAbbeAxisButtonView({
			parent: this
		}));
		this.showChildView('show_index_axis', new ShowIndexAxisButtonView({
			parent: this
		}));
		this.showChildView('show_colored_viewport', new ShowColoredViewportButtonView({
			parent: this
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.app = this.getParentView('app');
		this.getChildView('show_grid').activate();
		this.getChildView('show_abbe_axis').activate();
		this.getChildView('show_index_axis').activate();
		this.getChildView('show_colored_viewport').activate();
	}
});
