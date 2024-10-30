/******************************************************************************\
|                                                                              |
|                               menu-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's menu bar.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuBarView from '../../../../../views/apps/desktop/header-bar/menu-bar/menu-bar-view.js';
import FileMenuView from '../../../../../views/apps/spectrum-editor/header-bar/menu-bar/menus/file-menu-view.js';
import ViewMenuView from '../../../../../views/apps/spectrum-editor/header-bar/menu-bar/menus/view-menu-view.js';
import ShareMenuView from '../../../../../views/apps/spectrum-editor/header-bar/menu-bar/menus/share-menu-view.js';
import HelpMenuView from '../../../../../views/apps/spectrum-editor/header-bar/menu-bar/menus/help-menu-view.js';

export default MenuBarView.extend({

	//
	// attributes
	//

	template: template(`
		<li class="file dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-file"></i><span class="dropdown-title">File</span></a>
			<div class="dropdown-menu"></div>
		</li>
		
		<li class="view dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-eye"></i><span class="dropdown-title">View</span></a>
			<div class="dropdown-menu"></div>
		</li>
		
		<li class="share dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-share"></i><span class="dropdown-title">Share</span></a>
			<div class="dropdown-menu"></div>
		</li>
		
		<li class="help dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-question-circle"></i><span class="dropdown-title">Help</span></a>
			<div class="dropdown-menu"></div>
		</li>
	`),

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		MenuBarView.prototype.onRender.call(this);

		// show dropdown menus
		//
		this.showChildView('file', new FileMenuView());
		this.showChildView('view', new ViewMenuView());
		this.showChildView('share', new ShareMenuView());
		this.showChildView('help', new HelpMenuView());
	}
});