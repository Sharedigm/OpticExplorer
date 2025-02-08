/******************************************************************************\
|                                                                              |
|                             theme-button-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import ButtonView from '../../../../../views/apps/common/toolbars/buttons/button-view.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-paint-brush"></i>',

	//
	// setting methods
	//

	setThemeIndex: function(index) {
		this.constructor.index = index;

		application.loadApp('theme_manager', {

			// callbacks
			//
			success: (ThemeManagerView) => {

				// load theme
				//
				ThemeManagerView.loadTheme(new File({
					path: config.defaults.themes[index].path
				}), {

					// callbacks
					//
					success: () => {
						ThemeManagerView.saveSettings({
							theme: application.settings.theme,
							desktop: application.settings.desktop,
							dialogs: application.settings.dialogs
						});
					}
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add tooltip info
		//
		this.$el.attr({
			'data-toggle': 'tooltip',
			'title': 'Theme'
		});
	},

	showTheme: function() {
		if (this.constructor.index < config.defaults.themes.length - 1) {
			this.setThemeIndex(this.constructor.index + 1);
		} else {
			this.setThemeIndex(0);
		}
	},

	showThemePicker: function() {
		application.launch('theme_picker');
	},

	//
	// mouse event methods
	//

	onClick: function() {
		this.showThemePicker();
	}
}, {

	//
	// static attributes
	//

	index: 0
});