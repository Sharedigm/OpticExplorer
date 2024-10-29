/******************************************************************************\
|                                                                              |
|                            file-downloaded-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show that a file has been downloaded.          |
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
		<h1><i class="fa fa-cloud-download-alt"></i>File Downloaded</h1>
		
		<div class="content">
			<p>Please check your downloads folder for the file '<%= filename %>'. </p>
		
			<p>Thank you for using <a href="#"><%= application.name %></a>.</p>
		</div>
	`),

	//
	// rendering methods
	//
	
	templateContext: function() {
		return {
			filename: this.options.filename
		};
	},
});
