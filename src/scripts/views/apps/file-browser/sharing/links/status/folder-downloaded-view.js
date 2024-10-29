/******************************************************************************\
|                                                                              |
|                           folder-downloaded-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show that a folder has been downloaded.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-cloud-download-alt"></i>Folder Downloaded</h1>
		
		<div class="content">
			<p>Please check your downloads folder for the file '<%= folder_name %>.zip'. </p>
			<p>Note: If you do not see this file in your downloads folder, then check the address bar of your web browser to allow popups / downloads from this website and then check again. </p>
		
			<p>Thank you for using <a href="#"><%= application.name %></a>.</p>
		</div>
	`),

	//
	// rendering methods
	//
	
	templateContext: function() {
		return {
			folder_name: this.options.folderName
		};
	},
});
