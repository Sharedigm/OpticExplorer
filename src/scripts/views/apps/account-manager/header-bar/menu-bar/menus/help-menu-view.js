/******************************************************************************\
|                                                                              |
|                              help-menu-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying help dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HelpMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/help-menu-view.js';

export default HelpMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .view-about-info': 'onClickViewAboutInfo',
		'click .view-app': 'onClickViewApp',
		'click .view-topic': 'onClickViewTopic',
		'click .contact-us': 'onClickContactUs'
	}
});