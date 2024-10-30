/******************************************************************************\
|                                                                              |
|                              object-tools-view.js                            |
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
import AddSceneObjectButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/objects/buttons/add-scene-object-button-view.js';
import AddDistantObjectButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/objects/buttons/add-distant-object-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="add-scene-object" data-toggle="tooltip" title="Add Scene Object"></div>
		<div id="add-distant-object" data-toggle="tooltip" title="Add Distant Object"></div>
	`),

	regions: {
		add_scene_object: '#add-scene-object',
		add_distant_object: '#add-distant-object',
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
		this.showChildView('add_scene_object', new AddSceneObjectButtonView({
			parent: this
		}));
		this.showChildView('add_distant_object', new AddDistantObjectButtonView({
			parent: this
		}));
	}
});
