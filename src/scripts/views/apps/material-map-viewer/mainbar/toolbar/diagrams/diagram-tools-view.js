/******************************************************************************\
|                                                                              |
|                             diagram-tools-view.js                            |
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
import ShowRegionsButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/diagrams/buttons/show-regions-button-view.js';
import ShowEdgesButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/diagrams/buttons/show-edges-button-view.js';
import ShowVerticesButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/diagrams/buttons/show-vertices-button-view.js';
import ShowLabelsButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/diagrams/buttons/show-labels-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="show-regions" data-toggle="tooltip" title="Show Regions"></div>
		<div id="show-edges" data-toggle="tooltip" title="Show Edges"></div>
		<div id="show-vertices" data-toggle="tooltip" title="Show Vertices"></div>
		<div id="show-labels" data-toggle="tooltip" title="Show Labels"></div>
	`),

	regions: {
		'show_regions': '#show-regions',
		'show_edges': '#show-edges',
		'show_vertices': '#show-vertices',
		'show_labels': '#show-labels'
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
		this.showChildView('show_regions', new ShowRegionsButtonView({
			parent: this
		}));
		this.showChildView('show_edges', new ShowEdgesButtonView({
			parent: this
		}));
		this.showChildView('show_vertices', new ShowVerticesButtonView({
			parent: this
		}));
		this.showChildView('show_labels', new ShowLabelsButtonView({
			parent: this
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.app = this.getParentView('app');
		this.getChildView('show_regions').activate();
		this.getChildView('show_edges').activate();
		this.getChildView('show_vertices').activate();
		this.getChildView('show_labels').activate();
	}
});
