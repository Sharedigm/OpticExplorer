/******************************************************************************\
|                                                                              |
|                       search-options-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single search option.                 |
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

export default BaseView.extend( {

	//
	// attributes
	//

	tagName: 'li',

	template: template(`
		<div>
			<span class="primary"><%= primary %></span>, 
			<span class="secondary"><%= secondary %></span>
		</div>
	`),

	events: {
		'click': 'onClick'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.model.get('description');
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		if (this.parent.options.onclick) {
			this.parent.options.onclick(this.getValue());
			this.parent.destroy();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.removeTooltips();
	}
});