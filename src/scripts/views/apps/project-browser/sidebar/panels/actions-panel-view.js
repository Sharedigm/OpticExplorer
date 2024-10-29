/******************************************************************************\
|                                                                              |
|                             actions-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'actions panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-play-circle"></i>Actions</label>
		</div>
		
		<ul class="nav menu">
			<li class="new-project"><a><i class="fa fa-plus"></i>New Project</a></li>
		</ul>
	`),

	events: {
		'click .new-project a': 'onClickNewProject'
	},	

	//
	// setting methods
	//

	setNumSelected: function(numSelected) {
		if (numSelected == 0) {
			this.$el.find('.add-projects').addClass('disabled');
		} else {
			this.$el.find('.add-projects').removeClass('disabled');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// hide / show actions
		//
		if (this.options.hidden && this.options.hidden['add-projects']) {
			this.$el.find('.add-projects').hide();
		}
	},

	//
	// mouse event handling methods
	//

	onClickNewProject: function() {

		// show new dialog
		//
		this.app.showNewProjectDialog();

		// close parent app
		//
		this.app.close();
	},

	//
	// event handling methods
	//

	onChangeSelected: function() {
		this.setNumSelected(this.app.numSelected());
	}
});