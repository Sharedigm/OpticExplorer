/******************************************************************************\
|                                                                              |
|                             link-invalid-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show that a link is not valid.                 |
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
		<h1><i class="fa fa-link"></i>Link Invalid</h1>

		<div class="content">
			<p>This is not a valid link. The link may not be valid for one of the following reasons:</p>

			<ul>
				<li>the link has been entered or copied incorrectly</li>
				<li>the owner of the link has deleted the link</li>
			</ul>

			<p>Please check the link or contact the creator of this link to have them send you a new link.</p>
		</div>
	`)
});
