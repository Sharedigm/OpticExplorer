/******************************************************************************\
|                                                                              |
|                               app-pager-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a page carousel view of a collection of apps.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PagerView from '../../../../../views/items/pages/pager-view.js';
import AppPagesView from '../../../../../views/apps/settings-manager/mainbar/app-pages/app-pages-view.js';

export default PagerView.extend({

	//
	// attributes
	//

	childView: AppPagesView
});