/******************************************************************************\
|                                                                              |
|                                abbe-toolbar-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for the optics widget side toolbar.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import Collapsable from '../../../../../views/apps/common/toolbars/behaviors/collapsable.js';
import Dockable from '../../../../../views/apps/common/toolbars/behaviors/dockable.js';
import Rotatable from '../../../../../views/apps/common/toolbars/behaviors/rotatable.js';
import GeneralToolsView from '../../../../../views/apps/material-map-viewer/mainbar/toolbar/general/general-tools-view.js';
import ViewportToolsView from '../../../../../views/apps/material-map-viewer/mainbar/toolbar/viewports/viewport-tools-view.js';
import MaterialToolsView from '../../../../../views/apps/material-map-viewer/mainbar/toolbar/materials/material-tools-view.js';
import DiagramToolsView from '../../../../../views/apps/material-map-viewer/mainbar/toolbar/diagrams/diagram-tools-view.js';

export default ToolbarView.extend(_.extend({}, Collapsable, Dockable, Rotatable, {

	//
	// attributes
	//

	className: 'vertical toolbar',

	template: _.template(`
		<div class="handle"></div>
		
		<div class="controls">
			<div class="expander">
				<i id="collapse" class="active fa fa-caret-left" data-toggle="tooltip" title="Collapse"></i>
				<i id="expand" class="active fa fa-caret-right" data-toggle="tooltip" title="Expand" style="display:none"></i>
			</div>
		
			<div class="rotator">
				<i id="horizontal" class="active fa fa-caret-up" data-toggle="tooltip" title="Horizontal"></i>
				<i id="vertical" class="active fa fa-caret-down" data-toggle="tooltip" title="Vertical" style="display:none"></i>
			</div>
		</div>

		<div id="general-tools"></div>
		<div id="viewport-tools"></div>
		<div id="material-tools"></div>
		<div id="diagram-tools"></div>
	`),

	regions: {
		general_tools: '#general-tools',
		viewport_tools: '#viewport-tools',
		material_tools: '#material-tools',
		diagram_tools: '#diagram-tools'
	},

	events: _.extend({}, Collapsable.events, Dockable.events, Rotatable.events),

	tooltips: {
		container: 'body',
		placement: 'top'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showGeneralTools();
		this.showViewportTools();
		this.showMaterialTools();
		this.showDiagramTools();

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});
	},

	onAttach: function() {
		this.app = this.getParentView('app');

		// call mixin method
		//
		Dockable.onAttach.call(this);

		// activate tools
		//
		this.onActivate();
	},

	showGeneralTools: function() {
		this.showChildView('general_tools', new GeneralToolsView({
			parent: this
		}));
	},

	showViewportTools: function() {
		this.showChildView('viewport_tools', new ViewportToolsView({
			parent: this
		}));
	},

	showMaterialTools: function() {
		this.showChildView('material_tools', new MaterialToolsView({
			parent: this
		}));
	},

	showDiagramTools: function() {
		this.showChildView('diagram_tools', new DiagramToolsView({
			parent: this
		}));
	}
}));