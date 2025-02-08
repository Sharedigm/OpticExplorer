/******************************************************************************\
|                                                                              |
|                           desktop-toolbar-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a desktop toolbar.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../views/apps/common/toolbars/toolbar-view.js';
import ThemeButtonView from '../../../../views/apps/desktop/toolbar/buttons/theme-button-view.js';
import BrightnessButtonView from '../../../../views/apps/desktop/toolbar/buttons/brightness-button-view.js';
import MuteButtonView from '../../../../views/apps/desktop/toolbar/buttons/mute-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="desktop-only windowed-only">
			<button class="view-full-screen button" data-toggle="tooltip" title="Full Screen">
				<i class="fa fa-desktop"></i>
			</button>
		</div>	
		<div class="desktop-only full-screen-only">
			<button class="view-windowed button" data-toggle="tooltip" title="Windowed">
				<i class="far fa-window-restore"></i>
			</button>
		</div>
		<div class="desktop-only theme"></div>
		<div class="desktop-only brightness"></div>
		<div class="desktop-only mute"></div>
	`),

	regions: {
		theme: '.theme',
		brightness: '.brightness',
		mute: '.mute'
	},

	events: {
		'click .view-full-screen': 'onClickFullScreen',
		'click .view-windowed': 'onClickFullScreen'
	},

	//
	// rendering methods
	//

	onRender: function() {
		let settings = application.desktop? application.desktop.settings : undefined;
		let launcherStyle = settings? settings.get('launcher_style') : undefined;

		// show child views
		//
		if (application.hasEnabledApp('theme_picker')) {
			this.showChildView('theme', new ThemeButtonView());
		}
		this.showChildView('brightness', new BrightnessButtonView());
		this.showChildView('mute', new MuteButtonView());

		// add tooltip triggers
		//
		this.addTooltips({
			placement: launcherStyle == 'taskbar'? 'top' : 'bottom',
			container: 'body'
		});
	},

	//
	// mouse event handling methods
	//

	onClickFullScreen: function() {
		application.toggleFullScreen();
	}
});