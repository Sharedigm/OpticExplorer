/******************************************************************************\
|                                                                              |
|                            link-restricted-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show that a link has exceeded its              |
|        download limit.                                                       |
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
		<h1><i class="fa fa-cloud-download-alt"></i>Link Limit Exceeded</h1>

		<div class="content">
			<p>This link has exceeded the limit on the number of downloads that the creator of this link specified for it to remain active. </p>

			<p>If you would like to download this file, you will need to contact the creator of this link to have them increase the download limit of this link or send you a new link.</p>
		</div>
	`)
});
