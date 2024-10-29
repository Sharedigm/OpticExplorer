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
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppMenuBarView from '../../../../../views/apps/common/header-bar/menu-bar/app-menu-bar-view.js';
import RunMenuView from '../../../../../views/apps/desktop/header-bar/menu-bar/menus/run-menu-view.js';

export default AppMenuBarView.extend({

	//
	// attributes
	//

	runMenuTemplate: template(`
		<li class="run dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-play"></i><span class="dropdown-title">Run</span></a>
			<div class="dropdown-menu"></div>
		</li>
	`),

	//
	// querying methods
	//

	hasRunMenu: function() {
		return this.getParentView('app').isDesktop() && application.settings.desktop.get('launcher_style') == 'menu';
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppMenuBarView.prototype.onRender.call(this);

		// add run menu
		//
		if (this.hasRunMenu()) {

			// add run menu element
			//
			let $el = $(this.runMenuTemplate());
			this.$el.prepend($el);

			// add run menu region
			//
			this.addRegion('run', {
				el: $el.find('.dropdown-menu'),
				replaceElement: true
			});

			// show run menu
			//
			this.showChildView('run', new RunMenuView());
		}
	}
});