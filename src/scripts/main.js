/******************************************************************************\
|                                                                              |
|                                   main.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application entry point and loading.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

// load configuration files
//
Promise.all([
	fetch('config/config.json').then(response => response.json()),
	fetch('config/apps.json').then(response => response.json()),
	fetch('config/branding.json').then(response => response.json()),
	fetch('config/defaults.json').then(response => response.json()),
	fetch('config/files.json').then(response => response.json()),
	fetch('config/fonts.json').then(response => response.json()),
	fetch('config/help.json').then(response => response.json()),
	fetch('config/keycodes.json').then(response => response.json()),
	fetch('config/preferences.json').then(response => response.json()),
	fetch('config/sounds.json').then(response => response.json()),
	fetch('config/theme.json').then(response => response.json()),
	fetch('config/welcome.json').then(response => response.json())
]).then((files) => {

	// set globals
	//
	let i = 0;
	window.config = files[i++];
	window.config.apps = files[i++];
	window.config.branding = files[i++];
	window.config.defaults = files[i++];
	window.config.files = files[i++];
	window.config.fonts = files[i++];
	window.config.help = files[i++];
	window.config.keycodes = files[i++];
	window.config.preferences = files[i++];
	window.config.sounds = files[i++];
	window.config.theme = files[i++];
	window.config.welcome = files[i++];

	// load application
	//
	import('./application.js').then((Application) => {

		// go!
		//
		$(document).ready(() => {
			window.application = new Application.default({});

			// start!
			//
			application.start();
		});
	});
});