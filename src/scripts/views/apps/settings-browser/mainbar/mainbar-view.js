/******************************************************************************\
|                                                                              |
|                               mainbar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's mainbar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import PreferencesPanelView from '../../../../views/apps/settings-browser/mainbar/panels/preferences-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'panels',

	template: template(`
		<div class="preferences"></div>
	`),

	regions: {
		preferences: {
			el: '.preferences',
			replaceElement: true
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showChildView('preferences', new PreferencesPanelView(this.options));
	}
});