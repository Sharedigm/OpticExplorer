/******************************************************************************\
|                                                                              |
|                            material-tools-view.js                            |
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
import AddMaterialButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/materials/buttons/add-material-button-view.js';
import ShowDataEditorButtonView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/materials/buttons/show-data-editor-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="add-material" data-toggle="tooltip" title="Add Material"></div>
		<div id="show-data-editor" data-toggle="tooltip" title="Show Data Editor"></div>
	`),

	regions: {
		'add-material': '#add-material',
		'show-data-editor': '#show-data-editor'
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
		this.showChildView('add-material', new AddMaterialButtonView({
			parent: this
		}));
		this.showChildView('show-data-editor', new ShowDataEditorButtonView({
			parent: this
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.app = this.getParentView('app');
		this.getChildView('show-data-editor').activate();
	}
});