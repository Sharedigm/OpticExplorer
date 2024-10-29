/******************************************************************************\
|                                                                              |
|                               app-pages-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a collection of app pages.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PagesView from '../../../../../views/items/pages/pages-view.js';
import AppPageView from '../../../../../views/apps/settings-manager/mainbar/app-pages/app-page-view.js';

export default PagesView.extend({

	//
	// attributes
	//

	// className: 'desktop preview',

	//
	// attributes
	//

	childView: AppPageView
});