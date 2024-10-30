/******************************************************************************\
|                                                                              |
|                               light-tools-view.js                            |
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
import AddPointLightButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/lights/buttons/add-point-light-button-view.js';
import AddDistantLightButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/lights/buttons/add-distant-light-button-view.js';
import AddLightBeamButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/lights/buttons/add-light-beam-button-view.js';
import AddLightRayButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/lights/buttons/add-light-ray-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="add-distant-light" data-toggle="tooltip" title="Add Distant Light"></div>
		<div id="add-point-light" data-toggle="tooltip" title="Add Point Light"></div>
		<div id="add-light-beam" data-toggle="tooltip" title="Add Light Beam"></div>
		<div id="add-light-ray" data-toggle="tooltip" title="Add Light Ray"></div>
	`),

	regions: {
		add_distant_light: '#add-distant-light',
		add_point_light: '#add-point-light',
		add_light_beam: '#add-light-beam',
		add_light_ray: '#add-light-ray'
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
		this.showChildView('add_distant_light', new AddDistantLightButtonView({
			parent: this
		}));
		this.showChildView('add_point_light', new AddPointLightButtonView({
			parent: this
		}));
		this.showChildView('add_light_beam', new AddLightBeamButtonView({
			parent: this
		}));
		this.showChildView('add_light_ray', new AddLightRayButtonView({
			parent: this
		}));
	}
});
