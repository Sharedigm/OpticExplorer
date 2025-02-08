/******************************************************************************\
|                                                                              |
|                              app-loadable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for loading applications.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// dynamic loading methods
	//

	loadAppView: function(appName, options) {
		let dirname = appName.replace(/_/g, '-');
		let filename = dirname + '-view.js';

		import(
			'../../../' + dirname + '/' + filename
		).then((AppView) => {
			options.success(AppView? AppView.default : undefined);
		}).catch(error => {
			options.error(error);
		});
	}
};