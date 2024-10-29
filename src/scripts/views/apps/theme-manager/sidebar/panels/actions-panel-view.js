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
			<li class="save-as" style="display:none"><a><i class="fa fa-save"></i>Save As</a></li>
			<li class="reset"><a><i class="fa fa-redo"></i>Reset</a></li>
		</ul>
	`),

	events: {
		'click .save-as a': 'onClickSaveAs',
		'click .reset a': 'onClickReset'
	},

	//
	// mouse event handling methods
	//

	onClickSaveAs: function() {
		this.app.saveAs();
	},

	onClickReset: function() {
		this.app.reset();
	}
});