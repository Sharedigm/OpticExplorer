/******************************************************************************\
|                                                                              |
|                           material-tools-view.js                             |
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
import ApplyMaterialButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/materials/buttons/apply-material-button-view.js';
import SampleMaterialButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/materials/buttons/sample-material-button-view.js';
import MaterialMapButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/materials/buttons/material-map-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="sample-material" data-toggle="tooltip" title="Sample Material"></div>
		<div id="apply-material" data-toggle="tooltip" title="Apply Material"></div>
		<div id="material-map" data-toggle="tooltip" title="View Material Map"></div>
	`),

	regions: {
		sample_material: '#sample-material',
		apply_material: '#apply-material',
		material_map: '#material-map'
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
		this.showChildView('sample_material', new SampleMaterialButtonView({
			parent: this
		}));
		this.showChildView('apply_material', new ApplyMaterialButtonView({
			parent: this
		}));
		this.showChildView('material_map', new MaterialMapButtonView({
			parent: this
		}));
	}
});
