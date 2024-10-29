/******************************************************************************\
|                                                                              |
|                             status-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'status panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-signal"></i>Status</label>
		</div>
		
		<ul class="nav list">
			<li>
				<label><i class="fa fa-wifi"></i></label>Online
				<% if (is_online) { %>
				<div class="value"><i class="success fa fa-check"></i></div>
				<% } else { %>
				<div class="value"><i class="warning fa fa-xmark"></i></div>
				<% } %>
			</li>
		
			<li>
				<label><i class="fa fa-power-off"></i></label>Active
				<% if (is_active) { %>
				<div class="value"><i class="success fa fa-check"></i></div>
				<% } else { %>
				<div class="value"><i class="warning fa fa-xmark"></i></div>
				<% } %>
			</li>
		</ul>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			is_online: this.model.isOnline(),
			is_active: this.model.isActive()	
		};
	}
});