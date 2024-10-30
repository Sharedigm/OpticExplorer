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
import ShowGridButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/viewports/buttons/show-grid-button-view.js';
import ShowOpticalAxisButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/viewports/buttons/show-optical-axis-button-view.js';
import ShowPerpendicularAxisButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/viewports/buttons/show-perpendicular-axis-button-view.js';
import ShowDataEditorButtonView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/viewports/buttons/show-data-editor-button-view.js';

export default ButtonGroupView.extend({

	//
	// attributes
	//

	tools: _.template(`
		<div id="show-grid" data-toggle="tooltip" title="Show Grid"></div>
		<div id="show-optical-axis" data-toggle="tooltip" title="Show Optical Axis"></div>
		<div id="show-perpendicular-axis" data-toggle="tooltip" title="Show Perpendicular Axis"></div>
		<div id="show-data-editor" data-toggle="tooltip" title="Show Data Editor"></div>
	`),

	regions: {
		show_grid: '#show-grid',
		show_optical_axis: '#show-optical-axis',
		show_perpendicular_axis: '#show-perpendicular-axis',
		show_data_editor: '#show-data-editor'
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
		this.showChildView('show_optical_axis', new ShowOpticalAxisButtonView({
			parent: this
		}));
		this.showChildView('show_perpendicular_axis', new ShowPerpendicularAxisButtonView({
			parent: this
		}));
		this.showChildView('show_data_editor', new ShowDataEditorButtonView({
			parent: this
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.app = this.getParentView('app');
		this.getChildView('show_grid').activate();
		this.getChildView('show_optical_axis').activate();
		this.getChildView('show_perpendicular_axis').activate();
		this.getChildView('show_data_editor').activate();
	}
});
