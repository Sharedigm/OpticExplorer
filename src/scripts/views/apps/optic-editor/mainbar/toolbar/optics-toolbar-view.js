/******************************************************************************\
|                                                                              |
|                               optics-toolbar-view.js                         |
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
import GeneralToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/general/general-tools-view.js';
import ViewportToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/viewports/viewport-tools-view.js';
import OpticToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/optics/optic-tools-view.js';
import EditToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/edit/edit-tools-view.js';
import LightToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/lights/light-tools-view.js';
import ObjectToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/objects/object-tools-view.js';
import MaterialToolsView from '../../../../../views/apps/optic-editor/mainbar/toolbar/materials/material-tools-view.js';
import CurrentMaterialView from '../../../../../views/apps/optic-editor/mainbar/toolbar/current-material-view.js';
import CommonGlasses from '../../../../../collections/optics/materials/catalogs/common-glasses.js';

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
		<div id="optic-tools"></div>
		<div id="edit-tools"></div>
		<div id="light-tools"></div>
		<div id="object-tools"></div>
		<div id="material-tools"></div>
		<div id="current-material"></div>
	`),

	regions: {
		general_tools: '#general-tools',
		viewport_tools: '#viewport-tools',
		optic_tools: '#optic-tools',
		edit_tools: '#edit-tools',
		light_tools: '#light-tools',
		object_tools: '#object-tools',
		material_tools: '#material-tools',
		current_material: '#current-material'
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
		this.showOpticTools();
		this.showEditTools();
		this.showLightTools();
		this.showObjectTools();
		this.showMaterialTools();
		this.showCurrentMaterial();

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});
	},

	onAttach: function() {

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

	showOpticTools: function() {
		this.showChildView('optic_tools', new OpticToolsView({
			parent: this
		}));
	},

	showEditTools: function() {
		this.showChildView('edit_tools', new EditToolsView({
			parent: this
		}));
	},

	showLightTools: function() {
		this.showChildView('light_tools', new LightToolsView({
			parent: this
		}));
	},

	showObjectTools: function() {
		this.showChildView('object_tools', new ObjectToolsView({
			parent: this
		}));
	},

	showMaterialTools: function() {
		this.showChildView('material_tools', new MaterialToolsView({
			parent: this
		}));
	},

	showCurrentMaterial: function() {
		this.showChildView('current_material', new CurrentMaterialView({
			model: CommonGlasses.named('BK7'),
			parent: this
		}));
	}
}));